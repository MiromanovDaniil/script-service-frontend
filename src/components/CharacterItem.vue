<script>
export default {
  name: "CharacterItem"
}
</script>

<template>
  <div class="character-item-container">
    <input type="text" class="input">
    <img src="/assets/edit.png" class="character-item-edit" />
    <img src="/assets/delete.png" class="character-item-load" />
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