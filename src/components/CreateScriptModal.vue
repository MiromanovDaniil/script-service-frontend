<script>
import Scrollview from '@/components/Scrollview.vue'
import CharacterItem from '@/components/CharacterItem.vue'
import PlayerGetsSettings from '@/components/PlayerGetsSettings.vue'
import CharacterSelect from '@/components/CharacterSelect.vue'

export default {
  name: 'CreateScriptModal',
  components: { CharacterSelect, CharacterItem, Scrollview, PlayerGetsSettings },
  data() {
    return {
      name: '',
      answers_from_m: 1,
      answers_to_m: 1,
      answers_from_n: 1,
      answers_to_n: 1,
      main_character: {},
      to_npc_relations: 'не знаком',
      npc: {},
      to_main_character_relations: 'не знаком',
      description: '',
      itemData: {},
      infoData: {},
      additional: '',
      fieldsToValidate: ['name', 'main_character', 'npc', 'description'],
      errors: {
        name: false,
        answers_count: false,
        branches_count: false,
        characters: false,
        description: false,
        main_character: false,
        npc: false,
      },
    }
  },
  methods: {
    validate() {
      this.resetErrors()
      if (
        this.$refs.playerGetsSettingsItem &&
        this.$refs.playerGetsSettingsItem.validate() &&
        this.$refs.playerGetsSettingsInfo &&
        this.$refs.playerGetsSettingsInfo.validate()
      ) {
        this.itemData = this.$refs.playerGetsSettingsItem.getFormData()
        this.infoData = this.$refs.playerGetsSettingsInfo.getFormData()
        const errors = []

        const fieldLabels = {
          name: 'Название',
          answers_count: 'Количество ответов',
          branches_count: 'Количество сюжетных веток',
          characters: 'Персонажи',
          description: 'Краткое содержание',
        }

        for (const field of this.fieldsToValidate) {
          const value = this[field]

          if (typeof value === 'object') {
            if (Object.keys(value).length === 0) {
              errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`)
              this.errors[field] = true
            }
          } else if (typeof value === 'string') {
            if (!value.trim()) {
              errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`)
              this.errors[field] = true
            }
          } else if (
            value === null ||
            value === undefined ||
            value === 0
          ) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`)
            this.errors[field] = true
          }
        }

        return !errors.length
      }
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false
      }
    },
    npcEdited() {
      this.npc = this.$refs.npc.character;
    },
    mainCharacterEdited() {
      this.main_character = this.$refs.main_char.character;
    }
  },
}
</script>

<template>
  <div class="create-script-modal-container">
    <div class="create-script-modal-cell create-script-modal-name">
      <h2 class="create-script-modal-h2 create-script-modal-name-text">Название</h2>
      <div class="input-wrapper">
        <input class="input" type="text" v-model="name" :class="{ error: this.errors.name }" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="create-script-modal-cell create-script-modal-count">
      <div class="create-script-modal-count-answers">
        <div class="create-script-modal-count-branches">
          <label
            class="create-script-modal-count-answers-label label"
            for="create-script-modal-count-answers-input"
            >Ответы главного персонажа:</label
          >
          <span>от</span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_from_m"
            min="1"
            max="1000"
          />
          <span>до</span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_to_m"
            min="1"
            max="1000"
          />
        </div>
      </div>
      <div class="create-script-modal-count-answers">
        <div class="create-script-modal-count-answers">
          <label
            class="create-script-modal-count-answers-label label"
            for="create-script-modal-count-answers-input"
            >Глубина дерева диалогов:</label
          >
          <span> от </span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_from_n"
            min="1"
            max="1000"
          />
          <span> до </span>
          <input
            class="input number-input"
            id="create-script-modal-count-answers-input"
            type="number"
            v-model="answers_to_n"
            min="1"
            max="1000"
          />
        </div>
      </div>
    </div>
    <div class="create-script-modal-cell create-script-modal-characters">
      <h2 class="create-script-modal-h2">Персонажи</h2>
      <p><b>Главный персонаж</b></p>
      <CharacterSelect ref="main_char" @edited="mainCharacterEdited" :class="{ error: this.errors.main_character }" />
      <span class="error-label" v-if="this.errors.main_character"
        >Это поле обязательно для заполнения</span
      >
      <div class="create-script-modal-name">
        <span>Отношение к NPC</span>
        <select
          class="input"
          style="float: right; width: max-content; margin-left: 2px"
          v-model="to_npc_relations"
        >
          <option value="не знаком">Не знаком</option>
          <option value="хорошо">Хорошо</option>
          <option value="нейтррально">Нейтрально</option>
          <option value="плохо">Плохо</option>
        </select>
      </div>
      <p><b>NPC</b></p>
      <CharacterSelect ref="npc" @edited="npcEdited" :class="{ error: this.errors.npc }" />
      <span class="error-label" v-if="this.errors.npc">Это поле обязательно для заполнения</span>
      <div class="create-script-modal-name">
        <span>Отношение к главному персонажу</span>
        <select
          class="input"
          style="float: right; width: max-content; margin-left: 2px"
          v-model="to_main_character_relations"
        >
          <option value="не знаком">Не знаком</option>
          <option value="хорошо">Хорошо</option>
          <option value="нейтррально">Нейтрально</option>
          <option value="плохо">Плохо</option>
        </select>
      </div>
    </div>
    <div class="create-script-modal-cell create-script-modal-description">
      <h2 class="create-script-modal-h2">Краткое содержание</h2>
      <textarea
        class="input create-script-modal-description-input"
        v-model="description"
        :class="{ error: this.errors.description }"
      />
      <span class="error-label" v-if="this.errors.description"
        >Это поле обязательно для заполнения</span
      >
    </div>
    <div class="create-script-modal-cell create-script-modal-getting-item">
      <PlayerGetsSettings :checkbox="'предмет'" :input="'Предмет'" ref="playerGetsSettingsItem" />
    </div>
    <div class="create-script-modal-cell create-script-modal-getting-info">
      <PlayerGetsSettings
        :checkbox="'информацию'"
        :input="'Информация'"
        ref="playerGetsSettingsInfo"
      />
    </div>
    <div class="create-script-modal-cell create-script-modal-additional">
      <h2 class="create-script-modal-h2">Дополнительно</h2>
      <textarea class="input create-script-modal-additional-input" v-model="additional" />
    </div>
  </div>
</template>

<style scoped>
.create-script-modal-additional-input {
  height: 75px;
  resize: none;
  width: calc(100% - 6px);
}
.create-script-modal-container {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: repeat(4, auto);
  width: 100%;
  height: 100%;
  grid-gap: 10px;
}
.create-script-modal-h2 {
  text-align: left;
  font-weight: normal;
  margin-right: 5px;
  margin-top: 0;
}
.create-script-modal-name-text {
  margin-top: 0.75em;
}
.create-script-modal-cell {
  justify-self: left;
  width: 100%;
  justify-content: left;
  text-align: left;
}
.create-script-modal-name {
  display: flex;
  align-items: center;
}
.create-script-modal-count {
}
.create-script-modal-characters {
}
.create-script-modal-description {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
}
.create-script-modal-description-input {
  height: 100%;
  resize: none;
}
.create-script-modal-getting-item {
}
.create-script-modal-getting-info {
}
.create-script-modal-additional {
  grid-column: span 2;
  width: 100%;
}
.add-btn {
  cursor: pointer;
}
.input-wrapper {
  display: flex;
  flex-direction: column;
}
</style>