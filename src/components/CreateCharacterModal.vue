<template>
      <div class="modal-content">
        <div class="left-column">
          <div class="row">
            <div class="column">
              <label>Имя</label>
              <input type="text" v-model="name" class="input" />
            </div>
            <div class="column">
              <label>Профессия</label>
              <input type="text" v-model="job" class="input" />
            </div>
          </div>

          <div>
            <label>Характеристика</label>
            <textarea v-model="description" class="textarea" rows="5"></textarea>
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
          </div>

          <div>
            <label>Настроение</label>
            <input type="text" v-model="mood" class="input" />
          </div>

          <div>
            <label>Стиль речи</label>
            <textarea v-model="speechStyle" class="textarea" rows="3"></textarea>
          </div>

          <div>
            <label>Внешний вид</label>
            <textarea v-model="appearance" class="textarea" rows="3"></textarea>
          </div>

          <div>
            <label>Дополнительно</label>
            <textarea v-model="extra" class="textarea" rows="3"></textarea>
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
      extra: '',
      fieldsToValidate: ['name', 'job', 'description', 'type', 'mood', 'speechStyle', 'appearance']
    };
  },
  methods: {
    submitForm() {
      const requiredFields = ['name', 'job', 'description', 'type', 'mood', 'speechStyle', 'appearance'];
      const emptyFields = requiredFields.filter(field => !this.form[field]?.trim());

      if (emptyFields.length > 0) {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
      }

      this.$emit('submit-character', this.form);
    },
    handleClose() {
      this.$emit('closeModal', false);
    }

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
