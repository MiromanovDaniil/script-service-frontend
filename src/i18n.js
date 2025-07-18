import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    games: {
      total: 'Total games',
      create: 'Create game'
    },
    stats: {
      title: 'Statistics'
    },
    settings: {
      title: 'Settings',
      darkTheme: 'Dark theme',
      language: 'Language'
    },
    common: {
      close: 'Close'
    },
    login: {
      title: 'Login',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      register: 'Register'
    },
    register: {
      title: 'Registration',
      username: 'Username',
      password: 'Password',
      signup: 'Sign Up',
      login: 'Log In'
    }
  },
  ru: {
    games: {
      total: 'Всего игр',
      create: 'Создать игру'
    },
    stats: {
      title: 'Статистика'
    },
    settings: {
      title: 'Настройки',
      darkTheme: 'Тёмная тема',
      language: 'Язык интерфейса'
    },
    common: {
      close: 'Закрыть'
    },
    login: {
      title: 'Вход',
      username: 'Имя пользователя',
      password: 'Пароль',
      login: 'Войти',
      register: 'Регистрация'
    },
    register: {
      title: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      signup: 'Зарегистрироваться',
      login: 'Войти'
    }
  }
}

const locale = localStorage.getItem('locale') || 'ru'

export default createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages
})
