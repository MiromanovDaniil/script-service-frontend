<script setup>
import Scrollview from '@/components/Scrollview.vue'
import GameItem from '@/components/Games/GameItem.vue'
import { state } from '@/store.js'
import { useRoute } from 'vue-router'

const route = useRoute()
if (route.name === 'main') {
  state.selectedGameId = null
}
</script>

<script>
import GameItem from '@/components/Games/GameItem.vue'
import Scrollview from '@/components/Scrollview.vue'

export default {
  components: { GameItem, Scrollview },
  methods: {
    open(game) {},
    chars(game) {},
  },
}
</script>

<template>
  <div class="games-page-container">
    <header class="games-page-header">
      <div class="games-page-account-btn">account</div>
      <div class="games-page-settings-btn">setting</div>
    </header>
    <Scrollview class="games-page-games-container" :w="'100%'" :h="'100%'" style="background: red">
      <GameItem v-for="game of games" @open="open(game)" @chars="chars(game)" :game="game" />
    </Scrollview>
  </div>
</template>

<style scoped>
.games-page-header {
  height: fit-content;
  display: flex;
  justify-content: space-between;
}
.games-page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.games-page-games-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 350px);
  gap: 10px;
}
</style>