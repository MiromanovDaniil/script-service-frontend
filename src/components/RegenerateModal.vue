<template>
  <ModalWindow
    v-if="showModal"
    @closeModal="handleClose"
    @validate-request="submitPrompt" :showButtons="true"
    :header="'Редактировать'"
    width="800px"
  >
    <div class="prompt-editor">
      
      <div class="text-field">
        
        <textarea 
          v-model="mainPrompt" 
          placeholder="Введите текст диалога..."
          @input="handleInput"
        ></textarea>
      </div>

      <div class="prompt-label">
        <span>Дополнить промпт</span>
      </div>

      <div class="additional-field">
        <textarea
          v-model="additionalPrompt"
          placeholder="Дополнительные уточнения..."
          @input="handleInput"
        ></textarea>
        <button 
          class="regenerate-btn"
          @click="regeneratePrompt"
          title="Перегенерировать"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 4V8H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H8M20 20V16H19.4185M19.4185 16C18.2317 18.9318 15.3574 21 12 21C7.92038 21 4.55399 17.9463 4.06189 14M19.4185 16H16" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from './ModalWindow.vue';

export default {
  name: 'RegenerateModal',
  components: { ModalWindow },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    initialMainPrompt: {
      type: String,
      default: ''
    },
    initialAdditionalPrompt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mainPrompt: this.initialMainPrompt,
      additionalPrompt: this.initialAdditionalPrompt
    }
  },
  methods: {
    handleInput() {
      this.$emit('update', {
        main: this.mainPrompt,
        additional: this.additionalPrompt
      })
    },
    regeneratePrompt() {
      this.$emit('regenerate')
    },
    submitPrompt() {
      if (!this.mainPrompt.trim()) {
        alert('Пожалуйста, введите текст диалога');
        return;
      }
      this.$emit('submit', {
        main: this.mainPrompt,
        additional: this.additionalPrompt
      });
    },
    handleClose() {
      this.$emit('close');
    }
  },
  watch: {
    initialMainPrompt(newVal) {
      this.mainPrompt = newVal;
    },
    initialAdditionalPrompt(newVal) {
      this.additionalPrompt = newVal;
    }
  }
}
</script>

<style scoped>
.prompt-editor {
  width: 100%;
  padding: 16px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-content {
  display: flex;
  gap: 24px;
}

.text-field, .additional-field {
  margin-bottom: 0;
  position: relative;
  min-width: 0;
}

.prompt-label span {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #6B46C1;
  font-size: 14px;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  resize: vertical;
  font-size: 14px;
  transition: border-color 0.2s;
  background-color: #fff1ff;
  box-sizing: border-box;
}

.additional-field textarea {
  min-height: 80px;
}

textarea:focus {
  outline: none;
  border-color: #9F7AEA;
  box-shadow: 0 0 0 1px #9F7AEA;
}

.additional-field {
  display: flex;
  gap: 8px;
}

.regenerate-btn {
  width: 40px;
  height: 40px;
  align-self: flex-end;
  background: #F5F3FF;
  border: 1px solid #DDD6FE;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.regenerate-btn:hover {
  background: #EDE9FE;
  border-color: #C4B5FD;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #EDE9FE;
}

.cancel-btn, .submit-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #F5F3FF;
  border: 1px solid #DDD6FE;
  color: #6B46C1;
}

.submit-btn {
  background: #6B46C1;
  border: 1px solid #6B46C1;
  color: white;
}

.modal-window-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1000;
}

.modal-dialog-body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 80vh;
}
</style>