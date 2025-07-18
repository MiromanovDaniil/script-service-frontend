<template>
  <div class="search-page">
    <h1>Расширенный поиск</h1>
    <div class="search-filters">
      <div class="field">
        <label>Название диалога</label>
        <input class="input" v-model="scriptName" type="text" />
      </div>
      <div class="field">
        <label>Имя персонажа</label>
        <input class="input" v-model="characterName" type="text" />
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
        <input class="input" v-model="profession" type="text" />
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
  padding: 1rem;
}
.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
}
.result-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}
</style>
