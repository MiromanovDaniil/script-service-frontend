import { reactive, toRaw } from 'vue'
import { submitData, fetchData } from '../api/api'

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
  let res = fetchData(`users/me/data`, true)
  return res
}

const state = reactive({...defaultState})

function saveState() {
  console.log('save')
  console.log({ data: toRaw(state) })
  submitData({'data': toRaw(state)}, `users/me/upd/data`, true)
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

export { state, defaultState, load, saveState, setToken, clearToken, updateUser }
