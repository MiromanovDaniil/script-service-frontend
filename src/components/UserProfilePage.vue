<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Профиль</h1>
      <form @submit.prevent="save">
        <div class="avatar-group">
          <img v-if="avatarPreview" :src="avatarPreview" class="avatar" />
          <input type="file" accept="image/*" @change="onFileChange" />
        </div>
        <div class="form-group">
          <input v-model="firstName" class="input" placeholder="Имя" />
        </div>
        <div class="form-group">
          <input v-model="lastName" class="input" placeholder="Фамилия" />
        </div>
        <div class="form-group">
          <input v-model="email" class="input" type="email" placeholder="Email" />
        </div>
        <button type="submit" class="btn">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<script>
import { state, updateUser } from '@/store'
export default {
  name: 'UserProfilePage',
  data() {
    return {
      firstName: state.user.firstName,
      lastName: state.user.lastName,
      email: state.user.email,
      avatar: state.user.avatar,
      avatarPreview: state.user.avatar,
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => {
        this.avatar = ev.target.result
        this.avatarPreview = ev.target.result
      }
      reader.readAsDataURL(file)
    },
    save() {
      updateUser({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        avatar: this.avatar,
      })
      this.$router.push('/')
    },
  },
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
.avatar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
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
</style>
