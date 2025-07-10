<template>
  <div id="scenes">
    <SceneItem v-for="scene of scenes" :scene="scene" @addScript="addScript" />
  </div>
</template>

<style scoped>

</style>

<script>
import SceneItem from "./SceneItem.vue";

export default {
  name: 'Scenes',
  props: ['scenes'],
  components: {
    SceneItem
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene);
    }
  }
}

</script>