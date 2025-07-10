<template>
  <div id="scenes">
    <SceneItem v-for="scene of scenes" :scene="scene" @addScript="addScript" />
  </div>
</template>

<style scoped>

</style>

<script>
import SceneItem from "@/components/SceneItem.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: 'Scenes',
  props: ['scenes'],
  components: {
    Sidebar,
    SceneItem
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene);
    }
  }
}
</script>