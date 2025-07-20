import axios from 'axios'

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: 'http://10.82.56.167:8005/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерсептор для автоматической подстановки токена
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Функция для обработки ответов
const handleResponse = (response) => {
  if (response.data?.error || response.data?.status === 'error') {
    return {
      error: true,
      data: response.data,
    }
  }
  return response.data
}

// Функция для обработки ошибок
const handleError = (error) => {
  return {
    error: true,
    data: error.response?.data || error.message,
  }
}

// Функция для отправки данных
export const submitData = async (data, endpoint, requiresAuth = false) => {
  try {
    // Если не требуется авторизация - создаем новый экземпляр без интерсептора
    const client = requiresAuth
      ? api
      : axios.create({
          baseURL: 'http://10.82.56.167:8005/api/',
          headers: { 'Content-Type': 'application/json' },
        })

    const response = await client.post(endpoint, data, {
      validateStatus: (status) => status >= 200 && status < 300,
    })

    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

// Функция для получения данных
export const fetchData = async (endpoint, params = {}, requiresAuth = false) => {
  try {
    // Если не требуется авторизация - создаем новый экземпляр без интерсептора
    const client = requiresAuth
      ? api
      : axios.create({
          baseURL: 'http://10.82.56.167:8005/api/',
          headers: { 'Content-Type': 'application/json' },
        })

    const response = await client.get(endpoint, {
      params,
      validateStatus: (status) => status >= 200 && status < 300,
    })

    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}

// Функция для получения защищенных данных с обработкой просроченного токена
export const fetchProtectedData = async () => {
  try {
    const response = await api.get('/protected')
    return handleResponse(response)
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        // Пытаемся обновить токен
        const refreshResponse = await api.post('/refresh')

        // Сохраняем новый токен
        const newToken = refreshResponse.data.access_token
        sessionStorage.setItem('token', newToken)

        // Повторяем исходный запрос
        const retryResponse = await api.get('/protected')
        return handleResponse(retryResponse)
      } catch (refreshError) {
        // Очищаем токен при неудачном обновлении
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user_id')
        return {
          error: true,
          data: 'Session expired. Please login again.',
        }
      }
    }
    return handleError(error)
  }
}

// Функция для выхода из системы
export const logout = async () => {
  try {
    await api.post('/logout')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user_id')
    return { success: true }
  } catch (error) {
    return handleError(error)
  }
}
