<template>
  <div id="scenes">
    <SceneItem v-for="scene of scenes" :key="scene.id" :scene="scene" @addScript="addScript" />
  </div>
</template>

<script>
import SceneItem from '@/components/SceneItem.vue'

export default {
  name: 'Scenes',
  props: ['scenes'],
  components: {
    SceneItem,
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene)
    },
  },
}
</script>
