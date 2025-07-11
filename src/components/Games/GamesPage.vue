<script setup lang="ts">
import Scrollview from "@/components/Scrollview.vue";
import GameItem from "@/components/Games/GameItem.vue"
import {state} from "@/store.js"
state.selectedGameId = null;
</script>

<template>
  <div class="games-page-container">
    <header class="games-page-header">
      <div class="games-page-account-btn">account</div>
      <div class="games-page-settings-btn">setting</div>
    </header>
    <Scrollview class="games-page-games-container" :w="'100%'" :h="'100%'" style="background: red">
      <GameItem/>
    </Scrollview>
  </div>
</template>

<style scoped>
  .games-page-header {
    height: fit-content;
    display: flex;
    justify-content: space-between;
  }
  .games-page-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .games-page-games-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 10px;
  }
</style>