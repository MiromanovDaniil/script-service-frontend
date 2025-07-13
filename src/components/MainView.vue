<template>
  <div class="scenario-view">
    <input v-model="scenario.name" class="scenario-name" placeholder="Название диалога" />
    <textarea
      v-model="scenario.description"
      class="scenario-description"
      placeholder="Краткое описание диалога"
    ></textarea>

    <div class="scenario-actions">
      <button @click="back" v-if="stack.length">Назад</button>
    </div>

    <div class="canvas" ref="canvasRef" @mousedown="startPan">
      <div class="canvas-content" :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }">
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          <line
            v-for="(l, i) in lines"
            :key="i"
            :x1="l.x1"
            :y1="l.y1"
            :x2="l.x2"
            :y2="l.y2"
            stroke="#888"
            stroke-width="2"
            marker-end="url(#arrow)"
          />
        </svg>

        <div class="canvas-inner">
          <div
            v-for="node in flatNodes"
            :key="node.id"
            class="node"
            :class="{ selected: connectingFrom?.id === node.id }"
            :style="{ left: node.meta?.x + 'px', top: node.meta?.y + 'px' }"
          >
            <div class="node-content">
              <div class="text">{{ node.line }}</div>
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
  type?: string;       // сделаем необязательным
  mood?: string;       // сделаем необязательным
  goal_achieve?: number; // сделаем необязательным
  to: GraphEdge[];     // теперь здесь объекты связей
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
  return scenario.value.data.find(n => n.id == id); // Нестрогое сравнение ==
}

function layoutTree() {
  const hGap = 180;
  const vGap = 120;
  const next = { val: 0 };

  function walk(node: GraphNode, depth: number) {
    if (!node.meta) node.meta = {};
    if (!node.to) node.to = [];

    // Получаем полные узлы из связей
    const children = node.to
      .map(edge => findNodeById(edge.id))
      .filter((c): c is GraphNode => !!c);

    if (children.length === 0) {
      node.meta.x = next.val * hGap;
      node.meta.y = depth * vGap;
      next.val++;
    } else {
      const start = next.val;
      children.forEach((c) => walk(c, depth + 1));
      const end = next.val - 1;
      const mid = (start + end) / 2;
      node.meta.x = mid * hGap;
      node.meta.y = depth * vGap;
    }
  }

  if (currentRoot.value) {
    walk(currentRoot.value, 0);
  }
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
  if ((e.target as HTMLElement).closest('.node')) return
  panning = true
  panStartX = e.clientX - offsetX.value
  panStartY = e.clientY - offsetY.value
  window.addEventListener('mousemove', onPan)
  window.addEventListener('mouseup', endPan)
}
function onPan(e: MouseEvent) {
  if (!panning) return
  offsetX.value = e.clientX - panStartX
  offsetY.value = e.clientY - panStartY
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
  if (state.selectedSceneId === null || state.selectedScriptId === null) {
    emit('createScene');
  } else {
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
    nextTick(() => centerCanvasToRoot());
  }
      }
    }
  }
});

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
  const visited = new Set<string>()
  const result: GraphNode[] = []

  function walk(node: GraphNode) {
    // Проверка на существование node
    if (!node) return;
    if (visited.has(node.id)) return;
    
    visited.add(node.id);
    result.push(node);
    
    // Используем node.to или пустой массив по умолчанию
    (node.to || []).forEach((id) => {
      const child = findNodeById(id);
      if (child) walk(child);
    });
  }

  // Проверяем currentRoot перед вызовом walk
  if (currentRoot.value) {
    walk(currentRoot.value);
  }
  return result;
});

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

const lines = computed(() => {
  const arr: Line[] = [];
  const visited = new Set<string | number>();

  function walk(node: GraphNode) {
    if (!node) return;
    if (visited.has(node.id)) return;
    
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
        });

        walk(child);
      }
    });
  }

  if (currentRoot.value) {
    walk(currentRoot.value);
  }
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
  background: #121212;
  color: #eee;
  box-sizing: border-box;
}

.scenario-description,
.scenario-name {
  font-size: 1rem;
  margin-bottom: 12px;
  padding: 6px 8px;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 4px;
  color: inherit;
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
  color: #5af;
  user-select: none;
}

.canvas {
  position: relative;
  height: 600px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
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
  position: absolute;
  width: 120px;
  background: #282828;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 6px;
  color: #ddd;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
}

.node.selected {
  outline: 2px solid #5af;
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
  background: #444;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #666;
}
</style>