<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>{{ $t('login.title') }}</h1>
      <form @submit.prevent="submit">
        <div class="form-group">
          <input v-model="username" class="input" :placeholder="$t('login.username')" />
        </div>
        <div class="form-group">
          <input v-model="password" class="input" type="password" :placeholder="$t('login.password')" />
        </div>
        <button type="submit" class="btn">{{ $t('login.login') }}</button>
        <p class="register-link">
          <router-link to="/register">{{ $t('login.register') }}</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { loginUser } from '@/api/api.js'
import { setToken } from '@/store'
import logger from '@/logger'
import notifications from '@/notifications'

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
          notifications.notify('User logged in')
          this.$router.push('/')
        }
      } catch (e) {
        logger.add('Login failed')
        notifications.notify('Login failed')
      }
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: #f3f4f6;
}

.auth-container {
  background: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #2563eb;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #1d4ed8;
}

.register-link {
  margin-top: 1rem;
}
</style>
