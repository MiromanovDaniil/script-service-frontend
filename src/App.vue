<script>
  //import "@/../api/api.js"
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
body {
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
.btn {
  background: none;
  cursor: pointer;
  border: #363636 1px solid;
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
  flex-basis: 100%;
}
</style>
