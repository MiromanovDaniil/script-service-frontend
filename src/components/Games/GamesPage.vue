<template>
  <div class="games-list">
    <!-- Карточка для создания новой игры -->
    <div class="game-item add-game-item" @click="openCreateModal">
      <div class="game-item-plus">+</div>
    </div>

    <!-- Существующие игры -->
    <GameItem
      v-for="game in state.games"
      :key="game.id"
      :game="game"
      @open="openGame"
      @chars="openCharacters"
    />
  </div>

  <CreateGameModal
    v-if="showCreateModal"
    @close="showCreateModal = false"
    @create="addGame"
  />
</template>

<script>
import GameItem from '@/components/games/GameItem.vue'
import CreateGameModal from '@/components/games/CreateGameModal.vue'
import { state } from '@/store' // ВАЖНО!

export default {
  components: { GameItem, CreateGameModal },
  data() {
    return {
      showCreateModal: false
    }
  },
  methods: {
    openCreateModal() {
      this.showCreateModal = true
    },
    addGame(newGame) {
      state.games.push({
        id: Date.now().toString(),
        name: newGame.name,
        scenes: [],
        characters: [],
      })
    },
    openGame(game) {
      this.$router.push('/' + game.id)
    },
    openCharacters(game) {
      alert('Открыть персонажей игры: ' + game.name)
    }
  },
  computed: {
    state() {
      return state
    }
  }
}
</script>
