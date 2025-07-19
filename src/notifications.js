import { reactive } from 'vue'

const notifications = reactive([])

function notify(message, error = false, timeout = 10000) {
  const id = Date.now()
  notifications.push({
    message,
    time: new Date().toISOString(),
    id,
    timeout,
    background: error
      ? 'linear-gradient(135deg, #fad1d1ff, #f3a7a7ff)'
      : 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    bar: error ? '#b91010ff' : '#10b981',
    text: error ? '#4e0606ff' : '#064e3b',
  })
  if (timeout > 0) {
    setTimeout(() => remove(id), timeout)
  }
}

function remove(id) {
  const idx = notifications.findIndex((n) => n.id === id)
  if (idx !== -1) notifications.splice(idx, 1)
}

export default { notifications, notify, remove }
