<template>
  <div id="sidebar">
    <router-link to="/profile" class="sidebar-user">
      <img class="user-avatar" :src="state.user.avatar || '/assets/logo.png'" alt="avatar" />
      <span class="user-name">{{ state.user.firstName || 'username' }}</span>
    </router-link>
    <button @click="exit" class="btn">Игровая панель</button>
    <button @click="addScene" class="btn">Создать сцену</button>
    <Scenes
      @addScript="addScript"
      @editScene="editScene"
      @deleteScene="deleteScene"
      @editScript="editScript"
      @deleteScript="deleteScript"
      :scenes="scenes"
    />
  </div>
</template>

<style scoped>
#sidebar {
  width: 25%;
  min-height: 100vh;
  background-color: #f3e8ff;
  border-right: 1px solid #d6bcfa;
  padding-top: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  padding-left: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 2px 0 6px rgba(98, 0, 238, 0.05);
}
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding-left: 1rem;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 2px 12px #a78ed03c;
  background: linear-gradient(135deg, #c499fe 40%, #beecff 100%);
}
.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #7c37a5;
  letter-spacing: 0.2px;
}
</style>

<script>
import Scenes from './Scenes.vue'
import { state } from '../store.js'
export default {
  name: 'Sidebar',
  props: ['scenes'],
  components: {
    Scenes,
  },
  computed: {
    state() {
      return state
    },
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene)
    },
    addScene() {
      this.$emit('addScene', state.selectedGameId)
    },
    editScene(scene) {
      this.$emit('editScene', scene)
    },
    deleteScene(scene) {
      this.$emit('deleteScene', scene)
    },
    exit() {
      this.$router.push('/')
    },
    deleteScript(script, scene) {
      this.$emit('deleteScript', script, scene)
    },
    editScript(script, scene) {
      this.$emit('editScript', script, scene)
    },
  },
}
</script>
