<template>
  <main id="main">
    <router-view />
  </main>
</template>

<style scoped>
  #main {
    background-color: blue;
    width: 100%;
  }
</style>

<script>
export default {
  name: "Main"
}
</script>