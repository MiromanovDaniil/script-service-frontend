<script>
export default {
  name: "Scrollview",
  props: ["w", "h"],
}
</script>

<template>
  <div class="scrollable-container" :style="{ maxHeight: h, width: w }">
    <slot></slot>
  </div>
</template>

<style scoped>
  .scrollable-container {
    overflow-y: auto;
  }
</style>