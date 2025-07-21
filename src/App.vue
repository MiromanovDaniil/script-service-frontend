<script>
import Notifications from '@/components/Notifications.vue'
import { toRaw } from 'vue';
import { load, state, saveState } from './store';
import { useRoute } from 'vue-router';

export default {
  components: { Notifications },
  mounted() {
    let route = useRoute();
    console.log(route.path)
    if(route.path === "/login" || route.path === "/register"){
      if(sessionStorage.getItem("user_id")){
        this.$router.push('/')
      }
    }
    else{
      if(!sessionStorage.getItem("user_id")){
        this.$router.push('/login')
      }
    }
    load().then(val=>{
      Object.assign(state, val.data)
      if (route.name === 'main') {
        state.selectedGameId = null
        state.selectedSceneId = null
        state.selectedSceneId = null
        saveState();
      }
    });
  }
}
</script>

<template>
  <div id="app">
    <router-view />
    <Notifications />
  </div>
</template>

<style>
body {
  overflow: hidden;
  
  background-color: #f3e8ff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #631E9B;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 97.5vh;
}
.btn {
    background: linear-gradient(90deg, #c08cff 20%, #cde0ff 100%);
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
.btn:hover {
  background: #e5e1ff;
  transform: scale(1.04);
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
  flex-basis: 100%;
}
.input {
  background-color: #f7f0ff;
  border-radius: 10px;
  height: fit-content;
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 8px;
  box-sizing: border-box;
  color: #30015f; 
}

.input:focus {
  border: #30015f 1px solid;
}

.icon-with-anim {
  transition: transform 0.1s;
}

.icon-with-anim:hover {
  transform: scale(1.18) rotate(7deg);
}

</style>