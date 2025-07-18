<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>{{ $t('register.title') }}</h1>
      <form @submit.prevent="submit">
        <div class="form-group">
          <input v-model="mail" type="email" class="input" :placeholder="$t('register.mail')" />
        </div>
        <div class="form-group">
          <input v-model="name" class="input" :placeholder="$t('register.name')" />
        </div>
        <div class="form-group">
          <input v-model="surname" class="input" :placeholder="$t('register.surname')" />
        </div>
        <div class="form-group">
          <input v-model="password" class="input" type="password" :placeholder="$t('register.password')" />
        </div>
        <div class="form-group">
          <input v-model="password2" class="input" type="password" :placeholder="$t('register.password2')" />
        </div>
        <div class="error-t">
          {{this.error}}
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
import { submitData } from '@/../api/api.js'
import logger from '@/logger'
import notifications from '@/notifications'

export default {
  name: 'RegisterPage',
  data() {
    return {
      mail: '',
      name: '',
      surname: '',
      password: '',
      password2: '',
      error: '',
      fieldsToValidate: ['mail', 'name', 'surname', 'password']
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
      if (this.password != this.password2){
        this.error = 'Пароли не совпадают';
        return false
      }
      return true;
    },
    submit() {
      if (!this.validate()) return;
      else this.error = "";

      let regData = {
        "mail": this.mail,
        "name": this.name,
        "surname": this.surname,
        "password": this.password,
      } 
      submitData(regData, "register").then(response => {
        if(response.error){
          this.error = response.data.response.data.detail[0].msg;
          logger.add('Register failed');
        }
        else{
          logger.add('User registered')
          this.$router.push('/login')
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
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.3s;
}

.login-link {
  margin-top: 1rem;
}
</style>
