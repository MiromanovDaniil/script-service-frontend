import { reactive } from 'vue'

const notifications = reactive([])

function notify(message, timeout = 3000) {
  const id = Date.now()
  notifications.push({ message, time: new Date().toISOString(), id })
  if (timeout > 0) {
    setTimeout(() => remove(id), timeout)
  }
}

function remove(id) {
  const idx = notifications.findIndex((n) => n.id === id)
  if (idx !== -1) notifications.splice(idx, 1)
}

export default { notifications, notify, remove }
