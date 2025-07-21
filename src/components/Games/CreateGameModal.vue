<template>
  <ModalWindow :header="'Игра'" @validate-request="submit" @closeModal="close" :showButtons="true">
      <div class="modal-form">
        <div class="modal-grid">
          
          <div>
            <div class="field-group">
              <label class="field-label">Название</label>
              <input v-model="game.name" required class="input" />
            </div>
            <div class="field-group">
              <label class="field-label">Характеристики мира</label>
              <textarea v-model="game.description" required class="input textarea" />
            </div>
          </div>
          
          <div>
            <div class="field-group">
              <label class="field-label">Жанр</label>
              <select v-model="game.genre" required class="input">
                <option disabled value="">Выберите жанр</option>
                <option>Приключения</option>
                <option>Фэнтези</option>
                <option>Детектив</option>
                <option>Драма</option>
                <option>Комедия</option>
                <option>Ужасы</option>
                <option>Стратегия</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Исторический период</label>
              <select v-model="game.techLevel" required class="input">
                <option disabled value="">Выберите уровень</option>
                <option>Каменный век</option>
                <option>Средневековье</option>
                <option>Эпоха Возрождения</option>
                <option>Индустриальный</option>
                <option>Современность</option>
                <option>Будущее</option>
                <option>Другое</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Тональность</label>
              <select v-model="game.tonality" class="input">
                <option>Нейтральная</option>
                <option>Героическая</option>
                <option>Трагическая</option>
                <option>Комическая</option>
                <option>Сказочная</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </ModalWindow>
</template>

<script>
import ModalWindow from '../ModalWindow.vue';

export default {
  name: 'CreateGameModal',
  components: {ModalWindow},
  props: {
    showDelete: { type: Boolean, default: false },
    gameData: { type: Object, default: null },
  },
  data() {
    return {
      game: {
        name: '',
        description: '',
        genre: '',
        techLevel: '',
        tonality: 'Нейтральная',
      },
      fieldsToValidate: ['name', 'description', 'genre', 'techLevel'],
      errors: {},
    }
  },
  watch: {
    gameData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.game = { ...val }
        }
      },
    },
  },
  methods: {
    validate() {
      this.resetErrors();
      let isValid = true;
      const fieldLabels = {
        name: 'Название',
        description: 'Характеристики мира',
        genre: 'Жанр',
        techLevel: 'Исторический период'
      };

      for (const field of this.fieldsToValidate) {
        const value = this.game[field];
        
        if (Array.isArray(value)) {
          if (value.length === 0) {
            this.errors[field] = true;
            isValid = false;
          }
        } 
        else if (typeof value === 'string') {
          if (!value.trim()) {
            this.errors[field] = true;
            isValid = false;
          }
        } 
        else if (value === null || value === undefined) {
          this.errors[field] = true;
          isValid = false;
        }
      }

      return isValid;
    },
    
    resetErrors() {
      this.errors = {};
    },
    
    submit() {
      if (!this.validate()) {
        return; // Не сохраняем если есть ошибки
      }
      this.$emit('save', { ...this.game })
      this.close()
    },
    close() {
      this.$emit('close')
    },
    remove() {
      this.$emit('delete')
    }
  },
}
</script>

<style scoped>

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 30px;
  padding: 0 4px;
  transition: transform 0.1s;
}
.icon-btn:hover {
  transform: scale(1.18) rotate(7deg);
}
.modal-title {
  color: #8f4cef;
  margin-bottom: 18px;
  font-size: 36px;
  font-weight: 700;
  text-align: left;
  text-shadow: 1.5px 1.5px 2px #e1c5ff96;
}

.modal-form {
  width: 100%;
}

.modal-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 5%;
}

.field-group {
  margin-bottom: 22px;
}

.field-label {
  display: block;
  font-size: 22px;
  font-weight: 500;
  color: #8f4cef;
  margin-bottom: 7px;
  text-align: left;
  text-shadow: 1.5px 1.5px 1.5px #dac6ff67;
}

.input {
  width: 100%;
  border-radius: 11px;
  border: 1.5px solid #b88df8;
  padding: 8px 14px;
  font-size: 19px;
  background: #fff1ff;
  outline: none;
  transition: border-color 0.15s;
  color: #35235b;
}

.input:focus {
  border-color: #a352fa;
}
.textarea {
  min-height: 110px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.35;
}
.modal-buttons {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
.save-btn {
  background: linear-gradient(90deg, #c08cff 20%, #cde0ff 100%);
  color: #601f7e;
  border: none;
  border-radius: 7px;
  font-size: 21px;
  padding: 10px 36px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px #e5d4ff33;
  transition:
    background 0.2s,
    transform 0.1s;
}
.save-btn:hover {
  background: #e5e1ff;
  transform: scale(1.04);
}
</style>
