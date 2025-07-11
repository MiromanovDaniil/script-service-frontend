<script lang="ts">
import Sidebar from "./Sidebar.vue";
import Main from "./MainView.vue";
import ModalWindow from "./ModalWindow.vue";
import CreateScriptModal from "./CreateScriptModal.vue";
import CreateSceneModal from "./CreateSceneModal.vue";
import {state, defaultState} from '@/store.js';
import '@/types.js';
export default {
  name: 'EditGamePage',
  computed: {
    state() {
      return state
    }
  },
  components: {
    CreateScriptModal,
    CreateSceneModal,
    ModalWindow,
    Sidebar,
    Main
  },
  methods: {
    createGame(game) {
      state.games.push({
        id: game.id.toString(),
        name: game.title,
        scenes: [],
        characters: [],
      });
      this.games.push(game);
    },
    createScene(scene) {
      state.games[state.games.findIndex(game => game.id === state.selectedGameId)].scenes.push({
        id: scene.id,
        name: scene.name,
        scripts: scene.scripts,
        characters: scene.characters
      });
    },
    setCreateScriptModalState(state) {
      this.createScriptModalOpened = state;
      if (!state) {
        this.createScriptGameId = null;
      }
    },
    setCreateSceneModalState(state) {
      this.createSceneModalOpened = state;
    },
    addScript(scene) {
      this.setCreateScriptModalState(true);
      this.createScriptGameId = state.selectedGameId;
      this.createScriptSceneId = scene;
    },
    addScene() {
      this.setCreateSceneModalState(true);
    },
    saveScript() {
      if(this.$refs.child.validate()) {
        let child = this.$refs.child;
        let game = state.games[state.games.findIndex(game => game.id === this.createScriptGameId)];
        let scenes = game.scenes;
        scenes[scenes.findIndex(gameId => gameId === this.createScriptSceneId)].scripts.push({
          id: Date.now(),
          name: child.name,
          answersCount: child.answers_count,
          branchesCount: child.branches_count,
          character: {},
          description: child.description,
          getsItem: child.itemData.gets,
          itemName: child.itemData.name,
          itemCondition: child.itemData.condition,
          getsInfo: child.infoData.gets,
          infoName: child.infoData.name,
          infoCondition: child.infoData.condition,
          additional: child.additional
        });
        this.setCreateScriptModalState(false);
      }
    },
    saveScene() {
      if (this.$refs.sceneChild.validate()) {
        let child = this.$refs.sceneChild;
        let game = state.games[state.games.findIndex(game => game.id === state.selectedGameId)];
        game.scenes.push({
          id: Date.now(),
          name: child.name,
          character: child.characters,
          description: child.description,
          scripts: []
        });
        this.setCreateSceneModalState(false);
      }
    }
  },
  data() {
    return {'games': [
        {id: "1752067787408", title: 'Game 1', scripts: [], characters: []},
        {id: 2, title: 'Game 2', scripts: [], characters: []},
      ],
      createScriptModalOpened: false,
      createSceneModalOpened: false,
      createScriptGameId: null,
      scenes: []
    };
  },
  mounted() {
    if (!localStorage.getItem('scenario-data')) {
      localStorage.setItem('scenario-data', JSON.stringify(defaultState));
    }
  }
}
</script>

<template>
  <div class="edit-game-page-container">
    <Sidebar :scenes="state.games[state.games.findIndex(game => game.id === state.selectedGameId)].scenes" @addScene="addScene" @addScript="addScript"/>
    <Main/>
    <ModalWindow v-if="createScriptModalOpened" :header="'Создать сценарий'" @closeModal="setCreateScriptModalState" @validate-request="saveScript"><CreateScriptModal ref="child"/></ModalWindow>
    <ModalWindow v-if="createSceneModalOpened" :header="'Создать сцену'" @closeModal="setCreateSceneModalState" @validate-request="saveScene"><CreateSceneModal ref="sceneChild"/></ModalWindow>
  </div>
</template>

<style scoped>
  .edit-game-page-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 97.5vh;
  }
</style>