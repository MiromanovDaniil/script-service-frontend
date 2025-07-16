import axios from 'axios';

// Функция для отправки данных
export const submitDialogData = async (data) => {
  try {
    const response = await axios.post(
      'http://10.82.46.222:8005/api/generate', // Замените на реальный URL API
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
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
};