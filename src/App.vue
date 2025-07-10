<template>
    <div id="app">
      <Sidebar :scenes="state.games[state.games.findIndex(game => game.id === state.selectedGameId)].scenes" @create="createScene" @addScript="addScript"/>
      <Main/>
      <ModalWindow v-if="createScriptModalOpened" :header="'Создать сценарий'" @closeModal="setCreateScriptModalState" @validate-request="saveScript"><CreateScriptModal ref="child"/></ModalWindow>
      <ModalWindow v-if="createSceneModalOpened" :header="'Создать сцену'" @closeModal="setCreateSceneModalState" @validate-request="saveScene"><CreateSceneModal ref="sceneChild"/></ModalWindow>
    </div>
  </template>
  
  <script>
  import Sidebar from "./components/Sidebar.vue";
  import Main from "./components/Main.vue";
  import ModalWindow from "./components/ModalWindow.vue";
  import CreateScriptModal from "./components/CreateScriptModal.vue";
  import CreateSceneModal from "./components/CreateSceneModal.vue";
  import {state, defaultState} from './store.js';
  import './types';
  //submitData();
  export default {
    name: 'App',
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
        this.setCreateScriptModalState(true);
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
      }
    },
    data() {
      return {'games': [
          {id: "1752067787408", title: 'Game 1', scripts: [], characters: []},
          {id: 2, title: 'Game 2', scripts: [], characters: []},
        ],
        createScriptModalOpened: false,
        createSceneModalOpened: true,
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
  
  <style>
    body{
      overflow: hidden;
    }
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 97.5vh;
    }
    .btn{
      background: none;
      cursor: pointer;
      border: #363636  1px solid;
      padding: 7px 4.5%;
      border-radius: 7px;
    }
    .input {
      border-radius: 10px;
      border: black 1px solid;
      height: fit-content;
      width: 100%;
    }
    .number-input {
      field-sizing: content;
      width: fit-content;
    }
    .label {
      margin-right: 2%;
    }
    .flipped-vert {
      -webkit-transform: scale(-1, -1);
      -moz-transform: scale(-1, -1);
      -o-transform: scale(-1, -1);
      transform: scale(-1, -1);
    }
    .noselect {
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
                                      supported by Chrome, Edge, Opera and Firefox */
    }
    .error {
      border: #bf0000 1px solid;
    }
    .error-label {
      color: #bf0000;
      font-size: small;
      flex-basis:100%
    }
  </style>
  