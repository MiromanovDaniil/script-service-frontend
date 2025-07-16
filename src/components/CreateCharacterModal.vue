<template>
      <div class="modal-content">
        <div class="left-column">
          <div class="row">
            <div class="column">
              <label>Имя</label>
              <input type="text" v-model="name" class="input" />
        <span class="error-label" v-if="this.errors.name">Это поле обязательно для заполнения</span>
            </div>
            <div class="column">
              <label>Профессия</label>
              <input type="text" v-model="job" class="input" />
        <span class="error-label" v-if="this.errors.job">Это поле обязательно для заполнения</span>
            </div>
          </div>

          <div>
            <label>Характеристика</label>
            <textarea v-model="description" class="textarea" rows="5"></textarea>
        <span class="error-label" v-if="this.errors.description">Это поле обязательно для заполнения</span>
          </div>
        </div>

        <div class="right-column">
          <div>
            <label>Тип персонажа</label>
            <select v-model="type" class="input">
              <option disabled value="">Выберите тип</option>
              <option value="npc">NPC</option>
              <option value="main">Главный персонаж</option>
            </select>
        <span class="error-label" v-if="this.errors.type">Это поле обязательно для заполнения</span>
          </div>

          <div>
            <label>Характер</label>
            <input type="text" v-model="mood" class="input" />
        <span class="error-label" v-if="this.errors.mood">Это поле обязательно для заполнения</span>
          </div>

          <div>
            <label>Стиль речи</label>
            <textarea v-model="speechStyle" class="textarea" rows="3"></textarea>
        <span class="error-label" v-if="errors.speechStyle">Это поле обязательно для заполнения</span>
          </div>

          <div>
            <label>Внешний вид</label>
            <textarea v-model="appearance" class="textarea" rows="3"></textarea>
        <span class="error-label" v-if="this.errors.appearance">Это поле обязательно для заполнения</span>
          </div>
          
        </div>
      </div>
</template>

<script>
import ModalWindow from './ModalWindow.vue';

export default {
  name: "CharacterForm",
  components: { ModalWindow },
  data() {
    return {
      name: '',
      job: '',
      description: '',
      type: '',
      mood: '',
      speechStyle: '',
      appearance: '',
      fieldsToValidate: ['name', 'job', 'description', 'type', 'mood', 'speechStyle', 'appearance'],
      errors: {}
    };
  },
  methods: {
    handleClose() {
      this.$emit('closeModal', false);
    },
    validate() {
      this.resetErrors()
          const err = [];
        for (const field of this.fieldsToValidate) {
          const value = this[field]

         if (typeof value === 'string') {
            if (!value.trim()) {
              this.errors[field] = true
              err.push(1);
            }
          } else if (
            value === null ||
            value === undefined ||
            value === 0
          ) {
            this.errors[field] = true
            err.push(1);
          }
        return !err.length
      }
    },
    resetErrors() {
      for (const field in this.errors) {
        this.errors[field] = false
      }
    },
  }
};
</script>

<style scoped>
.modal-container {
  max-width: 900px;
  width: 90vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-content {
  display: flex;
  gap: 24px;
}

.left-column {
  flex: 2 1 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.right-column {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.row {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.input,
.textarea,
select {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  resize: vertical;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff1ff;
}
</style>
