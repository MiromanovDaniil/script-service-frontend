<script>
import { state } from "@/store";
import { script } from "../types";

export default {
    name: 'ScriptItem',
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
      }
    }
};
</script>

<template>
  <div class="script-item scenes" @click="openScript">
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
</style>