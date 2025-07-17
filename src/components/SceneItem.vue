<script>
import ScriptItem from '@/components/ScriptItem.vue'
import { state } from '@/store'
export default {
  props: ['scene'],
  data() {
    return {
      isOpen: false,
      isMenuVisible: {},
      menuX: 0,
      menuY: 0,
    }
  },
  computed: {
        menuStyles() {
          return {
            top: `${this.menuY}px`,
            left: `${this.menuX}px`,
          };
        },
      },
  components: { ScriptItem },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    addScript() {
      this.$emit('addScript', this.scene)
    },
    downloadF(filename, text) {
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    },
    download(id){
      let name = 'scene.json';
      let game = state.games.find(g => g.id == state.selectedGameId);
      let scripts = game.scenes.find(s => s.id == id).scripts
      let res = [];
      scripts.forEach(element => {
        if (Object.keys(element.result).length > 0){
          let r = {}
          r['data'] = element.result.data
          r['npc_name'] = game.characters.find((c) => c.id == element.npc).name
          r['hero_name'] = game.characters.find((c) => c.id == element.main_character).name
          res.push(r)
        }
      })
      this.downloadF(name, JSON.stringify(res))
    },
    editScene() {
      this.$emit('editScene', this.scene)
    },
    showContextMenu(event, id) {
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isMenuVisible[id.toString()] = true;
    },
    deleteScene() {
      this.$emit('deleteScene', this.scene)
    },
  },
  mounted() {
    window.addEventListener('click', (event) => {
      // Hide menu if click is outside of the menu
      if (!event.target.closest('.custom-context-menu')) {
        for (let key in this.isMenuVisible) {
          this.isMenuVisible[key] = false;
        }
      }
    });
  },
}
</script>

<template>
  <div class="GameItem">
     <div class="custom-context-menu" v-if="isMenuVisible[scene.id.toString()]" :style="menuStyles">
        <button class="scene-btn icon-with-anim" @click.stop="editScene" title="Редактировать"><svg viewBox="0 0 24 24" width="24" height="24" stroke="#a352fa" fill="#00000000" stroke-width="1.5px">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg></button>
        <button class="scene-btn icon-with-anim" @click.stop="deleteScene" title="Удалить"><svg viewBox="0 0 24 24" width="24" height="24" stroke="#a352fa" fill="#00000000" stroke-width="1.5px">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg></button>
    <button class="scene-btn icon-with-anim" @click.stop="download(scene.id)" title="Удалить"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a352fa" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="arcs"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path></svg></button>
    </div>
    <div class="accordion" @click="toggle" @contextmenu.prevent="showContextMenu($event, scene.id)">
      <span class="accordion-arrow flipped-vert" :class="{ active: isOpen }"
        ><svg
          :class="{ 'flipped-vert': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 50 50"
        >
          <path d="M25 10 L10 40" fill="none" stroke="#c3c3c3" stroke-width="4" />
          <path d="M25 10 L40 40" fill="none" stroke="#c3c3c3" stroke-width="4" /></svg
      ></span>
      {{ scene.name }}
      <button class="scene-btn icon-with-anim" @click.stop="addScript" title="Добавить диалог"><svg transform="rotate(45)" width="28" height="28" fill="none"><path d="M7 7l14 14M21 7L7 21" stroke="#a352fa" stroke-width="1.9"/></svg></button>
    </div>

    <transition class="transition" name="panel">
      <div v-show="isOpen" class="panel">
        <ScriptItem
          v-for="script of scene.scripts"
          :key="script.id"
          :scene="scene"
          :script="script"
        />
        <span v-if="scene.scripts.length === 0" class="no-scripts">В сцене еще нет диалогов</span>
      </div>
    </transition>
  </div>
</template>

<style>

</style>

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

.transition {
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
.scene-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px;
  color: #7e22ce;
}
.custom-context-menu {
      position: fixed;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      padding: 10px;
      z-index: 99; /* Ensure it's on top */
    }
</style>
