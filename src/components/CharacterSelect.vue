<script>
import { state } from '@/store.js'

export default {
  name: "CharacterSelect",
  computed: {
    state() {
      return state
    }
  },
  data() {
    return {
      character: "",
      error: false
    };
  },
  methods: {
    validate() {
      return this.character !== "";
    },
    edit(char_id) {
      this.$emit('char_edit', char_id);
    },
    createCharacter() {
      this.$emit('create_character')
    }
  }
}
</script>

<template>
  <div class="character-item-container">
    <select type="text" @change="createCharacter" :class="{error: this.error}" v-model="this.character" class="input">
      <option value="">Выбрать персонжа</option>
      <option v-for="char of state.games.find(g => g.id === this.$route.params.id).characters" :value="char.id">{{char.name}}</option>
    </select>
    <span style="cursor: pointer;" @click="createCharacter">+</span>
    <span class="error-label" v-if="this.error">Это поле обязательно для заполнения</span>
    <img src="/assets/edit.png" class="character-item-edit" @click="edit(this.character)" />
    <!--<UnpicImage
        src="@/assets/edit.png"
        layout="constrained"
        :width="800"
        :height="600"
        alt="Descriptive alt text"
    />-->
  </div>
</template>

<style scoped>
  .character-item-container {
    display: flex;
    align-items: center;
    grid-gap: 10px;
    margin-top: 10px;
  }
  .character-item-edit {
    height: 20px;
    width: auto;
    cursor: pointer;
  }
  .character-item-load {
    height: 25px;
    width: auto;
    cursor: pointer;
  }
</style>