import axios from 'axios'

// Функция для отправки данных
export const submitData = async (data, endpoint, credentials = false) => {
  console.log(document)
  try {
    const response = await axios.post(`https://10.82.56.167:8005/api/${endpoint}`, data, {
      headers: {
            'Content-Type': 'application/json',
          },
      withCredentials: credentials,
      validateStatus: (status) => {
        // Считаем успешными только 2xx статусы
        return status >= 200 && status < 300
      },
    })

    // Проверяем наличие ошибок в теле ответа
    if (response.data?.error || response.data?.status === "error") {
      return {
        error: true,
        data: response.data
      };
    }

    return response.data;
  } catch (error) {
    // Обработка сетевых ошибок и ответов с HTTP статусом ≠ 2xx
    return {
      error: true,
      data: error.response?.data || error.message
    };
  }
}

export const fetchData = async (endpoint, params = {}, credentials = false) => {
  try {
    const config = {
      headers: {
            'Content-Type': 'application/json',
          },
      params, // Параметры запроса
      withCredentials: credentials,
      validateStatus: (status) => status >= 200 && status < 300,
    }

    const response = await axios.get(`https://10.82.56.167:8005/api/${endpoint}`, config)

    // Проверяем наличие ошибок в теле ответа
    if (response.data?.error || response.data?.status === 'error') {
      return {
        error: true,
        data: response.data,
      }
    }

    return response.data
  } catch (error) {
    // Обработка сетевых ошибок и ответов с HTTP статусом ≠ 2xx
    return {
      error: true,
      data: error.response?.data || error.message,
    }
  }
}

export async function fetchProtectedData() {
  try {
    const response = await api.get('/protected')
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // access token истёк — пробуем обновить
      try {
        await api.post('/refresh')
        // Повторяем запрос после обновления токена
        const response = await api.get('/protected')
        return response.data
      } catch (refreshError) {
        // Обновление не удалось — нужно перелогиниться
        throw new Error('Unauthorized, please login again')
      }
    } else {
      throw error
    }
  }
}
