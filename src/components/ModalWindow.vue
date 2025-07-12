<script>
import { ref } from 'vue';
export default{
  name: "ModalWindow",
  props: {header:'', showButtons: true},
  methods: {
    closeModal(){
      if (this.showButtons)
        this.$emit('closeModal', false)
    },
    handleSubmit(data) {
      this.$emit('validate-request', data);
    }
  }
}
</script>

<template>
  <div class="modal-window-container">
    <div class="modal-window-background" @click="closeModal"></div>
    <form class="modal-dialog noselect" @submit.prevent="handleSubmit">
      <button class="modal-dialog-close" v-if="showButtons" @click="closeModal">X</button>
      <div class="modal-dialog-header"><h1>{{header}}</h1></div>
      <div class="modal-dialog-body"><slot></slot></div>
      <div class="modal-dialog-footer"><button class="btn" v-if="showButtons" type="submit">Сохранить</button></div>
    </form>
  </div>
</template>

<style scoped>
 .modal-window-container{
   position: absolute;
   height: 100%;
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
 }
 .modal-dialog {
   padding: 20px;
   min-width: 30%;
   z-index: 100;
   background-color: white;
   border-radius: 10px;
   height: fit-content;
 }
 .modal-window-background {
   position: absolute;
   width: 110%;
   height: 110%;
   background-color: rgba(0, 0, 0, 0.75);
 }
 .modal-dialog-header {
   justify-self: center;
 }
 .modal-dialog-close{
   float: right;
   background: none;
   border: none;
   cursor: pointer;
 }
 .modal-dialog-footer {
   margin-top: 10px;
 }
 .modal-dialog-footer>.btn {
   float: right;
 }
</style>