<script lang="ts">
import Sidebar from './Sidebar.vue'
import MainView from './MainView.vue'
import ModalWindow from './ModalWindow.vue'
import CreateScriptModal from './CreateScriptModal.vue'
import CreateSceneModal from './CreateSceneModal.vue'
import { state, defaultState, saveState } from '@/store.js'
import '@/types.js'
import ScriptItem from '@/components/ScriptItem.vue'
import { watch } from 'vue'
import AnswerLoadingModal from '@/components/AnswerLoadingModal.vue'
import CreateCharacterModal from '@/components/CreateCharacterModal.vue'
import { submitDialogData } from '../api/api'
import { scene } from '@/types.js'

export default {
  name: 'EditGamePage',
  computed: {
    stateLoc() {
      return state
    },
  },
  components: {
    AnswerLoadingModal,
    ScriptItem,
    CreateScriptModal,
    CreateSceneModal,
    ModalWindow,
    Sidebar,
    MainView,
    CreateCharacterModal,
  },
  methods: {
    checkGameExists() {
      if (!this.game) {
        this.$router.push('/')
      }
    },
    createGame(game) {
      state.games.push({
        id: game.id.toString(),
        name: game.title,
        scenes: [],
        characters: [],
      })
      this.games.push(game)
      saveState()
    },
    createScene(scene) {
      state.games[state.games.findIndex((game) => game.id === state.selectedGameId)].scenes.push({
        id: scene.id,
        name: scene.name,
        scripts: scene.scripts,
        characters: scene.characters,
      })
      saveState()
    },
    setCreateScriptModalState(state) {
      this.createScriptModalOpened = state
      if (!state) {
        this.createScriptGameId = null
      }
    },
    setCreateSceneModalState(state) {
      this.createSceneModalOpened = state
    },
    setAnswerLoadingModalState(state) {
      this.answerLoadingModalOpened = state
    },
    setCreateCharacterModalState(state) {
      this.createCharacterModalOpened = state
    },
    addScript(scene) {
      this.setCreateScriptModalState(true)
      this.createScriptGameId = state.selectedGameId
      this.createScriptSceneId = scene
      this.scriptEdit = "false";
      this.scriptToEdit = null;
      this.scriptEditScene = scene;
    },
    addScene() {
      this.sceneToEdit = null
      this.setCreateSceneModalState(true)
    },
    editScene(scene) {
      this.sceneToEdit = { ...scene }
      this.setCreateSceneModalState(true)
    },
    deleteScene(scene) {
      const game = state.games[state.games.findIndex((g) => g.id === state.selectedGameId)]
      game.scenes = game.scenes.filter((s) => s.id !== scene.id)
      saveState()
    },
    deleteScript(script, scene) {
      const game = state.games[state.games.findIndex((g) => g.id === state.selectedGameId)]
      const sc = game.scenes[game.scenes.findIndex((s) => s.id === scene.id)];
      sc.scripts = sc.scripts.filter(s => s.id !== script.id)
      saveState();
    },
    editScript(script, scene) {
      this.setCreateScriptModalState(true)
      this.createScriptGameId = state.selectedGameId
      this.createScriptSceneId = scene.id
      this.scriptEdit = script.id;
      this.scriptToEdit = script;
      this.scriptEditScene = scene;
    },
    saveScript() {
      if (this.$refs.child.validate()) {
        let child = this.$refs.child
        let gameId = this.createScriptGameId
        let sceneId = this.createScriptSceneId
        let game = state.games[state.games.findIndex((game) => game.id === this.createScriptGameId)]
        let scenes = game.scenes
        let dialog = {
          id: this.scriptToEdit === "false" ? Date.now().toString() : this.scriptToEdit.id,
          name: child.name,
          answers_from_m: child.answers_from_m,
          answers_to_m: child.answers_to_m,
          answers_from_n: child.answers_from_n,
          answers_to_n: child.answers_to_n,
          main_character: child.main_character,
          to_npc_relations: child.to_npc_relations,
          npc: child.npc,
          to_main_character_relations: child.to_main_character_relations,
          description: child.description,
          itemData: child.itemData,
          infoData: child.infoData,
          additional: child.additional,
          result: {},
        }
        let scene = scenes[scenes.findIndex((gameId) => gameId.id == this.createScriptSceneId)]
        this.setCreateScriptModalState(false)
        if (this.scriptToEdit === "false"){
          scene.scripts.push(dialog)
        }
        else {
          scene.scripts[scene.scripts.findIndex(s => s.id == this.scriptToEdit.id)] = dialog;
          saveState();
          return
        }

        let goals = []
        if (dialog.infoData.gets) {
          goals.push({
            type: 'получение информации',
            object: dialog.infoData.name,
            condition: dialog.infoData.condition,
          })
        }
        if (dialog.itemData.gets) {
          goals.push({
            type: 'получение предмета',
            object: dialog.itemData.name,
            condition: dialog.itemData.condition,
          })
        }

        const dialogData = {
          npc: game.characters.find((c) => c.id == child.npc),
          hero: game.characters.find((c) => c.id == child.main_character),
          world_settings: game.description,
          NPC_to_hero_relation: dialog.to_main_character_relations,
          hero_to_NPC_relation: dialog.to_npc_relations,
          mx_answers_cnt: dialog.answers_to_m,
          mn_answers_cnt: dialog.answers_from_m,
          mx_depth: dialog.answers_to_n,
          mn_depth: dialog.answers_from_m,
          scene: scene.description,
          genre: game.genre,
          epoch: game.techLevel,
          tonality: game.tonality,
          extra: dialog.additional,
          context: dialog.description,
          goals: goals,
        }
        submitDialogData(dialogData)
          .then(
            (response) =>
              (scenes[
                scenes.findIndex((gameId) => gameId === this.createScriptSceneId)
              ].scripts.find((s) => s.id == dialog.id).result = response),
          )
          .catch((error) => console.error('Ошибка:', error))
      }
      saveState()
    },
    saveScene() {
      if (this.$refs.sceneChild.validate()) {
        let child = this.$refs.sceneChild
        let game = state.games[state.games.findIndex((game) => game.id === state.selectedGameId)]
        if (this.sceneToEdit) {
          const idx = game.scenes.findIndex((s) => s.id === this.sceneToEdit.id)
          if (idx !== -1) {
            game.scenes[idx] = {
              ...game.scenes[idx],
              name: child.name,
              characters: child.characters,
              description: child.description,
            }
          }
        } else {
          game.scenes.push({
            id: Date.now(),
            name: child.name,
            characters: child.characters,
            description: child.description,
            scripts: [],
          })
        }
        saveState()
        this.sceneToEdit = null
        this.setCreateSceneModalState(false)
      }
    },
  },
  data() {
    return {
      games: [
        { id: '1752067787408', title: 'Game 1', scripts: [], characters: [] },
        { id: 2, title: 'Game 2', scripts: [], characters: [] },
      ],
      createScriptModalOpened: false,
      createSceneModalOpened: false,
      createScriptGameId: null,
      scenes: [],
      game: null,
      answerLoadingModalOpened: false,
      createCharacterModalOpened: false,
      scriptEdit: 'false',
      scriptToEdit: null,
      scriptEditScene: null,
      sceneToEdit: null,
    }
  },
  mounted() {
    if (!localStorage.getItem('scenario-data')) {
      localStorage.setItem('scenario-data', JSON.stringify(defaultState))
    }

    // Find the game
    this.game = state.games.find((g) => g.id === this.$route.params.id)
    state.selectedGameId = this.$route.params.id

    // Check if game exists
    this.checkGameExists()

    // Watch for route changes
    this.$watch(
      () => this.$route.params.id,
      (newId) => {
        this.game = state.games.find((g) => g.id === newId)
        state.selectedGameId = newId
        this.checkGameExists()
      },
    )
  },
  // Alternative using beforeMount
  beforeMount() {
    this.game = state.games.find((g) => g.id === this.$route.params.id)
    if (!this.game) {
      this.$router.push('/')
    }
  },
}
</script>

<template>
  <div class="edit-game-page-container" v-if="game">
    <Sidebar
      v-if="game"
      :scenes="game.scenes"
      @addScene="addScene"
      @addScript="addScript"
      @editScene="editScene"
      @deleteScene="deleteScene"
      @editScript="editScript"
      @deleteScript="deleteScript"
    />
    <MainView
      v-if="!(stateLoc.selectedSceneId === null || stateLoc.selectedScriptId === null)"
      @createScene="addScene"
      @createScript="addScript"
    />
    <span v-else>Здесь появится открытый диалог</span>
    <ModalWindow
      v-if="createScriptModalOpened"
      :header="'Диалог'"
      :show-buttons="true"
      @closeModal="setCreateScriptModalState"
      @validate-request="saveScript"
    >
      <CreateScriptModal ref="child" :edit="scriptEdit" :script="scriptToEdit" :scene="scriptEditScene" />
    </ModalWindow>

    <ModalWindow
      v-if="createSceneModalOpened"
      :header="'Сцена'"
      :show-buttons="true"
      @closeModal="setCreateSceneModalState"
      @validate-request="saveScene"
    >
      <CreateSceneModal ref="sceneChild" :sceneData="sceneToEdit" />
    </ModalWindow>

    <ModalWindow
      v-if="answerLoadingModalOpened"
      :header="'Идет загрузка...'"
      @closeModal="setAnswerLoadingModalState"
      :show-buttons="false"
    >
      <AnswerLoadingModal />
    </ModalWindow>
    <ModalWindow
      v-if="createCharacterModalOpened"
      :header="'Персонаж'"
      @closeModal="setCreateCharacterModalState"
      :show-buttons="true"
    >
      <CreateCharacterModal />
    </ModalWindow>
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
