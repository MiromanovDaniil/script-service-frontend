import { reactive } from 'vue'

const logs = reactive([])

function add(message) {
  logs.push({ message, time: new Date().toISOString() })
  console.log(message)
}

export default { logs, add }
