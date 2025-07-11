<template>
  <div class="scenario-view">
    <input v-model="scenario.name" class="scenario-name" placeholder="Название сценария" />
    <textarea
      v-model="scenario.description"
      class="scenario-description"
      placeholder="Краткое описание сценария"
    ></textarea>

    <div class="scenario-actions">
      <button @click="back" v-if="stack.length">Назад</button>
    </div>

    <div class="breadcrumbs">
      <span
        v-for="(node, i) in breadcrumbs"
        :key="node.id"
        class="crumb"
        @click="openBreadcrumb(i)"
      >
        {{ i === 0 ? 'Root' : node.text.slice(0, 20) }}
        <span v-if="i < breadcrumbs.length - 1"> / </span>
      </span>
    </div>

    <div class="canvas" ref="canvasRef" @mousedown="startPan">
      <div
        class="canvas-content"
        :style="{ transform: `translate(${offsetX}px, ${offsetY}px)` }"
      >
        <svg class="lines">
          <line
            v-for="(l, i) in lines"
            :key="i"
            :x1="l.x1"
            :y1="l.y1"
            :x2="l.x2"
            :y2="l.y2"
            stroke="#888"
          />
        </svg>

        <div class="canvas-inner">
          <div
            v-for="node in flatNodes"
            :key="node.id"
            class="node"
            :style="{ left: node.meta.x + 'px', top: node.meta.y + 'px' }"
          >
            <div class="node-content">
              <div class="text">{{ node.text }}</div>
              <div class="actions">
                <button @click="() => addChild(node)">+</button>
                <button @click="() => deleteNode(node)">🗑</button>
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

interface DialogNode {
  id: string
  text: string
  children: DialogNode[]
  meta?: { x?: number; y?: number }
}

interface Scenario {
  name: string
  description: string
  root: DialogNode
}

const scenario = ref<Scenario>({
  name: 'Новый сценарий',
  description: '',
  root: {
    id: 'root',
    text: 'Начало',
    children: [],
    meta: {},
  },
})

const currentRoot = ref<DialogNode>(scenario.value.root)
const stack = ref<DialogNode[]>([])
const breadcrumbs = computed(() => [...stack.value, currentRoot.value])

const offsetX = ref(0)
const offsetY = ref(0)
const canvasRef = ref<HTMLDivElement | null>(null)

const NODE_WIDTH = 120
const NODE_HEIGHT = 60

function layoutTree() {
  const hGap = 180
  const vGap = 120
  const next = { val: 0 }

  function walk(node: DialogNode, depth: number) {
    if (!node.meta) node.meta = {}
    if (node.children.length === 0) {
      node.meta.x = next.val * hGap
      node.meta.y = depth * vGap
      next.val++
    } else {
      const start = next.val
      node.children.forEach((c) => walk(c, depth + 1))
      const end = next.val - 1
      const mid = (start + end) / 2
      node.meta.x = mid * hGap
      node.meta.y = depth * vGap
    }
  }

  if (currentRoot.value) walk(currentRoot.value, 0)
}

function animateCenterTo(x: number, y: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const centerX = canvas.clientWidth / 2 - x
  const centerY = 40

  offsetX.value = centerX
  offsetY.value = centerY
}

function centerCanvasToRoot() {
  if (!currentRoot.value?.meta) return
  animateCenterTo(currentRoot.value.meta.x || 0, currentRoot.value.meta.y || 0)
}

function centerCanvasToNode(node: DialogNode) {
  if (!node?.meta) return
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
function endPan() {
  panning = false
  window.removeEventListener('mousemove', onPan)
  window.removeEventListener('mouseup', endPan)
}

onMounted(() => {
  layoutTree()
  nextTick(() => {
    centerCanvasToRoot()
  })
  window.addEventListener('resize', centerCanvasToRoot)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', centerCanvasToRoot)
})

const flatNodes = computed(() => {
  const arr: DialogNode[] = []
  function walk(node: DialogNode) {
    arr.push(node)
    node.children.forEach(walk)
  }
  if (currentRoot.value) walk(currentRoot.value)
  return arr
})

interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
}

const lines = computed(() => {
  const arr: Line[] = []
  function walk(node: DialogNode) {
    node.children.forEach((c) => {
      arr.push({
        x1: (node.meta?.x || 0) + NODE_WIDTH / 2,
        y1: (node.meta?.y || 0) + NODE_HEIGHT / 2,
        x2: (c.meta?.x || 0) + NODE_WIDTH / 2,
        y2: (c.meta?.y || 0) + NODE_HEIGHT / 2,
      })
      walk(c)
    })
  }
  if (currentRoot.value) walk(currentRoot.value)
  return arr
})

function addChild(node: DialogNode) {
  const newNode: DialogNode = {
    id: Date.now().toString(),
    text: 'Новый узел',
    children: [],
    meta: {},
  }

  node.children.push(newNode)
  layoutTree()

  nextTick(() => {
    if (!newNode.meta?.x || !newNode.meta?.y) return
    const canvas = canvasRef.value
    if (!canvas) return
    offsetX.value = canvas.clientWidth / 2 - newNode.meta.x!
    offsetY.value = canvas.clientHeight / 2 - newNode.meta.y!
  })
}



function deleteNode(node: DialogNode) {
  function remove(target: DialogNode, nodes: DialogNode[]): boolean {
    const idx = nodes.indexOf(target)
    if (idx !== -1) {
      nodes.splice(idx, 1)
      return true
    }
    for (const n of nodes) {
      if (remove(target, n.children)) return true
    }
    return false
  }
  remove(node, [scenario.value.root])
  if (currentRoot.value === node) back()
  layoutTree()
  centerCanvasToRoot()
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
  width: 10000px;
  height: 10000px;
  pointer-events: none;
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
