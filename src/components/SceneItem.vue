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
      }
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
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    download(id) {
      const game = state.games.find((g) => g.id == state.selectedGameId)
      const scripts = game.scenes.find((s) => s.id == id).scripts
      const res = []

      scripts.forEach((element) => {
        if (Object.keys(element.result).length > 0) {
          res.push({
            data: element.result.data,
            npc_name: game.characters.find((c) => c.id == element.npc)?.name || '',
            hero_name: game.characters.find((c) => c.id == element.main_character)?.name || '',
          })
        }
      })

      this.downloadF('scene.json', JSON.stringify(res))
    },
    editScene() {
      this.$emit('editScene', this.scene)
    },
    showContextMenu(event, id) {
      this.menuX = Math.min(event.clientX, window.innerWidth - 200)
      this.menuY = event.clientY
      this.isMenuVisible = { [id]: true }
    },
    deleteScene() {
      this.$emit('deleteScene', this.scene)
    },
    deleteScript(script) {
      this.$emit('deleteScript', script, this.scene)
    },
    editScript(script) {
      this.$emit('editScript', script, this.scene)
    },
  },
  mounted() {
    window.addEventListener('click', (event) => {
      if (!event.target.closest('.custom-context-menu')) {
        this.isMenuVisible = {}
      }
    })
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
    <button class="scene-btn icon-with-anim" @click.stop="download(scene.id)" title="Скачать"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a352fa" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="arcs"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path></svg></button>
    </div>

    <!-- Accordion header -->
    <div class="accordion" @click="toggle" @contextmenu.prevent="showContextMenu($event, scene.id)">
      <span class="accordion-arrow" :class="{ active: isOpen }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
      <span class="scene-title">{{ scene.name }}</span>
      <button class="scene-btn" @click.stop="addScript" title="Добавить диалог">
        ➕
      </button>
    </div>

    <!-- Content panel -->
    <transition name="panel">
      <div v-show="isOpen" class="panel">
        <ScriptItem
          v-for="script in scene.scripts"
          :key="script.id"
          :scene="scene"
          :script="script"
          @editScript="editScript"
          @deleteScript="deleteScript"
        />
        <span v-if="scene.scripts.length === 0" class="no-scripts">В сцене еще нет диалогов</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.game-item {
  width: 100%;
  overflow: hidden;
}

.accordion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f3e8ff;
  padding: 14px 18px;
  cursor: pointer;
  transition: background 0.3s;
  border: none;
}

.accordion:hover {
  background: #e9d5ff;
}

.accordion-arrow {
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  margin-right: 8px;
}
.accordion-arrow.active {
  transform: rotate(180deg);
}

.scene-title {
  flex: 1;
  margin-left: 8px;
  font-weight: 500;
  color: #444;
  word-break: break-word;
}

.scene-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #7e22ce;
  margin-left: 10px;
}

.custom-context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 100;
  max-width: 200px;
  word-wrap: break-word;
}

.panel {
  width: 100%;
  background: #f3e8ff; 
  margin: 0;
  padding: 0;
  overflow: hidden;
}


.no-scripts {
  display: block;
  padding: 10px;
  font-style: italic;
  color: #888;
}

/* Smooth expand / collapse */
.panel-enter-from,
.panel-leave-to {
  max-height: 0;
  opacity: 0;
}
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease-out;
}
.panel-enter-to,
.panel-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
