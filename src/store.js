import { reactive, toRaw } from 'vue'

// СТРУКТУРА ДАННЫХ
const defaultState = {
  games: [],
  selectedGameId: null,
  selectedSceneId: null,
  selectedScriptId: null,
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

export { state, defaultState, saveState, setToken, clearToken, updateUser }
