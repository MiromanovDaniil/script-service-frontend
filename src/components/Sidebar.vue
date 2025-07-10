<template>
  <div id="sidebar">
    <button @click="addScene" class="btn">Создать сцену</button>
    <Scenes @addScript="addScript" :scenes="scenes"/>
  </div>
</template>

<style scoped>
  #sidebar{
    width: 25%;
  }
</style>

<script>
import Scenes from "@/components/Scenes.vue";
import {state} from "@/store.js";
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