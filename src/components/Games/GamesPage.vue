<template>
  <div class="games-dashboard">
    <!-- Top bar -->
    <header class="dashboard-header">
      <div class="dashboard-user">
        <svg class="user-avatar-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7c37a5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
        <span class="user-name">{{ state.user.firstName || 'username' }}</span>
      </div>

      <div class="dashboard-status">
        {{ $t('games.total') }}: <b>{{ state.games.length }}</b>
      </div>
      
      <div class="header-actions">
        <button class="dashboard-settings" :title="$t('settings.title')" @click="showSettings = true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9a60d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <router-link to="/stats" class="dashboard-stats" :title="$t('stats.title')">
          <svg width="26" height="26" fill="none">
            <path d="M6 18V10M12 18V6M18 18v-4" stroke="#9a60d6" stroke-width="2" stroke-linecap="round" />
          </svg>
        </router-link>

        <button class="logout-button" @click="logout" :title="$t('common.logout')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9c48e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Cards grid -->
    <main class="games-list">
      <div class="game-item add-game-item" @click="openCreateModal">
        <div class="add-icon">+</div>
        <div class="add-label">{{ $t('games.create') }}</div>
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
        <button class="settings-close" @click="closeSettings" :title="$t('common.close')">×</button>
        <h2 class="settings-title">{{ $t('settings.title') }}</h2>
        <div class="settings-content">
          <div class="setting-item">
            <label>
              <span>{{ $t('settings.darkTheme') }}</span>
              <input type="checkbox" v-model="darkTheme" />
            </label>
          </div>
          <!-- Добавь свои настройки тут -->
          <div class="setting-item">
            <label>
              <span>{{ $t('settings.language') }}</span>
              <select v-model="language">
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </label>
          </div>
          <div class="setting-item">
            <label>
              <span>Голос озвучки</span>
              <select v-model="selectedVoiceName">
                <option v-for="v in voices" :key="v.name" :value="v.name">
                  {{ v.name }} ({{ v.lang }})
                </option>
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
      @add="addChar"
      @edit="editCharF"
      ref="charsModal"
    />

    <ModalWindow  v-if="isCharEditModalOpened" @closeModal="isCharEditModalOpened = false" :showButtons="true" :header="'Персонаж'" @validate-request="save"><CreateCharacterModal :edit="editChar" :char="selectedGame.characters.find(c => c.id == editChar)" ref="createChar"/></ModalWindow>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
if (route.name === 'main') {
  state.selectedGameId = null
  state.selectedSceneId = null
  state.selectedSceneId = null
  saveState();
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
      voices: [],
      selectedVoiceName: '',
      selectedGame: null,
      selectedGameCharacters: [],
      isCharEditModalOpened: false,
      editChar: "",
      showUserMenu: false,

    }
  },
  computed: {
    state() {
      return state
    },
  },
  watch: {
    darkTheme(val) {
      document.body.classList.toggle('dark-theme', val)
      localStorage.setItem('darkTheme', val ? '1' : '0')
    },
    language(val) {
      this.$i18n.locale = val
      localStorage.setItem('locale', val)
    },
    selectedVoiceName(val) {
      localStorage.setItem('voiceName', val)
    },
  },
  mounted() {
    this.darkTheme = localStorage.getItem('darkTheme') === '1'
    document.body.classList.toggle('dark-theme', this.darkTheme)
    this.language = this.$i18n.locale
    this.selectedVoiceName = localStorage.getItem('voiceName') || ''
    this.updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', this.updateVoices)
  },
  beforeUnmount() {
    window.speechSynthesis.removeEventListener('voiceschanged', this.updateVoices)
  },
  methods: {
    updateVoices() {
      this.voices = window.speechSynthesis.getVoices()
      if (!this.selectedVoiceName && this.voices.length) {
        const def = this.voices.find((v) => v.default) || this.voices[0]
        this.selectedVoiceName = def?.name || ''
      }
    },
    addChar() {
      this.isCharEditModalOpened = true;
      this.editChar = "";
    },
    editCharF(id) {
      this.isCharEditModalOpened = true;
      this.editChar = id;
    },
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
      let ch = this.$refs.createChar;
      if(this.$refs.createChar.validate()) {
        let res = {
          "id": Date.now().toString(),
          "name": ch.name,
          "profession": ch.job,
          "talk_style": ch.speechStyle,
          "type": ch.type,
          "traits": ch.mood,
          "look": ch.appearance,
          "extra": ch.description
        };
        if(ch.edit){
          this.$refs.charsModal.localChars[this.$refs.charsModal.localChars.findIndex(c => c.id == ch.char.id)] = res;
        }
        else {
          this.$refs.charsModal.localChars.push(res);
        }
        this.isCharEditModalOpened = false;
      }
    },

    toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
},
logout() {
  // Очистка состояния, перенаправление и т.д.
  localStorage.clear();
  state.user = {};
  this.$router.push('/login'); // Или другая логика
}

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
  user-select: none;
}

.dashboard-header {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding: 34px 40px 20px 44px;
  background: none;
  font-family: inherit;
  font-size: 1.12rem;
  gap: 25px;
  overflow: hidden; /* Добавлена вертикальная прокрутка */
  max-height: calc(100vh - 120px); /* Ограничение высоты для появления скролла */
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: #c4a8f4 #f0e5ff; /* Для Firefox */
}

.dashboard-user {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.user-avatar-icon {
  width: 36px;
  height: 36px;
  padding: 2px;
  border-radius: 50%;
  background: #ebe0fd;
  box-shadow: 0 2px 12px #a78ed03c;
  transition: background 0.2s;
}
.user-avatar-icon:hover {
  background: #e0d0ff;
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
.dashboard-stats {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 9px;
  padding: 7px;
  transition: background 0.16s;
  text-decoration: none;
}
.dashboard-stats:hover {
  background: #ede1ff;
}

.games-list {
  overflow-y: auto;
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
.user-dropdown {
  position: absolute;
  top: 72px;
  left: 44px;
  background: white;
  border: 1px solid #d3bfff;
  border-radius: 10px;
  box-shadow: 0 4px 18px rgba(137, 98, 199, 0.2);
  padding: 10px 16px;
  z-index: 10;
}
.logout-button {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}
.logout-button:hover {
  background: #f3ddff;
}



.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-button {
  background: none;
  border: none;
  padding: 7px;
  cursor: pointer;
  border-radius: 9px;
  transition: background 0.16s;
  display: flex;
  align-items: center;
  justify-content: center;
}



</style>
