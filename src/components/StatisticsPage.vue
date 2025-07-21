<template>
  <div class="stats-page">
    <div class="header-container">
      <button class="back-button" @click="goBack">← Назад</button>
      <h1>Статистика</h1>
    </div>
    
    <section class="overall">
      <h2>Общая информация</h2>
      <div class="stats-container">
        <div class="stat-item"><strong>Игр:</strong> {{ totalGames }}</div>
        <div class="stat-item"><strong>Сцен:</strong> {{ totalScenes }}</div>
        <div class="stat-item"><strong>Сценариев:</strong> {{ totalScripts }}</div>
        <div class="stat-item"><strong>Персонажей:</strong> {{ totalCharacters }}</div>
        <div class="stat-item">
          <strong>Активность пользователей:</strong> {{ logsCount }} событий
        </div>
      </div>
    </section>
    <section v-for="game in state.games" :key="game.id" class="game-section">
      <h2>{{ game.name }}</h2>
      <div class="stats-container">
        <div class="stat-item"><strong>Сцен:</strong> {{ game.scenes?.length || 0 }}</div>
        <div class="stat-item"><strong>Сценариев:</strong> {{ gameScripts(game) }}</div>
        <div class="stat-item"><strong>Персонажей:</strong> {{ game.characters?.length || 0 }}</div>
        <div class="stat-item"><strong>Завершено:</strong> {{ getGameProgress(game) }}%</div>
      </div>
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
    goBack() {
      this.$router.go(-1) // Возврат на предыдущую страницу
    }
  },
}
</script>

<style scoped>
.stats-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
}

.header-container {
  position: relative;
  margin-bottom: 30px;
  text-align: center;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6a0dad;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f0e6ff;
}

.stats-page h1 {
  margin: 0;
  font-size: 2rem;
}

.stats-page h2 {
  margin: 25px 0 15px;
  font-size: 1.4rem;
  color: #6a0dad; /* Фиолетовый цвет */
}

.stats-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.stat-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
}

.stat-item strong {
  color: #555;
}

.stats-page::-webkit-scrollbar {
  width: 8px;
}

.stats-page::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.stats-page::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.stats-page::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>