<script>
import { state } from "@/store";
import { script } from "../types";

export default {
    name: 'ScriptItem',
    data(){
      return {
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
    props: {
      script: {
        type: Object,
        required: true
      },
      scene: {
        type: Object,
        required: true
      }
    },
    methods: {
      openScript() {
        state.selectedSceneId = this.scene.id;
        state.selectedScriptId = this.script.id;
      },
    showContextMenu(event, id) {
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isMenuVisible[id.toString()] = true;
    },
    deleteScript() {
      this.$emit('deleteScript', this.script)
    },
    editScript() {
      this.$emit('editScript', this.script)
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
};
</script>

<template>
  <div class="script-item scenes" @click="openScript" @contextmenu.prevent="showContextMenu($event, script.id)">
    <div class="custom-context-menu" v-if="isMenuVisible[script.id.toString()]" :style="menuStyles">
        <button class="scene-btn icon-with-anim" @click.stop="editScript" title="Редактировать"><svg viewBox="0 0 24 24" width="24" height="24" stroke="#a352fa" fill="#00000000" stroke-width="1.5px">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg></button>
        <button class="scene-btn icon-with-anim" @click.stop="deleteScript" title="Удалить"><svg viewBox="0 0 24 24" width="24" height="24" stroke="#a352fa" fill="#00000000" stroke-width="1.5px">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg></button>
    </div>
    {{script.name}}
  </div>
</template>

<style scoped>
 .scenes {
  background-color: #f3e8ff;
}
  .script-item {
    cursor: pointer;
    width: 100%;
  }
  .script-item {
  cursor: pointer;
  width: 100%;
  background: #f3e8ff;
  padding: 10px 12px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

  .script-item:hover {
    background: #ffcefb;
  }
  .custom-context-menu {
      position: fixed;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      padding: 10px;
      z-index: 99; /* Ensure it's on top */
    }
    .scene-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px;
  color: #7e22ce;
}
</style>