import { reactive, toRaw } from 'vue'

// СТРУКТУРА ДАННЫХ
const defaultState = {
  games: [],
  selectedGameId: null,
  selectedSceneId: null,
  selectedScriptId: null,
  sceneTemplates: [],
  scriptTemplates: [],
  token: null,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
  },
}

function load() {
  const raw = localStorage.getItem('scenario-data')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return {
        ...defaultState,
        ...parsed,
        user: { ...defaultState.user, ...(parsed.user || {}) },
        sceneTemplates: parsed.sceneTemplates || [],
        scriptTemplates: parsed.scriptTemplates || [],
      }
    } catch (e) {
      console.error('failed to parse state', e)
    }
  }
  return { ...defaultState }
}

const state = reactive(load())
function saveState() {
  localStorage.setItem('scenario-data', JSON.stringify(toRaw(state)))
}

function setToken(token) {
  state.token = token
  saveState()
}

function clearToken() {
  state.token = null
  saveState()
}

function updateUser(data) {
  state.user = { ...state.user, ...data }
  saveState()
}

function addSceneTemplate(template) {
  state.sceneTemplates.push(template)
  saveState()
}

function updateSceneTemplate(id, data) {
  const idx = state.sceneTemplates.findIndex((t) => t.id === id)
  if (idx !== -1) {
    state.sceneTemplates[idx] = { ...state.sceneTemplates[idx], ...data }
    saveState()
  }
}

function deleteSceneTemplate(id) {
  const idx = state.sceneTemplates.findIndex((t) => t.id === id)
  if (idx !== -1) {
    state.sceneTemplates.splice(idx, 1)
    saveState()
  }
}

function addScriptTemplate(template) {
  state.scriptTemplates.push(template)
  saveState()
}

function updateScriptTemplate(id, data) {
  const idx = state.scriptTemplates.findIndex((t) => t.id === id)
  if (idx !== -1) {
    state.scriptTemplates[idx] = { ...state.scriptTemplates[idx], ...data }
    saveState()
  }
}

function deleteScriptTemplate(id) {
  const idx = state.scriptTemplates.findIndex((t) => t.id === id)
  if (idx !== -1) {
    state.scriptTemplates.splice(idx, 1)
    saveState()
  }
}

export {
  state,
  defaultState,
  saveState,
  setToken,
  clearToken,
  updateUser,
  addSceneTemplate,
  addScriptTemplate,
  updateSceneTemplate,
  updateScriptTemplate,
  deleteSceneTemplate,
  deleteScriptTemplate,
}
