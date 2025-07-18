import axios from 'axios';

// Функция для отправки данных
export const submitData = async (data, endpoint) => {
  try {
    const response = await axios.post(
      'http://10.82.49.236:8005/api/' + endpoint, // Замените на реальный URL API
      data,
      {
        headers: {
          'Content-Type': 'application/json',

          // 'Authorization': 'Bearer your_token' // Раскомментируйте если нужна авторизация
        },
      },
    )
    return response.data;
  } catch (error) {
    return {
      error: true,
      data: error
    }
  }
};