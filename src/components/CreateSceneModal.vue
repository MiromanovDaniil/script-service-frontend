<script lang="ts">
import CharacterItem from "@/components/CharacterItem.vue";
import Scrollview from "@/components/Scrollview.vue";
import {state} from "./../store";

export default {
  name: "CreateScriptModal",
  components: {Scrollview, CharacterItem},
  data() {
    return {
      name: '',
      characters: [],
      description: '',
      fieldsToValidate: ['name', 'description'],
      errors: {
        name: false,
        description: false
      }
    };
  },
  methods: {
    validate() {
      this.resetErrors();
      const errors = [];

      const fieldLabels = {
        'name': 'Название',
        'characters': 'Персонажи',
        'description': 'Характеристики сцены'
      };

      for (const field of this.fieldsToValidate) {
        const value = this[field];

        if (field === 'characters') {
          if (value.length === 0) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
            this.errors[field] = true;
          }
        } else if (typeof value === 'string') {
          if (!value.trim()) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
            this.errors[field] = true;
          }
        } else if (value === null || value === undefined || value === 0) {
          errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
          this.errors[field] = true;
        }
      }
      return !errors.length;
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false;
      }
    }
  }
}
</script>

<template>
  <div class="create-scene-modal-container">
    <div class="create-scene-modal-cell create-scene-modal-name">
      <h2 class="create-scene-modal-h2 create-scene-modal-name-text">Имя</h2>
      <div class="input-wrapper">
        <input class="input" type="text" v-model="name" :class="{error: this.errors.name}" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="create-scene-modal-cell create-scene-modal-description">
      <h2 class="create-scene-modal-h2">Краткое содержание</h2>
      <textarea class="input create-scene-modal-textarea-input" v-model="description" :class="{error: this.errors.description}" />
      <span class="error-label" v-if="this.errors.description">Это поле обязательно для заполнения</span>
    </div>
    <div class="create-scene-modal-cell create-scene-modal-characters">
      <h2 class="create-scene-modal-h2">Персонажи <span class="add-btn">+</span></h2>
      <button type="button" class="btn">Выбрать из игры</button>
      <Scrollview :w="'100%'" :h="'200px'" :class="{error: this.errors.characters}" >
        <CharacterItem v-for="char of characters" />
      </Scrollview>
    </div>
  </div>
</template>

<style scoped>
  .create-scene-modal-container{
    display: grid;
    grid-template-columns: 50% auto;
    grid-template-rows: auto auto;
    width: 100%;
    height: 100%;
    grid-gap: 20px;
  }
  .create-scene-modal-h2{
    text-align: left;
    font-weight: normal;
    margin-right: 5px;
    margin-top: 0;
  }
  .create-scene-modal-cell{
    justify-self: left;
    width: 100%;
    justify-content: left;
    text-align: left;
  }
  .create-scene-modal-name {
    grid-column: span 2;
    display: flex;
    align-items: center;
  }
  .input-wrapper {
    display: flex;
    flex-direction: column;
  }
  .create-scene-modal-name-text{
    margin-top: .75em;
  }
  .create-scene-modal-textarea-input {
    min-height: 100px;
    height: calc(100% - 80px);
    resize: none;
    width: calc(100% - 6px);
  }
  .add-btn {
    cursor: pointer;
  }
</style>