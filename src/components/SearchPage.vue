<template>
  <div class="search-page">
    <h1>Расширенный поиск</h1>
    <div class="search-filters">
      <div class="field">
        <label>Название диалога</label>
        <input
          class="input"
          v-model="scriptName"
          type="text"
          placeholder="Введите часть названия"
        />
      </div>
      <div class="field">
        <label>Имя персонажа</label>
        <input
          class="input"
          v-model="characterName"
          type="text"
          placeholder="Например, Геральт"
        />
      </div>
      <div class="field">
        <label>Тип персонажа</label>
        <select class="input" v-model="characterType">
          <option value="">Любой</option>
          <option value="npc">NPC</option>
          <option value="main">Главный персонаж</option>
        </select>
      </div>
      <div class="field">
        <label>Профессия</label>
        <input
          class="input"
          v-model="profession"
          type="text"
          placeholder="Алхимик, воин..."
        />
      </div>
    </div>

    <div class="search-results">
      <div v-for="r in results" :key="r.script.id" class="result-item">
        <b>{{ r.script.name }}</b>
        <div>Сцена: {{ r.scene.name }}</div>
        <div>Персонаж: {{ r.character.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { state } from '@/store'

export default {
  name: 'SearchPage',
  setup() {
    const scriptName = ref('')
    const characterName = ref('')
    const characterType = ref('')
    const profession = ref('')

    const matchesText = (source, text) =>
      !text || (source && source.toLowerCase().includes(text.toLowerCase()))

    const results = computed(() => {
      const res = []
      for (const game of state.games) {
        for (const scene of game.scenes) {
          for (const script of scene.scripts) {
            if (!matchesText(script.name, scriptName.value)) continue
            const charId = script.npc || script.main_character
            const char = game.characters.find((c) => c.id === charId)
            if (!char) continue
            if (!matchesText(char.name, characterName.value)) continue
            if (characterType.value && char.type !== characterType.value) continue
            if (!matchesText(char.profession, profession.value)) continue
            res.push({ game, scene, script, character: char })
          }
        }
      }
      return res
    })

    return {
      scriptName,
      characterName,
      characterType,
      profession,
      results,
    }
  },
}
</script>

<style scoped>
.search-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}
.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  align-items: end;
}
.field {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #6f36a5;
}
.result-item {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff1ff;
  box-shadow: 0 2px 4px #dec8f466;
}
.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
