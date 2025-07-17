<template>
  <div class="games-dashboard">
    <!-- Top bar -->
    <header class="dashboard-header">
      <div class="dashboard-user">
        <img class="user-avatar" src="/assets/logo.png" alt="avatar" />
        <span class="user-name">username</span>
      </div>
      <div class="dashboard-status">
        Всего игр: <b>{{ state.games.length }}</b>
      </div>
      <button class="dashboard-settings" title="Настройки" @click="showSettings = true">
        <svg width="26" height="26" fill="none">
          <circle cx="13" cy="13" r="12" stroke="#9a60d6" stroke-width="2" />
          <path d="M13 8v5l4 2" stroke="#9a60d6" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </header>

    <!-- Cards grid -->
    <main class="games-list">
      <div class="game-item add-game-item" @click="openCreateModal">
        <div class="add-icon">+</div>
        <div class="add-label">Создать игру</div>
      </div>
      <GameItem
        v-for="game in state.games"
        :key="game.id"
        :game="game"
        @open="openGame"
        @chars="openCharacters"
        @edit="editGame"
        @delete="removeGame"
      />
    </main>

    <!-- Settings Panel + Overlay -->
    <div v-if="showSettings" class="settings-overlay" @click.self="closeSettings">
      <aside class="settings-panel">
        <button class="settings-close" @click="closeSettings" title="Закрыть">×</button>
        <h2 class="settings-title">Настройки</h2>
        <div class="settings-content">
          <div class="setting-item">
            <label>
              <span>Тёмная тема</span>
              <input type="checkbox" v-model="darkTheme" />
            </label>
          </div>
          <!-- Добавь свои настройки тут -->
          <div class="setting-item">
            <label>
              <span>Язык интерфейса</span>
              <select v-model="language">
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>
      </aside>
    </div>

    <!-- Modal -->
    <CreateGameModal
      v-if="showCreateModal"
      :gameData="editingGame"
      :showDelete="Boolean(editingGame)"
      @close="closeGameModal"
      @save="saveGame"
      @delete="deleteGame"
      ref="createGame"
    />

    <CharactersModal
      :visible="isCharsModalVisible && !isCharEditModalOpened"
      :characters="selectedGameCharacters"
      @close="isCharsModalVisible = false"
      @save="onSaveCharacters"
      @add="isCharEditModalOpened = true"
      ref="charsModal"
    />

    <ModalWindow
      v-if="isCharEditModalOpened"
      @closeModal="isCharEditModalOpened = false"
      :showButtons="true"
      :header="'Персонаж'"
      @validate-request="save"
      ><CreateCharacterModal ref="createChar"
    /></ModalWindow>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
if (route.name === 'main') {
  state.selectedGameId = null
  state.selectedSceneId = null
  state.selectedSceneId = null
}
</script>

<script>
import GameItem from '@/components/Games/GameItem.vue'
import CreateGameModal from '@/components/Games/CreateGameModal.vue'
import { state, saveState } from '@/store'
import CharactersModal from '../CharacterViewModal.vue'
import ModalWindow from '../ModalWindow.vue'
import CreateCharacterModal from '../CreateCharacterModal.vue'

export default {
  components: { GameItem, CreateGameModal, CharactersModal, ModalWindow, CreateCharacterModal },
  data() {
    return {
      showCreateModal: false,
      editingGame: null,
      isCharsModalVisible: false,
      showSettings: false,
      darkTheme: false,
      language: 'ru',
      selectedGame: null,
      selectedGameCharacters: [],
      isCharEditModalOpened: false,
    }
  },
  computed: {
    state() {
      return state
    },
  },
  methods: {
    openCreateModal() {
      this.editingGame = null
      this.showCreateModal = true
    },
    editGame(game) {
      this.editingGame = { ...game }
      this.showCreateModal = true
    },
    saveGame(game) {
      if (this.editingGame) {
        const idx = state.games.findIndex((g) => g.id === this.editingGame.id)
        if (idx !== -1) {
          state.games[idx] = { ...state.games[idx], ...game }
        }
      } else {
        state.games.push({ id: Date.now().toString(), ...game, scenes: [], characters: [] })
      }
      saveState()
      this.closeGameModal()
    },
    deleteGame() {
      if (this.editingGame) {
        state.games = state.games.filter((g) => g.id !== this.editingGame.id)
        saveState()
      }
      this.closeGameModal()
    },
    closeGameModal() {
      this.showCreateModal = false
      this.editingGame = null
    },
    openGame(game) {
      this.$router.push('/' + game.id)
    },
    openCharacters(game) {
      this.selectedGame = game
      this.selectedGameCharacters = [...game.characters]
      this.isCharsModalVisible = true
    },
    onSaveCharacters(newChars) {
      this.selectedGame.characters = newChars
      this.isCharsModalVisible = false
      saveState()
    },
    closeSettings() {
      this.showSettings = false
    },
    removeGame(game) {
      state.games = state.games.filter((g) => g.id !== game.id)
      saveState()
    },
    save() {
      let ch = this.$refs.createChar
      if (this.$refs.createChar.validate()) {
        this.$refs.charsModal.localChars.push({
          id: Date.now().toString(),
          name: ch.name,
          profession: ch.job,
          talk_style: ch.speechStyle,
          traits: ch.mood,
          look: ch.appearance,
          extra: ch.description,
        })
        this.isCharEditModalOpened = false
      }
    },
  },
}
</script>

<style scoped>
.games-dashboard {
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  background: linear-gradient(120deg, #e6d5ff 0%, #fff7ff 100%);
  overflow: hidden;
}

.dashboard-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 34px 40px 20px 44px;
  background: none;
  font-family: inherit;
  font-size: 1.12rem;
  gap: 25px;
  overflow-y: auto; /* Добавлена вертикальная прокрутка */
  max-height: calc(100vh - 120px); /* Ограничение высоты для появления скролла */
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: #c4a8f4 #f0e5ff; /* Для Firefox */
}

.dashboard-user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: 0 2px 12px #a78ed03c;
  background: linear-gradient(135deg, #c499fe 40%, #beecff 100%);
}
.user-name {
  font-size: 22px;
  font-weight: 600;
  color: #7c37a5;
  letter-spacing: 0.2px;
  margin-left: 6px;
}

.dashboard-status {
  color: #814ad9;
  background: #efe6fc;
  border-radius: 13px;
  font-weight: 500;
  font-size: 18px;
  padding: 7px 20px 7px 18px;
  box-shadow: 0 2px 12px #e1d1f622;
  justify-self: center;
}

.dashboard-settings {
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 9px;
  transition: background 0.16s;
  padding: 7px;
  margin-right: 5px;
}
.dashboard-settings:hover {
  background: #ede1ff;
}

.games-list {
  width: 100%;
  padding: 12px 44px 42px 44px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 34px 28px;
  align-items: flex-start;
  box-sizing: border-box;
}

/* Settings panel styles */
.settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(91, 56, 143, 0.16);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  transition: background 0.2s;
}
.settings-panel {
  width: 340px;
  max-width: 95vw;
  background: #f8f0ff;
  box-shadow: -2px 0 24px #b698f380;
  padding: 30px 30px 20px 26px;
  border-top-left-radius: 26px;
  border-bottom-left-radius: 26px;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: slideInRight 0.27s cubic-bezier(0.55, 0.06, 0.48, 1.17);
}
@keyframes slideInRight {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.settings-close {
  position: absolute;
  top: 19px;
  right: 19px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #b37ee8;
  cursor: pointer;
  transition: color 0.13s;
  z-index: 2;
}
.settings-close:hover {
  color: #a14ed8;
}
.settings-title {
  margin: 0 0 18px 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #8246b4;
}
.settings-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.setting-item label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #6f36a5;
  font-weight: 500;
  gap: 18px;
}
.setting-item select,
.setting-item input[type='checkbox'] {
  margin-left: 18px;
}
.add-game-item {
  background: linear-gradient(180deg, #ede1ff 60%, #fff 100%);
  border: 2.7px dashed #b97afa;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  min-width: 200px;
  box-shadow: 0 2px 18px #c9b5eb54;
  cursor: pointer;
  transition:
    box-shadow 0.19s,
    border-color 0.15s,
    transform 0.17s;
  margin: 0;
  position: relative;
}
.add-game-item:hover {
  border-color: #8d32d1;
  box-shadow: 0 7px 32px #b478f66a;
  transform: translateY(-2px) scale(1.04);
}
.add-icon {
  font-size: 56px;
  color: #a35bfd;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 15px;
  text-shadow: 0 3px 18px #be92e455;
}
.add-label {
  font-size: 20px;
  color: #9e3ce4;
  font-weight: 600;
  text-align: center;
}

.games-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.games-list::-webkit-scrollbar-track {
  background: #f0e5ff;
  border-radius: 10px;
}
.games-list::-webkit-scrollbar-thumb {
  background-color: #c4a8f4;
  border-radius: 10px;
  border: 2px solid #f0e5ff;
}
</style>
