<script lang="ts">
  export default {
    props: ['game']
  }
</script>

<template>
  <div class="game-item-container">
    <div class="name">
      {{this.game.name}}
    </div>
    <div class="characters">
      персонажи
    </div>
  </div>
</template>

<style scoped>
  .game-item-container {
    width: 100%;
    height: 300px;
    background: blue;
  }
</style>