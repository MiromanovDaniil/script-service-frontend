<script>
import ScriptItem from "@/components/ScriptItem.vue";
export default {
  props: ['scene'],
  data(){
    return {
      isOpen: false,
    };
  },
  components: {ScriptItem},
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    addScript() {
      this.$emit('addScript', this.scene);
    }
  }
}
</script>

<template>
  <div class="GameItem">
    <div class="accordion" @click="toggle">
      <span class="accordion-arrow flipped-vert" :class="{ active: isOpen }"><svg :class="{'flipped-vert': isOpen}" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 50 50"><path d="M25 10 L10 40" fill="none" stroke="#c3c3c3" stroke-width="4"/><path d="M25 10 L40 40" fill="none" stroke="#c3c3c3" stroke-width="4"/></svg></span>
      {{ scene.name }}
      <span class="addScript" @click.stop="addScript">+</span>
    </div>

    <transition class="transition" name="panel">
      <div v-show="isOpen" class="panel">
        <ScriptItem v-for="script of scene.scripts" :key="script.id" :scene="scene" :script="script"/>
        <span v-if="scene.scripts.length === 0" class="no-scripts">There's no scripts in this game</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.panel.transition {
  padding: 0;
}
.accordion {
  background: #f3e8ff;
  color: #444;
  cursor: pointer;
  padding: 18px;
  text-align: left;
  border: none;
  outline: none;
  transition: background 0.4s;
  width: calc(100% - 36px);
}

.transition{
  width: 100%;
}

.accordion.active,
.accordion:hover {
  background: #ffcefb;
}

.panel {
  width: 100%;
  padding: 0 18px;
  background: #f3e8ff;
  overflow: hidden;
}

.panel-enter-from,
.panel-leave-to {
  max-height: 0;
}

.panel-enter-active,
.panel-leave-active {
  transition: max-height 0.3s ease-out;
}

.panel-enter-to,
.panel-leave-from {
  max-height: 500px;
}
</style>