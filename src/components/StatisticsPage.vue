<template>
  <div class="stats-page">
    <h1>Статистика</h1>
    <div class="stat-item"><strong>Всего сценариев:</strong> {{ totalScripts }}</div>
    <div class="stat-item"><strong>Активность пользователей:</strong> {{ logsCount }} событий</div>
    <div class="stat-item" v-for="game in state.games" :key="game.id">
      <strong>{{ game.name }}:</strong>
      <span>{{ getGameProgress(game) }}% завершено</span>
    </div>
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
    totalScripts() {
      let count = 0
      state.games.forEach((g) => {
        g.scenes?.forEach((s) => {
          count += s.scripts?.length || 0
        })
      })
      return count
    },
  },
  methods: {
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
.stat-item {
  margin-bottom: 12px;
  font-size: 1.1rem;
}
</style>
