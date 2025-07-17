import { reactive, toRaw } from 'vue'

// СТРУКТУРА ДАННЫХ
const defaultState = {
  games: [],
  selectedGameId: null,
  selectedSceneId: null,
  selectedScriptId: null,
}

function load() {
  const raw = localStorage.getItem('scenario-data')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return { ...defaultState, ...parsed }
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

export { state, defaultState, saveState }
