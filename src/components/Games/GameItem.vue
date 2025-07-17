﻿
<template>
  <div class="game-item" @click="openGame">
    <div class="game-item-actions">
      <button class="icon" @click.stop="editGame" title="Редактировать">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill="#7e22ce"
          />
        </svg>
      </button>
      <button class="icon" @click.stop="deleteGame" title="Удалить">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            fill="#7e22ce"
          />
        </svg>
      </button>
    </div>
    <div class="game-item-title">
      <svg class="game-icon" width="24" height="24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="#ba82f6" stroke-width="2" />
        <path d="M9 15l6-6M9 9h6v6" stroke="#a66bee" stroke-width="2" />
      </svg>
      {{ game.name }}
    </div>
    <div class="game-meta">
      <span class="game-badge">{{ game.scenes.length }} сцен</span>
      <span class="game-badge">{{ game.characters.length }} персонажей</span>
    </div>
    <!-- emit the characters payload -->
    <div class="game-item-characters" @click.stop="openCharacters">персонажи</div>
  </div>
</template>

<script>
export default {
  name: 'GameItem',
  props: {
    game: { type: Object, required: true },
  },
  methods: {
    openGame() {
      this.$emit('open', this.game)
    },
    openCharacters() {
      this.$emit('chars', this.game)
    },
    editGame() {
      this.$emit('edit', this.game)
    },
    deleteGame() {
      this.$emit('delete', this.game)
    },
  },
}
</script>

<style scoped>
.game-item {
  min-width: 200px;
  min-height: 210px;
  background: linear-gradient(180deg, #f6e6ff 70%, #fff 100%);
  border: 2px solid #b97afa;
  border-radius: 19px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 6px 24px #e3d4f688;
  transition:
    box-shadow 0.23s,
    transform 0.13s;
  position: relative;
}
.game-item:hover {
  box-shadow: 0 12px 32px #cbb2e875;
  transform: translateY(-2px) scale(1.02);
  border-color: #a35bfd;
}
.game-item-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 6px;
}
.icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
}
.game-item-title {
  font-size: 20px;
  color: #7c37a5;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 22px 18px 2px 18px;
  text-shadow: 0 1px 10px #dfd5ff22;
}
.game-icon {
  flex-shrink: 0;
}
.game-meta {
  display: flex;
  gap: 10px;
  padding: 0 18px 0 18px;
  margin: 6px 0 0 0;
}
.game-badge {
  background: #f1e3ff;
  color: #b367fa;
  border-radius: 7px;
  font-size: 13px;
  padding: 2px 8px;
  margin-top: 3px;
  font-weight: 500;
}
.game-item-characters {
  border-top: 2px solid #be92e4;
  text-align: left;
  padding: 12px 18px;
  font-size: 16px;
  color: #633186;
  background: #f8ebff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.15s;
}
.game-item-characters:hover {
  background: #e1d1f6;
}
</style>
