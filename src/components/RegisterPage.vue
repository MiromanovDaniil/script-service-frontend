<template>
  <div class="auth-page">
    <h1>Регистрация</h1>
    <form @submit.prevent="submit">
      <div>
        <input v-model="username" class="input" placeholder="Имя пользователя" />
      </div>
      <div>
        <input v-model="password" class="input" type="password" placeholder="Пароль" />
      </div>
      <button type="submit" class="btn">Зарегистрироваться</button>
      <p><router-link to="/login">Войти</router-link></p>
    </form>
  </div>
</template>

<script>
import { registerUser } from '@/api/api.js'
import logger from '@/logger'

export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async submit() {
      try {
        await registerUser({ username: this.username, password: this.password })
        logger.add('User registered')
        this.$router.push('/login')
      } catch (e) {
        logger.add('Register failed')
      }
    }
  }
}
</script>
