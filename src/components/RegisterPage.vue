<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>{{ $t('register.title') }}</h1>
      <form @submit.prevent="submit">
        <div class="form-group">
          <input v-model="username" class="input" :placeholder="$t('register.username')" />
        </div>
        <div class="form-group">
          <input v-model="password" class="input" type="password" :placeholder="$t('register.password')" />
        </div>
        <button type="submit" class="btn">{{ $t('register.signup') }}</button>
        <p class="login-link">
          <router-link to="/login">{{ $t('register.login') }}</router-link>
        </p>
      </form>
    </div>
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
  border-color: #10b981;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #059669;
}

.login-link {
  margin-top: 1rem;
}
</style>
