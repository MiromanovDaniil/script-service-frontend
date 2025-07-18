<template>
  <div class="stats-page">
    <h1>Статистика</h1>
    <section class="overall">
      <h2>Общая информация</h2>
      <div class="stat-item"><strong>Игр:</strong> {{ totalGames }}</div>
      <div class="stat-item"><strong>Сцен:</strong> {{ totalScenes }}</div>
      <div class="stat-item"><strong>Сценариев:</strong> {{ totalScripts }}</div>
      <div class="stat-item"><strong>Персонажей:</strong> {{ totalCharacters }}</div>
      <div class="stat-item">
        <strong>Активность пользователей:</strong> {{ logsCount }} событий
      </div>
    </section>
    <section v-for="game in state.games" :key="game.id" class="game-section">
      <h2>{{ game.name }}</h2>
      <div class="stat-item"><strong>Сцен:</strong> {{ game.scenes?.length || 0 }}</div>
      <div class="stat-item"><strong>Сценариев:</strong> {{ gameScripts(game) }}</div>
      <div class="stat-item"><strong>Персонажей:</strong> {{ game.characters?.length || 0 }}</div>
      <div class="stat-item"><strong>Завершено:</strong> {{ getGameProgress(game) }}%</div>
    </section>
  </div>
</template>

<script>
import { state } from '@/store'
import logger from '@/logger'

export default {
  name: 'StatisticsPage',
  computed: {
    state() {
      return state
    },
    logsCount() {
      return logger.logs.length
    },
    totalGames() {
      return state.games.length
    },
    totalScenes() {
      let count = 0
      state.games.forEach((g) => {
        count += g.scenes?.length || 0
      })
      return count
    },
    totalScripts() {
      let count = 0
      state.games.forEach((g) => {
        g.scenes?.forEach((s) => {
          count += s.scripts?.length || 0
        })
      })
      return count
    },
    totalCharacters() {
      let count = 0
      state.games.forEach((g) => {
        count += g.characters?.length || 0
      })
      return count
    },
  },
  methods: {
    gameScripts(game) {
      let count = 0
      game.scenes?.forEach((s) => {
        count += s.scripts?.length || 0
      })
      return count
    },
    getGameProgress(game) {
      if (!game.scenes || game.scenes.length === 0) return 0
      const completed = game.scenes.filter((s) => (s.scripts?.length || 0) > 0).length
      return Math.round((completed / game.scenes.length) * 100)
    },
  },
}
</script>

<style scoped>
.stats-page {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.stats-page h1 {
  margin-bottom: 20px;
  text-align: center;
}
.stats-page h2 {
  margin: 20px 0 10px;
  font-size: 1.2rem;
}
.stat-item {
  margin-bottom: 8px;
  font-size: 1rem;
}
</style>
