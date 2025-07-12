<template>
  <div class="game-item" @click="openGame">
    <div class="game-item-title">{{ game.name }}</div>
    <div class="game-item-characters" @click.stop="openCharacters">персонажи</div>
  </div>
</template>

<script>
export default {
  name: 'GameItem',
  props: {
    game: { type: Object, required: true }
  },
  methods: {
    openGame() {
      // Событие для перехода внутрь игры
      this.$emit('open', this.game)
    },
    openCharacters() {
      // Событие для открытия списка персонажей
      this.$emit('chars', this.game)
    }
  }
}
</script>

<style scoped>
.game-item {
  width: 180px;
  height: 180px;
  background: linear-gradient(180deg, #f6e6ff 70%, #fff 100%);
  border: 2px solid #9a60d6;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px #e3d4f6b3;
  transition: box-shadow 0.2s;
}
.game-item:hover {
  box-shadow: 0 6px 20px #d5aaff80;
}
.game-item-title {
  font-size: 20px;
  color: #7c37a5;
  padding: 18px 16px 0 16px;
  font-weight: bold;
}
.game-item-characters {
  border-top: 2px solid #9a60d6;
  text-align: left;
  padding: 10px 16px;
  font-size: 16px;
  color: #633186;
  background: #f8ebff;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.game-item-characters:hover {
  background: #e1d1f6;
}
</style>
