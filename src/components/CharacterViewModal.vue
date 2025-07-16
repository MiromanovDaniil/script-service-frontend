<template>
  <div v-if="visible" class="modal-bg" @click.self="close">
    <div class="modal-window">
      <!-- Кнопки удалить и закрыть -->
      <div class="modal-actions">
        <!-- Удалить последний персонаж (корзина) -->
        <button 
          class="icon-btn" 
          @click="deleteLast" 
          v-if="localChars.length > 0"
          title="Удалить последний"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="#a352fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2"/>
          </svg>
        </button>
        <!-- Закрыть (крестик) -->
        <button 
          class="icon-btn" 
          @click="close" 
          title="Закрыть"
        >
          <svg width="28" height="28" fill="none">
            <path d="M7 7l14 14M21 7L7 21" stroke="#a352fa" stroke-width="2"/>
          </svg>
        </button>
      </div>

      <h1 class="modal-title">Персонажи</h1>

      <div class="modal-grid-characters">
        <div
          v-for="char in localChars"
          :key="char.id"
          class="character-item"
        >
          <input
            v-model="char.name"
            type="text"
            class="input"
          />
          <button 
            @click="deleteCharacter(char.id)" 
            class="trash-btn"
            title="Удалить"
          >
            <svg width="20" height="20" fill="none">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
                    stroke="#a352fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="modal-buttons">
        <button @click="addCharacter" type="button" class="add-btn">
          Добавить персонажа
        </button>
        <button @click="save" type="button" class="save-btn">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CharactersModal",
  props: {
    visible:    { type: Boolean, default: false },
    characters: { type: Array,   default: () => [] }
  },
  data() {
    return {
      // локальная копия для редактирования, чтобы не мутировать проп напрямую
      localChars: []
    };
  },
  watch: {
    characters: {
      immediate: true,
      handler(newVal) {
        this.localChars = newVal.map(c => ({ ...c }));
      }
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    addCharacter() {
      const newId = Date.now();
      this.localChars.push({ id: newId, name: "Новый персонаж" });
    },
    deleteCharacter(id) {
      this.localChars = this.localChars.filter(c => c.id !== id);
    },
    deleteLast() {
      this.localChars.pop();
    },
    save() {
      this.$emit("save", this.localChars);
      this.close();
    }
  }
};
</script>

<style scoped>
.modal-bg {
  position: fixed; top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(100, 60, 90, 0.48);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
}

.modal-window {
  background: #fff;
  border-radius: 18px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 12px 48px #ab72e780;
  padding: 36px 38px 24px 38px;
  position: relative;
}

.modal-actions {
  position: absolute;
  top: 22px; right: 28px;
  display: flex; gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s;
}
.icon-btn:hover {
  transform: scale(1.18) rotate(7deg);
}

.modal-title {
  color: #8f4cef;
  margin-bottom: 18px;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 1.5px 1.5px 2px #e1c5ff96;
}

.modal-grid-characters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.character-item {
  display: flex;
  align-items: center;
  background: #fff1ff;
  border: 1.5px solid #b88df8;
  border-radius: 11px;
  padding: 8px 14px;
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #35235b;
  outline: none;
}

.trash-btn {
  background: none;
  border: none;
  margin-left: 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.trash-btn:hover {
  opacity: 0.7;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.add-btn,
.save-btn {
  background: linear-gradient(90deg,#c08cff 20%, #cde0ff 100%);
  color: #601f7e;
  border: none;
  border-radius: 7px;
  font-size: 18px;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px #e5d4ff33;
  transition: background 0.2s, transform 0.1s;
}
.add-btn:hover,
.save-btn:hover {
  background: #e5e1ff;
  transform: scale(1.04);
}
</style>