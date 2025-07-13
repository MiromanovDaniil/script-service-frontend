<template>
  <div id="sidebar">
    <button @click="addScene" class="btn">Создать сцену</button>
    <Scenes @addScript="addScript" :scenes="scenes"/>
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

.btn {
  background-color: #7c3aed;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.15s ease;
}

.btn:hover {
  background-color: #6d28d9;
  transform: translateY(-1px);
}

.btn:active {
  background-color: #5b21b6;
  transform: scale(0.98);
}
</style>


<script>
import Scenes from "./Scenes.vue";
import {state} from "../store.js";
export default {
  name: 'Sidebar',
  props: ['scenes'],
  components: {
    Scenes
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene);
    },
    addScene() {
      this.$emit('addScene', state.selectedGameId);
    }
  }
}
</script>