<template>
  <div class="scenario-view"
  >
    <input v-model="scenario.name" class="scenario-name" placeholder="Название диалога" />

    <button class="btn" @click="download">
      Скачать
    </button>

    <textarea
      v-model="scenario.description"
      class="scenario-description"
      placeholder="Краткое описание диалога"
    ></textarea>

    <div class="scenario-actions">
      <button @click="back" v-if="stack.length">Назад</button>
    </div>

    <div class="zoom-controls">
      <button @click="zoomIn">+</button>
      <button @click="resetZoom">100%</button>
      <button @click="zoomOut">-</button>
      <span class="scale-display">{{ Math.round(scale * 100) }}%</span>
    </div>

    <div class="canvas" ref="canvasRef" @mousedown="startPan" @wheel="handleWheel">
      <div class="canvas-content" :style="{ 
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: '0 0'
        }">
        <svg
          class="lines"
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
          :width="svgWidth"
          :height="svgHeight"
          style="overflow: visible;"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
            </marker>
          </defs>



          <line
  v-for="(l, i) in lines"
  :key="'line-' + i"
  :x1="l.x1"
  :y1="l.y1"
  :x2="l.x2"
  :y2="l.y2"
  stroke="#a78bfa"
  stroke-width="2"
  marker-end="url(#arrow)"
/>
<text
  v-for="(l, i) in lines"
  :key="'text-' + i"
  :x="(l.x1 + l.x2) / 2"
  :y="(l.y1 + l.y2) / 2 - 5"
  fill="#4b5563"
  font-size="12"
  text-anchor="middle"
>
  {{ l.label.split(' ').slice(0, 5).join(' ') }}
  </text>
        </svg>

        <div class="canvas-inner">
          <div
    v-for="node in flatNodes"
    :key="node.id"
    class="node"
    :class="{ 
      selected: connectingFrom?.id === node.id,
      dragging: draggingNode?.id === node.id
    }"
    :style="{ 
      left: node.meta?.x + 'px', 
      top: node.meta?.y + 'px',
      cursor: draggingNode?.id === node.id ? 'grabbing' : 'grab'
    }"
    @mousedown="(e) => startDrag(e, node)"
  >
            <div class="node-content">
              <div class="text-container">
                <div class="text-short">{{ node.line.split(' ').slice(0, 10).join(' ') }}...</div>
                <div class="text-full">{{ node.line }}</div>
              </div>
              <div class="actions">
                <button @click="() => addChild(node)">+</button>
                <button @click="() => deleteNode(node)">🗑</button>
                <button @click="() => connectNode(node)">🔗</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { state } from '@/store'
import { mount } from '@vue/test-utils'
import { useRoute } from 'vue-router'

function downloadF(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function download(){
  let name = 'scene.json';
  let game = state.games.find(g => g.id == state.selectedGameId);
  let scripts = game.scenes.find(s => s.id == state.selectedSceneId).scripts
  let res = [];
  scripts.forEach(element => {
    if (Object.keys(element.result).length > 0){
      let r = {}
      r["data"] = element.result.data;
      r["npc_name"] = game.characters.find(c => c.id == element.npc).name;
      r["hero_name"] = game.characters.find(c => c.id == element.main_character).name;
      res.push(r);
    }
  });
  downloadF(name, JSON.stringify(res));
}

const route = useRoute()
const emit = defineEmits(['createScene'])

interface GraphEdge {
  id: string | number;
  line: string;
}

interface GraphNode {
  id: string | number;
  line: string;
  info: string;
  type?: string;       
  mood?: string;       
  goal_achieve?: number; 
  to: GraphEdge[];     
  meta?: { x?: number; y?: number };
}

interface Scenario {
  name: string;
  description: string;
  data: GraphNode[];
}

const scenario = ref<Scenario>({
  name: 'Новый диалог',
  description: '',
  data: [
    {
      id: 'root',
      line: 'Начало',
      info: '',
      type: 'start',
      mood: 'neutral',
      goal_achieve: 0,
      to: [],
      meta: {},
    },
  ],
})

const currentRoot = ref<GraphNode>(scenario.value.data[0])
const stack = ref<GraphNode[]>([])
const breadcrumbs = computed(() => [...stack.value, currentRoot.value])

const NODE_WIDTH = 120
const NODE_HEIGHT = 60

const offsetX = ref(0)
const offsetY = ref(0)
const canvasRef = ref<HTMLDivElement | null>(null)

function findNodeById(id: string | number): GraphNode | undefined {
  
  return scenario.value.data.find(n => n.id == id);
}


const draggingNode = ref<GraphNode | null>(null);
const dragStartX = ref(0);
const dragStartY = ref(0);
const nodeStartX = ref(0);
const nodeStartY = ref(0);



function startDrag(e: MouseEvent, node: GraphNode) {
  e.stopPropagation();
  draggingNode.value = node;
  
  dragStartX.value = e.clientX;
  dragStartY.value = e.clientY;
  nodeStartX.value = node.meta?.x || 0;
  nodeStartY.value = node.meta?.y || 0;
  
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
}

function onDrag(e: MouseEvent) {
  if (!draggingNode.value || !draggingNode.value.meta) return;
  
  const dx = e.clientX - dragStartX.value;
  const dy = e.clientY - dragStartY.value;
  
  draggingNode.value.meta.x = nodeStartX.value + dx;
  draggingNode.value.meta.y = nodeStartY.value + dy;
}

function endDrag() {
  draggingNode.value = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
}

function layoutTree() {
  const hGap = 300;
  const vGap = 200;
  const visited = new Set<string | number>();
  const nextMap = new Map<number, number>(); // Для отслеживания позиций на уровнях

  function walk(node: GraphNode, depth: number) {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);
    
    if (!node.meta) node.meta = {};
    if (!node.to) node.to = [];
    
    // Инициализация счетчика для уровня
    if (!nextMap.has(depth)) nextMap.set(depth, 0);
    const next = nextMap.get(depth)!;
    
    // Обработка детей
    const children = node.to
      .map(edge => findNodeById(edge.id))
      .filter((c): c is GraphNode => !!c);
    
    if (children.length === 0) {
      node.meta.x = next * hGap;
      node.meta.y = depth * vGap;
      nextMap.set(depth, next + 1);
    } else {
      // Сохраняем начальную позицию для детей
      const startDepth = depth + 1;
      children.forEach(child => walk(child, startDepth));
      
      // Позиционируем родителя по центру детей
      const childPositions = children
        .filter(c => c.meta?.x !== undefined)
        .map(c => c.meta!.x!);
      
      if (childPositions.length > 0) {
        const minX = Math.min(...childPositions);
        const maxX = Math.max(...childPositions);
        node.meta.x = (minX + maxX) / 2;
      } else {
        node.meta.x = next * hGap;
      }
      
      node.meta.y = depth * vGap;
      nextMap.set(depth, next + 1);
    }
  }

  // Сбрасываем счетчики и обходим от корня
  visited.clear();
  nextMap.clear();
  
  if (currentRoot.value) {
    walk(currentRoot.value, 0);
  }
  
  // Обрабатываем несвязанные узлы
  scenario.value.data.forEach(node => {
    if (!visited.has(node.id)) {
      walk(node, 0);
    }
  });
}


const scale = ref(1); 
const minScale = 0.3; 
const maxScale = 3; 
const scaleStep = 0.1; 

function handleWheel(e: WheelEvent) {
  e.preventDefault();
  
  const delta = -Math.sign(e.deltaY);
  
  let newScale = scale.value + delta * scaleStep;
  
  newScale = Math.max(minScale, Math.min(maxScale, newScale));
  
  if (newScale === scale.value) return;
  
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  offsetX.value = mouseX - (mouseX - offsetX.value) * (newScale / scale.value);
  offsetY.value = mouseY - (mouseY - offsetY.value) * (newScale / scale.value);
  
  scale.value = newScale;
}

function zoomIn() {
  scale.value = Math.min(maxScale, scale.value + scaleStep);
}

function zoomOut() {
  scale.value = Math.max(minScale, scale.value - scaleStep);
}

function resetZoom() {
  scale.value = 1;
  centerCanvasToRoot();
}




function animateCenterTo(x: number, y: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  offsetX.value = canvas.clientWidth / 2 - x
  offsetY.value = 40
}

function centerCanvasToRoot() {
  if (!currentRoot.value || !currentRoot.value.meta) {
    return
  }
  animateCenterTo(currentRoot.value.meta.x || 0, currentRoot.value.meta.y || 0)
}

function centerCanvasToNode(node: GraphNode) {
  if (!node || !node.meta) {
    return
  }
  animateCenterTo(node.meta.x || 0, node.meta.y || 0)
}

let panStartX = 0
let panStartY = 0
let panning = false

function startPan(e: MouseEvent) {
  if (draggingNode.value || (e.target as HTMLElement).closest('.node')) return;
  
  panning = true;
  panStartX = e.clientX - offsetX.value * scale.value;
  panStartY = e.clientY - offsetY.value * scale.value;
  window.addEventListener('mousemove', onPan);
  window.addEventListener('mouseup', endPan);
}

function onPan(e: MouseEvent) {
  if (!panning) return;
  offsetX.value = (e.clientX - panStartX) / scale.value;
  offsetY.value = (e.clientY - panStartY) / scale.value;
}
function getRectEdgeIntersection(
  cx: number,
  cy: number,
  w: number,
  h: number,
  px: number,
  py: number
): { x: number; y: number } {

  const dx = px - cx
  const dy = py - cy

  if (dx === 0 && dy === 0) {
    return { x: cx, y: cy }
  }

  const scaleX = (w / 2) / Math.abs(dx)
  const scaleY = (h / 2) / Math.abs(dy)

  const scale = Math.min(scaleX, scaleY)

  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
  }
}

function endPan() {
  panning = false
  window.removeEventListener('mousemove', onPan)
  window.removeEventListener('mouseup', endPan)
}

onMounted(() => {
    const game = state.games.find(g => g.id === route.params.id);
    if (game) {
      const scene = game.scenes.find(s => s.id === state.selectedSceneId);
      if (scene) {
        const script = scene.scripts.find(s => s.id === state.selectedScriptId);
        if (script) {
    let loadedData: GraphNode[] = [];
    
    if (Array.isArray(script.result?.data)) {
      loadedData = script.result.data.map(node => ({
        ...node,
        to: node.to ? node.to.map(edge => ({ 
          id: edge.id, 
          line: edge.line || '' 
        })) : [],
        meta: node.meta || {}
      }));
    }

    if (script?.result?.data) {
      scenario.value.data = script.result.data.map(node => ({
        ...node,
        to: node.to || [], // Гарантируем, что to будет массивом
        meta: node.meta || {}
      }));
    }

    // Если данных нет - создаем корневой узел
    if (loadedData.length === 0) {
      loadedData = [{
        id: 1,
        line: 'Начало',
        info: '',
        to: [],
        meta: {}
      }];
    }

    scenario.value = {
      name: script.name || 'Новый диалог',
      description: script.description || '',
      data: loadedData
    };

    currentRoot.value = scenario.value.data[0];
    layoutTree();
    nextTick(() => {
  layoutTree();
  
  // Центрируем на весь граф
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  flatNodes.value.forEach(node => {
    const x = node.meta?.x || 0;
    const y = node.meta?.y || 0;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  animateCenterTo(centerX, centerY);
});
  }
      }
    }
  }
);

function createRootNode(): GraphNode {
  return {
    id: 'root',
    line: 'Начало',
    info: '',
    type: 'start',
    mood: 'neutral',
    goal_achieve: 0,
    to: [],
    meta: { x: 0, y: 0 }
  };
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', centerCanvasToRoot)
})

const flatNodes = computed(() => {
  const result: GraphNode[] = [];
  const visited = new Set<string | number>();

  // Рекурсивный обход с обработкой всех детей
  function walk(node: GraphNode) {
    if (!node || visited.has(node.id)) return;
    
    visited.add(node.id);
    result.push(node);
    
    // Обрабатываем все дочерние связи
    node.to.forEach(edge => {
      const child = findNodeById(edge.id);
      if (child) walk(child);
    });
  }

  // Обход начинаем только с корневого узла
  if (currentRoot.value) {
    walk(currentRoot.value);
  }
  
  // Добавляем несвязанные узлы (если есть)
  scenario.value.data.forEach(node => {
    if (!visited.has(node.id)) {
      result.push(node);
    }
  });

  return result;
});

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
  label: string
}

const lines = computed(() => {
  const arr: Line[] = [];
  const visited = new Set<string | number>();

  function walk(node: GraphNode) {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);
    
    node.to.forEach(edge => {
      const child = findNodeById(edge.id);
      if (child && node.meta && child.meta) {
        const startCenterX = node.meta.x! + NODE_WIDTH / 2;
        const startCenterY = node.meta.y! + NODE_HEIGHT / 2;
        const endCenterX = child.meta.x! + NODE_WIDTH / 2;
        const endCenterY = child.meta.y! + NODE_HEIGHT / 2;

        const start = getRectEdgeIntersection(
          startCenterX,
          startCenterY,
          NODE_WIDTH,
          NODE_HEIGHT,
          endCenterX,
          endCenterY
        );

        const end = getRectEdgeIntersection(
          endCenterX,
          endCenterY,
          NODE_WIDTH,
          NODE_HEIGHT,
          startCenterX,
          startCenterY
        );

        arr.push({
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          label: edge.line || ''
        });

        walk(child);
      }
    });
  }

  // Обработка всех узлов
  visited.clear();
  scenario.value.data.forEach(node => {
    if (!visited.has(node.id)) {
      walk(node);
    }
  });
  
  return arr;
});

const svgWidth = computed(() => {
  const maxX = Math.max(...flatNodes.value.map(n => (n.meta?.x ?? 0) + NODE_WIDTH))
  return maxX + 100
})

const svgHeight = computed(() => {
  const maxY = Math.max(...flatNodes.value.map(n => (n.meta?.y ?? 0) + NODE_HEIGHT))
  return maxY + 100
})

function addChild(parentNode: GraphNode) {
  const newId = Date.now(); // Генерируем числовой ID
  
  const newNode: GraphNode = {
    id: newId,
    line: 'Новый узел',
    info: '',
    to: [], // Пустой массив связей для нового узла
    meta: {}
  };

  // Добавляем новый узел в массив данных
  scenario.value.data.push(newNode);
  
  // Добавляем связь от родительского узла к новому
  parentNode.to.push({
    id: newId,
    line: newNode.line
  });

  // Перестраиваем дерево и центрируем на новый узел
  layoutTree();
  nextTick(() => centerCanvasToNode(newNode));
}

function deleteNode(nodeToDelete: GraphNode) {
  // 1. Удаляем сам узел из данных
  scenario.value.data = scenario.value.data.filter(
    node => node.id !== nodeToDelete.id
  );

  // 2. Удаляем все ссылки на этот узел из других узлов
  scenario.value.data.forEach(node => {
    node.to = node.to.filter(edge => edge.id !== nodeToDelete.id);
  });

  // 3. Если удалили текущий корень - возвращаемся назад
  if (currentRoot.value?.id === nodeToDelete.id) {
    back();
  }

  // 4. Перестраиваем дерево и центрируем
  layoutTree();
  centerCanvasToRoot();
}

function back() {
  const prev = stack.value.pop()
  if (prev) currentRoot.value = prev
  layoutTree()
  centerCanvasToRoot()
}

function openBreadcrumb(index: number) {
  currentRoot.value = breadcrumbs.value[index]
  stack.value = breadcrumbs.value.slice(0, index)
  layoutTree()
  centerCanvasToRoot()
}

const connectingFrom = ref<GraphNode | null>(null)

function connectNode(targetNode: GraphNode) {
  if (!connectingFrom.value) {
    // Если начало связи не выбрано - выбираем текущий узел
    connectingFrom.value = targetNode;
  } else {
    // Если начало связи уже выбрано - создаём связь
    const sourceNode = connectingFrom.value;
    
    // Проверяем, что связь не ведёт к тому же узлу и не дублируется
    const isSameNode = sourceNode.id === targetNode.id;
    const alreadyConnected = sourceNode.to.some(edge => edge.id == targetNode.id);
    
    if (!isSameNode && !alreadyConnected) {
      sourceNode.to.push({
        id: targetNode.id,
        line: targetNode.line
      });
    }
    
    // Сбрасываем выбор начала связи
    connectingFrom.value = null;
    layoutTree();
  }
}
</script>

<style scoped>
.scenario-view {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: #f3e8ff;
  color: #3b0764;
  box-sizing: border-box;
  user-select: none;
}

.scenario-description,
.scenario-name {
  font-size: 1rem;
  margin-bottom: 12px;
  padding: 6px 8px;
  background: #ede9fe;
  border: 1px solid #c4b5fd;
  border-radius: 4px;
  color: #3b0764;
  width: 100%;
}

.scenario-name {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.scenario-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 8px;
}

.breadcrumbs {
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.crumb {
  cursor: pointer;
  color: #9333ea; 
  user-select: none;
}

.canvas {
  position: relative;
  height: 600px;
  background: #e9d5ff;
  border: 1px solid #d8b4fe;
  border-radius: 8px;
  overflow: hidden;
  cursor:grab;
}

.canvas:active {
  cursor: grabbing;
}

.canvas-content {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.5s ease;
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: visible;
}

.canvas-inner {
  position: absolute;
  top: 0;
  left: 0;
}

.node {
  cursor: pointer;
  position: absolute;
  width: 120px;
  background: #ddd6fe;
  border: 1px solid #c4b5fd;
  border-radius: 6px;
  padding: 6px;
  color: #3b0764;
  box-shadow: 0 0 6px rgba(124, 58, 237, 0.3);
}

.node.selected {
  outline: 2px solid #7c3aed;
}

.node-content .text {
  font-weight: bold;
  margin-bottom: 4px;
}

.actions {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.actions button {
  font-size: 0.8em;
  padding: 2px 6px;
  border: none;
  background: #c4b5fd;
  color: #3b0764;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #a78bfa;
}

.text-container {
  position: relative;
}

.text-full {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #ddd6fe;
  border: 1px solid #ddd;
  padding: 8px;
  z-index: 100;
  width: 300px;
  border: 1px solid #c4b5fd;
  border-radius: 6px;
  padding: 6px;
  color: #3b0764;
  box-shadow: 0 0 6px rgba(124, 58, 237, 0.3);
}

.text-container:hover .text-short {
  display: none;
}

.text-container:hover .text-full {
  display: block;
}

.node.dragging {
  z-index: 1000;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
  opacity: 0.9;
}

.canvas-content {
  transition: transform 0.1s ease;
}

.zoom-controls {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.8);
  padding: 6px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zoom-controls button {
  width: 28px;
  height: 28px;
  border: 1px solid #c4b5fd;
  background: #ddd6fe;
  border-radius: 4px;
  cursor: pointer;
}

.zoom-controls button:hover {
  background: #c4b5fd;
}

.scale-display {
  display: inline-block;
  min-width: 50px;
  text-align: center;
  line-height: 28px;
  font-size: 0.9em;
}

</style>