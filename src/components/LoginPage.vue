<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>{{ $t('login.title') }}</h1>
      <form @submit.prevent="submit">
        <div class="form-group">
          <input v-model="mail" type="email" class="input" :placeholder="$t('login.mail')" />
        </div>
        <div class="form-group">
          <input v-model="password" class="input" type="password" :placeholder="$t('login.password')" />
        </div>
        <div class="error-t">
          {{this.error}}
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
import { submitData } from '@/../api/api'
import { load, saveState, setToken, state } from '@/store'
import { toRaw } from 'vue'
import logger from '@/logger'
import notifications from '@/notifications'

export default {
  name: 'LoginPage',
  data() {
    return {
      mail: '',
      password: '',
      error: '',
      fieldsToValidate: ['mail', 'password']
    }
  },
  methods: {
    validate() {
      for (const element of this.fieldsToValidate) {
        if (!(this[element].trim())){
          this.error = 'Все поля обязательны для заполнения';
          return false;
        }
      }
      return true;
    },
    submit() {
      if (!this.validate()) return;
      else this.error = "";

      let loginData = {
        "mail": this.mail,
        "password": this.password,
      } 
      submitData(loginData, "login", true).then(response => {
        if(response.data){
          this.error = response.data.detail;
          logger.add('Login failed')
          notifications.notify('Login failed')
        }
        else{
          if (response) {
            logger.add('User logged in')
            notifications.notify('User logged in')
            sessionStorage.setItem("token", response.access_token);
            sessionStorage.setItem("user_id", response.user.id);
            this.$router.push('/')
          }
        }
      })
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
  user-select: none;
}

.error-t {
  color: rgb(173, 0, 0);
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
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s;
}

.register-link {
  margin-top: 1rem;
}
</style>
