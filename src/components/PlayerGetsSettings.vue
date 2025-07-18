<script>
import Checkbox from "@/components/Checkbox.vue";
export default {
  name: "PlayerGetsSettings",
  props: ['checkbox', 'input', 'val'],
  components: {
    Checkbox
  },
  methods: {
    validate() {
      this.resetErrors();
      if (!this.gets) {
        return true; // Если чекбокс не отмечен, валидация проходит
      }

      const errors = [];
      const fieldLabels = {
        'name': 'Название ' + this.checkbox,
        'condition': 'Условие достижения ' + this.checkbox
      };

      for (const field of this.fieldsToValidate) {
        const value = this[field];

        if (typeof value === 'string') {
          if (!value.trim()) {
            errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
            this.errors[field] = true; // Исправлено: this.errors вместо errors
          }
        } else if (value === null || value === undefined) {
          errors.push(`Поле "${fieldLabels[field]}" обязательно для заполнения`);
          this.errors[field] = true; // Исправлено: this.errors вместо errors
        }
      }

      return errors.length === 0;
    },

    getFormData() {
      return {
        gets: this.gets,
        name: this.name,
        condition: this.condition
      };
    },

    checkboxChanged(value) {
      this.gets = value;
      if (!value) {
        this.name = '';
        this.condition = '';
        this.resetErrors(); // Сбрасываем ошибки при отключении чекбокса
      }
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false;
      }
    }
  },
  data(){
    return {
      gets: this.val?.gets,
      name: this.val?.name,
      condition: this.val?.condition,
      fieldsToValidate: ['name', 'condition'],
      errors: {
        name: false,
        condition: false
      }
    };
  }
}
</script>

<template>
  <div class="player-gets-settings">
    <Checkbox  :id="checkbox" :label="'Персонаж получит '+checkbox" :value="gets" @onChange="checkboxChanged"/>
    <div class="player-gets-settings-name-input" :class="{'gray': !this.gets}">
      <span class="player-gets-settings-name-label label">{{ input }}</span>
      <div class="input-wrapper">
        <input class="input" type="text" v-model="name" :disabled="!gets" :class="{error: this.errors.name}" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
      </div>
    </div>
    <div class="player-gets-settings-condition-input" :class="{gray: !this.gets}">
      <span class="player-gets-settings-condition-label">Условие достижения</span>
      <div class="input-wrapper">
        <input class="input player-gets-settings-condition-input-field" type="text" v-model="condition" :disabled="!gets" :class="{error: this.errors.condition}" />
        <span class="error-label" v-if="this.errors.condition">Это поле обязательно для заполнения</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .gray>* {
    border-color: #a5a5a5;
    color: #a5a5a5;
    pointer-events: none;
  }
  .player-gets-settings-name-input {
    margin-top: 12px;
    width: 100%;
    display: flex;
  }
  .player-gets-settings-condition-input {
    margin-top: 7px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: left;
    text-align: left;
  }
  .player-gets-settings-condition-label {
    margin-bottom: 5px;
  }
  .player-gets-settings-condition-input-field {
    width: auto;
  }
  .input-wrapper {
    display: flex;
    flex-direction: column;
  }
</style>