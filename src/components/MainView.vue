<template>
  <div class="scenario-view"
  >
    <div class="scenario-name" placeholder="Название диалога">{{scenario.name}}</div>
    <div class="scenario-description" placeholder="Краткое описание диалога">{{ scenario.description }}</div>

    <button class="btn" @click="saveScript">Сохранить</button>

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
  
  <!-- Маркеры для текста -->
  <g v-for="(l, i) in lines" :key="'marker-' + i">
    <circle
  :cx="l.markerX"
  :cy="l.markerY"
  r="5"
  fill="#a78bfa"
  opacity="0.5"
  @mouseenter="hoveredLineIndex = i"
  @mouseleave="hoveredLineIndex = null"
  @click.stop="editEdge(findNodeByPosition(l.x1, l.y1), findEdgeIndex(l))"
  style="cursor: pointer;"
/>
    
    
<g v-if="hoveredLineIndex === i" class="tooltip-group">
  <rect
    :x="l.markerX - l.tooltipWidth/2"
    :y="l.markerY - 30"
    :width="l.tooltipWidth"
    height="24"
    rx="4"
    fill="white"
    stroke="#c4b5fd"
    stroke-width="1"
  />
  <text
    :x="l.markerX"
    :y="l.markerY - 15"
    fill="#4b5563"
    font-size="12"
    text-anchor="middle"
    style="pointer-events: none;"
  >
    {{ l.tooltipText }}
  </text>
</g>

  </g>
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
        
<button @click="() => addChild(node)" class="icon-button">
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#7e22ce">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
</button>
<button @click="() => editNode(node)" class="icon-button">
  <svg viewBox="0 0 24 24" width="32" height="32" stroke="#7e22ce" fill="#00000000" stroke-width="1.5px">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
</button>
<button @click="() => deleteNode(node)" class="icon-button">
  <svg viewBox="0 0 24 24" width="32" height="32" stroke="#7e22ce" fill="#00000000" stroke-width="1.5px">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
</button>
<button @click="() => connectNode(node)" class="icon-button">
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#7e22ce">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </svg>
</button>
<button @click="() => playSpeech(node.line)" class="icon-button" title="Прослушать">
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#7e22ce">
    <path d="M5 9v6h4l5 5V4l-5 5H5z"/>
    <path d="M14.5 12c0-1.77-.73-3.37-1.9-4.53l1.06-1.06C15.33 7.6 16 9.71 16 12s-.67 4.4-2.34 5.59l-1.06-1.06A6.996 6.996 0 0 0 14.5 12z"/>
  </svg>
</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

     <RegenerateModal
      :showModal="showEditModal"
      :initialMainPrompt="editingNode?.line || ''"
      :initialAdditionalPrompt="editingNode?.info || ''"
      @close="closeEditModal"
      @submit="handleNodeSubmit"
      @regenerate="handleNodeRegenerate"
    />

    <dialog 
  v-if="showEdgeModal"
  class="edge-dialog" 
  open
  @click.self="closeEdgeModal"
>
  <h3 class="dialog-title">Редактировать</h3>
  <textarea v-model="edgeText" class="edge-textarea"></textarea>
  <div class="dialog-actions">
    <button @click="closeEdgeModal">Отмена</button>
    <button @click="saveEdgeText">Сохранить</button>
  </div>
</dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { state, saveState } from '@/store'
import notifications from '@/notifications'
import { mount } from '@vue/test-utils'
import { useRoute, useRouter } from 'vue-router'
import RegenerateModal from '@/components/RegenerateModal.vue';

const hoveredLineIndex = ref<number | null>(null);


function playSpeech(text: string) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const storedVoiceName = localStorage.getItem('voiceName') || '';
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.name === storedVoiceName);
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['createScene'])

const editingNode = ref<GraphNode | null>(null);
const showEditModal = ref(false);

interface GraphEdge {
  id: string | number;
  line: string;
  info: string;
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
  if (!node.meta) node.meta = {};
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
  
  const dx = (e.clientX - dragStartX.value) / scale.value;
  const dy = (e.clientY - dragStartY.value) / scale.value;
  
  draggingNode.value.meta.x = nodeStartX.value + dx;
  draggingNode.value.meta.y = nodeStartY.value + dy;
}

function endDrag() {
  draggingNode.value = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);
}


function findAvailablePosition(nearX: number, nearY: number): { x: number; y: number } {
  const gridSize = 80; // Увеличено с 50
  let attempts = 0;
  const maxAttempts = 100;
  
  for (let radius = 1; radius < 10 && attempts < maxAttempts; radius++) {
    for (let angle = 0; angle < Math.PI * 2 && attempts < maxAttempts; angle += Math.PI / 4) {
      attempts++;
      const x = nearX + Math.round(Math.cos(angle) * radius) * gridSize;
      const y = nearY + Math.round(Math.sin(angle) * radius) * gridSize;
      
      const isOccupied = flatNodes.value.some(node => {
        const nodeX = node.meta?.x || 0;
        const nodeY = node.meta?.y || 0;
        return Math.abs(nodeX - x) < NODE_WIDTH && Math.abs(nodeY - y) < NODE_HEIGHT;
      });
      
      if (!isOccupied) {
        return { x, y };
      }
    }
  }
  
  return { x: nearX + NODE_WIDTH + 80, y: nearY };
}

function layoutTree() {
  const hGap = 400; 
  const vGap = 250; 
  const visited = new Set<string | number>();
  const nextMap = new Map<number, number>();
  const occupiedPositions = new Map<string, boolean>();

  function isPositionOccupied(x: number, y: number): boolean {
    const key = `${Math.round(x/10)}_${Math.round(y/10)}`;
    return occupiedPositions.has(key);
  }

  function markPositionOccupied(x: number, y: number) {
    const key = `${Math.round(x/10)}_${Math.round(y/10)}`;
    occupiedPositions.set(key, true);
  }

  function walk(node: GraphNode, depth: number) {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);
    
    if (!node.meta) node.meta = {};
    if (!node.to) node.to = [];
    
    if (!nextMap.has(depth)) nextMap.set(depth, 0);
    const next = nextMap.get(depth)!;
    
    const children = node.to
      .map(edge => findNodeById(edge.id))
      .filter((c): c is GraphNode => !!c);
    
    if (Object.keys(node.meta).length > 0) return;
    if (children.length === 0) {
      let x = next * hGap;
      let y = depth * vGap;
      let attempts = 0;
      
      while (isPositionOccupied(x, y) && attempts < 10) {
        x += 50;
        y += 50;
        attempts++;
      }
      
      node.meta.x = x;
      node.meta.y = y;
      markPositionOccupied(x, y);
      nextMap.set(depth, next + 1);
    } else {
      children.forEach(child => walk(child, depth + 1));
      
      const childPositions = children
        .filter(c => c.meta?.x !== undefined)
        .map(c => c.meta!.x!);
      
      if (childPositions.length > 0) {
        const minX = Math.min(...childPositions);
        const maxX = Math.max(...childPositions);
        node.meta.x = (minX + maxX) / 2;
        node.meta.y = depth * vGap;
        
        if (isPositionOccupied(node.meta.x, node.meta.y)) {
          node.meta.x += 100;
        }
        
        markPositionOccupied(node.meta.x, node.meta.y);
      } else {
        node.meta.x = next * hGap;
        node.meta.y = depth * vGap;
        markPositionOccupied(node.meta.x, node.meta.y);
      }
      
      nextMap.set(depth, next + 1);
    }
  }

  visited.clear();
  nextMap.clear();
  occupiedPositions.clear();
  
  if (currentRoot.value) {
    walk(currentRoot.value, 0);
  }
  
  scenario.value.data.forEach(node => {
    if (!visited.has(node.id)) {
      walk(node, 0);
    }
  });
}


function truncateText(text: string, maxWords: number): { text: string; width: number } {
  const words = text.split(' ');
  let resultText = text;
  if (words.length > maxWords) {
    resultText = words.slice(0, maxWords).join(' ') + '...';
  }
  const width = calculateTextWidth(resultText);
  return { text: resultText, width };
}

function calculateTextWidth(text: string, fontSize: number = 12): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 120; 
  
  context.font = `${fontSize}px Arial`;
  return context.measureText(text).width + 20;
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


function editNode(node: GraphNode) {
  editingNode.value = node;
  showEditModal.value = true;
  
}

function handleNodeSubmit({ main, additional }: { main: string; additional: string }) {
  if (editingNode.value) {
    editingNode.value.line = main;
    editingNode.value.info = additional;
  }
  closeEditModal();
}

function handleNodeRegenerate() {
  if (editingNode.value) {
    // РЕГЕНЕРАЦИЯ
    editingNode.value.line = `[Регенерировано] ${editingNode.value.line}`;
  }
}

function closeEditModal() {
  showEditModal.value = false;
  editingNode.value = null;
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
reloadGraph
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

function reloadGraph() {
  const game = state.games.find(g => g.id === route.params.id);
  if (game) {
    const scene = game.scenes.find(s => s.id === state.selectedSceneId);
    if (scene) {
      const script = scene.scripts.find(s => s.id === state.selectedScriptId);
      if (script) {
        // Объявляем loadedData здесь
        let loadedData: GraphNode[] = [];

        if (Array.isArray(script.result?.data)) {
          // Заполняем данными
          loadedData = script.result.data.map(node => ({
            ...node,
            to: node.to ? node.to.map(edge => ({ 
              id: edge.id, 
              line: edge.line || '' 
            })) : [],
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

        // Используем loadedData здесь
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
      } else {
        state.selectedSceneId = null;
        state.selectedScriptId = null;
        saveState();
      }
    } else {
      state.selectedSceneId = null;
      state.selectedScriptId = null;
      saveState();
    }
  } else {
    router.push('/');
  }
}

onMounted(reloadGraph);
watch(
  () => state.selectedScriptId,
  (val) => {
    reloadGraph();
  },
  { deep: true }
);

function saveScript() {
  state.games
    .find(g => g.id == state.selectedGameId)
    .scenes.find(s => s.id == state.selectedSceneId)
    .scripts.find(s => s.id == state.selectedScriptId).result = { data: scenario.value.data }
  saveState()
  notifications.notify('Script updated')
}
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
  markerX: number
  markerY: number
  tooltipWidth: number
  tooltipText: string
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

        const markerX = start.x + (end.x - start.x) * 0.7;
        const markerY = start.y + (end.y - start.y) * 0.7;
const { text: truncatedText, width } = truncateText(edge.line || '', 12);
        arr.push({
          x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
    label: edge.line || '',
    markerX,
    markerY,
    tooltipWidth: width,
    tooltipText: truncatedText
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

  const parentX = parentNode.meta?.x || 0;
  const parentY = parentNode.meta?.y || 0;

  const position = findAvailablePosition(parentX + NODE_WIDTH, parentY);

  const newNode: GraphNode = {
    id: newId,
    line: 'Новый узел',
    info: '',
    to: [],
    meta: {
      x: position.x,
      y: position.y
    }
  }



  scenario.value.data.push(newNode);
  parentNode.to.push({
    id: newId,
    line: 'Новая фраза',
    info: 'Текст кнопки'
  });

  layoutTree();
  //nextTick(() => centerCanvasToNode(newNode));
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
  //centerCanvasToRoot();
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
  
    connectingFrom.value = targetNode;
  } else {
    
    const sourceNode = connectingFrom.value;
    
    const isSameNode = sourceNode.id === targetNode.id;
    const alreadyConnected = sourceNode.to.some(edge => edge.id == targetNode.id);
    
    if (!isSameNode && !alreadyConnected) {
      sourceNode.to.push({
        id: targetNode.id,
        line: "Новая фраза",
        info: 'Текст кнопки'
      });
    }
    
    // Сбрасываем выбор начала связи
    connectingFrom.value = null;
    layoutTree();
  }
}

const editingEdge = ref<{node: GraphNode, index: number} | null>(null);
const showEdgeModal = ref(false);
const edgeText = ref('');

function editEdge(node: GraphNode, edgeIndex: number) {
  editingEdge.value = { node, index: edgeIndex };
  edgeText.value = node.to[edgeIndex].line;
  showEdgeModal.value = true;
}

function saveEdgeText() {
  if (editingEdge.value) {
    editingEdge.value.node.to[editingEdge.value.index].line = edgeText.value;
    closeEdgeModal();
  }
}

function closeEdgeModal() {
  showEdgeModal.value = false;
  editingEdge.value = null;
  edgeText.value = '';
}

function findNodeByPosition(x: number, y: number): GraphNode | null {
  return flatNodes.value.find(node => {
    const nodeX = node.meta?.x || 0;
    const nodeY = node.meta?.y || 0;
    return x >= nodeX && x <= nodeX + NODE_WIDTH && 
           y >= nodeY && y <= nodeY + NODE_HEIGHT;
  }) || null;
}

function findEdgeIndex(line: Line): number {
  const node = findNodeByPosition(line.x1, line.y1);
  if (!node) return -1;
  
  const targetNode = findNodeByPosition(line.x2, line.y2);
  if (!targetNode) return -1;
  
  return node.to.findIndex(edge => edge.id === targetNode.id);
}

defineExpose({
  reloadGraph
});

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
  will-change: transform; /* Оптимизация анимации */
}

.lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  pointer-events: bounding-box;
  overflow: visible;
}

.canvas-inner {
  position: absolute;
  top: 0;
  left: 0;
}

.node {
  position: absolute;
  transform: none !important;
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

.lines circle {
  transition: all 0.2s ease;
  pointer-events: all;
  r: 10;
   fill: #8b5cf6;
  opacity: 0.3;
}

.lines circle:hover {
  opacity: 1;
  r: 10;
}

.lines text {
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  font-size: 12px;
  color: #4b5563;
  pointer-events: none;
  user-select: none;
}

.tooltip-group rect {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tooltip-group text {
  dominant-baseline: middle;
  font-family: Arial, sans-serif;
}

.tooltip-group rect {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tooltip-group text {
  dominant-baseline: middle;
  font-family: Arial, sans-serif;
  pointer-events: none;
  user-select: none;
}

.zoom-controls {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #c4b5fd;
}

.zoom-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #c4b5fd;
  background: #ddd6fe;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.zoom-controls button:hover {
  background: #c4b5fd;
}

.scale-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 32px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}
.edge-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #c4b5fd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
}

.dialog-title {
  color: #3b0764;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.edge-textarea {
  width: 100%;
  min-height: 100px;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #c4b5fd;
  border-radius: 4px;
  display: block;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-actions button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.dialog-actions button:first-child {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
}

.dialog-actions button:last-child {
  background: #8b5cf6;
  color: white;
  border: none;
}

.icon-button {
  width: 22px;
  height: 22px;
  padding: 0;
  margin: 0 1px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: all 0.2s ease;
  position: relative;
}

.icon-button:hover {
  background-color: #f3e8ff;
}

.icon-button:hover .icon {
  fill: #6b21a8;
}

</style>
