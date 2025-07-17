<template>
  <div id="scenes">
    <Scrollview :w="'100%'" :h="'100%'">
      <SceneItem
        v-if="scenes && scenes.length > 0"
        :key="scene.id"
        v-for="scene of scenes"
        :scene="scene"
        @addScript="addScript"
        @editScene="editScene"
        @deleteScene="deleteScene"
        @editScript="editScript"
        @deleteScript="deleteScript"
      />
    </Scrollview>
  </div>
</template>

<style scoped>
#scenes {
  background: #f3e8ff;
  height: calc(100% - 36px);
}
</style>

<script>
import SceneItem from './SceneItem.vue'
import Scrollview from '@/components/Scrollview.vue'

export default {
  name: 'Scenes',
  props: ['scenes'],
  components: {
    Scrollview,
    SceneItem,
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene)
    },
    editScene(scene) {
      this.$emit('editScene', scene)
    },
    deleteScene(scene) {
      this.$emit('deleteScene', scene)
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
