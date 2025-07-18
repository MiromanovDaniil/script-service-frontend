import { reactive } from 'vue'

const notifications = reactive([])

function notify(message) {
  notifications.push({ message, time: new Date().toISOString(), id: Date.now() })
}

function remove(id) {
  const idx = notifications.findIndex(n => n.id === id)
  if (idx !== -1) notifications.splice(idx, 1)
}

export default { notifications, notify, remove }
