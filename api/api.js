import axios from 'axios';

// Функция для отправки данных
export const submitDialogData = async (data) => {
  try {
    const response = await axios.post(
      'http://10.82.170.113:8005/api/generate', // Замените на реальный URL API
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

// Пример использования
const dialogData = {
  npc: {
    name: "Гарри",
    profession: "маг",
    goal: "найти древний артефакт",
    talk_style: "загадочный, мудрый",
    traits: "умный, терпеливый, немного рассеянный"
  },
  hero: {
    name: "Лира",
    profession: "искательница приключений",
    goal: "разгадать тайну артефакта",
    talk_style: "прямолинейная, любопытная",
    traits: "храбрая, решительная, иногда импульсивная"
  },
  world_settings: "фэнтезийный мир с магией",
  NPC_to_hero_relation: "наставник к ученику",
  hero_to_NPC_relation: "ученик к наставнику",
  mx_answers_cnt: 3,
  mn_answers_cnt: 1,
  mx_plot_branches_cnt: 2,
  mx_depth: 5,
  mn_depth: 2,
  goals: [
    {
      type: "найти",
      object: "древний артефакт",
      condition: "до лунного затмения"
    }
  ]
};

// Вызов функции
submitDialogData(dialogData)
  .then(response => console.log('Успех:', response))
  .catch(error => console.error('Ошибка:', error));