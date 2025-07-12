<template>
  <div id="scenes">
    <Scrollview :w="'100%'" :h="'100%'">
      <SceneItem v-if="scenes && scenes.length > 0" :key="scene.id" v-for="scene of validScenes" :scene="scene" @addScript="addScript" />
    </Scrollview>
  </div>
</template>

<style scoped>
  #scenes {
    height: calc(100% - 36px);
  }
</style>

<script>
import SceneItem from "./SceneItem.vue";
import Scrollview from '@/components/Scrollview.vue'

export default {
  name: 'Scenes',
  props: ['scenes'],
  components: {
    Scrollview,
    SceneItem
  },
  methods: {
    addScript(scene) {
      this.$emit('addScript', scene);
    }
  },
  data() {
    return {
      scenes: [] // Initialize as empty array
    }
  },
  computed: {
    validScenes() {
      return (this.scenes || []).filter(scene => scene?.id)
    }
  }
}

</script>