import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    games: {
      total: 'Total games',
      create: 'Create game',
    },
    stats: {
      title: 'Statistics'
    },
    settings: {
      title: 'Settings',
      darkTheme: 'Dark theme',
      language: 'Language',
    },
    common: {
      close: 'Close',
    },
    login: {
      title: 'Login',
      mail: 'Email',
      password: 'Password',
      login: 'Login',
      register: 'Register',
    },
    register: {
      title: 'Registration',
      mail: 'Email',
      name: 'Name',
      surname: 'Surname',
      password: 'Password',
      password2: 'Verify password',
      signup: 'Sign Up',
      login: 'Log In',
    },
  },
  ru: {
    games: {
      total: 'Всего игр',
      create: 'Создать игру',
    },
    stats: {
      title: 'Статистика'
    },
    settings: {
      title: 'Настройки',
      darkTheme: 'Тёмная тема',
      language: 'Язык интерфейса',
    },
    common: {
      close: 'Закрыть',
    },
    login: {
      title: 'Вход',
      mail: 'Email',
      password: 'Пароль',
      login: 'Войти',
      register: 'Регистрация',
    },
    register: {
      title: 'Регистрация',
      mail: 'Email',
      name: 'Имя',
      surname: 'Фамилия',
      password: 'Пароль',
      password2: 'Подтвердите пароль',
      signup: 'Зарегистрироваться',
      login: 'Войти',
    },
  },
}

const locale = localStorage.getItem('locale') || 'ru'

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages
})
