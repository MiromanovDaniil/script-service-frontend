<script>
import { script } from "../types";

export default {
    name: 'ScriptItem',
    props: {
      script: {
        type: Object,
        required: true
      }
    }
};
</script>

<template>
  <div class="script-item">
    {{script.name}}
  </div>
</template>

<style scoped>
  .script-item {
    cursor: pointer;
    width: 100%;
  }
  .script-item:hover {
    background: #eeeeee;
  }
</style>