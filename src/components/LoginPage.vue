<template>
  <div class="auth-page">
    <h1>Вход</h1>
    <form @submit.prevent="submit">
      <div>
        <input v-model="username" class="input" placeholder="Имя пользователя" />
      </div>
      <div>
        <input v-model="password" class="input" type="password" placeholder="Пароль" />
      </div>
      <button type="submit" class="btn">Войти</button>
      <p><router-link to="/register">Регистрация</router-link></p>
    </form>
  </div>
</template>

<script>
import { loginUser } from '@/api/api.js'
import { setToken } from '@/store'
import logger from '@/logger'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit() {
      try {
        const result = await loginUser({ username: this.username, password: this.password })
        if (result && result.token) {
          setToken(result.token)
          logger.add('User logged in')
          this.$router.push('/')
        }
      } catch (e) {
        logger.add('Login failed')
      }
    }
  }
}
</script>
