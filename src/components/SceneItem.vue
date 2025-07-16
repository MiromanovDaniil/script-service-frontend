<script>
import ScriptItem from "@/components/ScriptItem.vue";
import { state } from "@/store";
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
    },
    downloadF(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    download(){
      let name = 'scene.json';
      let game = state.games.find(g => g.id == state.selectedGameId);
      let scripts = game.scenes.find(s => s.id == state.selectedSceneId).scripts
      let res = [];
      scripts.forEach(element => {
        if (Object.keys(element.result).length > 0){
          let r = {}
          r["data"] = element.result.data;
          r["npc_name"] = game.characters.find(c => c.id == element.npc).name;
          r["hero_name"] = game.characters.find(c => c.id == element.main_character).name;
          res.push(r);
        }
      });
      this.downloadF(name, JSON.stringify(res));
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
      <img src="../../assets/load.png" height="15px" @click.stop="download">
    </div>

    <transition class="transition" name="panel">
      <div v-show="isOpen" class="panel">
        <ScriptItem v-for="script of scene.scripts" :key="script.id" :scene="scene" :script="script"/>
        <span v-if="scene.scripts.length === 0" class="no-scripts">В игре еще нет сцен</span>
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