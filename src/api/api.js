import axios from 'axios'

export const submitDialogData = async (data) => {
  try {
    const response = await axios.post(
      'http://10.82.246.20:8005/api/generate',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при отправке данных:', error)
    throw error
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      'http://10.82.246.20:8005/api/login',
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при входе:', error)
    throw error
  }
}

export const registerUser = async (credentials) => {
  try {
    const response = await axios.post(
      'http://10.82.246.20:8005/api/register',
      credentials,
      { headers: { 'Content-Type': 'application/json' } }
    )
    return response.data
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    throw error
  }
}
