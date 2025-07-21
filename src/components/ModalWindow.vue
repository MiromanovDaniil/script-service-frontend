<script>
import { ref } from 'vue';
export default{
  name: "ModalWindow",
  props: {header:{type:String, required:true}, showButtons: {type:Boolean, required:false}, regen: {type: Boolean, required:false}},
  methods: {
    closeModal(){
      if (this.showButtons)
        this.$emit('closeModal', false)
    },
    handleSubmit(data) {
      this.$emit('validate-request', data);
      if (this.regen){
        this.$emit('regenerate', data);
      }
    }
  }
}
</script>

<template>
  <div class="modal-window-container">
    <div class="modal-window-background" @click="closeModal"></div>
    <form class="modal-dialog noselect" @submit.prevent="handleSubmit">
      <button class="modal-dialog-close" v-if="showButtons" @click="closeModal"><svg width="28" height="28" fill="none"><path d="M7 7l14 14M21 7L7 21" stroke="#a352fa" stroke-width="2"/></svg></button>
      <div class="modal-dialog-header"><h1 class="modal-dialog-header-text">{{header}}</h1></div>
      <div class="modal-dialog-body"><slot></slot></div>
      <div class="modal-dialog-footer">
        <button class="btn save-btn" v-if="showButtons" type="submit">Сохранить</button>
        <button class="btn save-btn" v-if="showButtons && regen" type="submit">Перегенерировать</button>
      </div>
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
   background: #fff;
    border-radius: 18px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 12px 48px #ab72e780;
    padding: 36px 38px 24px 38px;
    position: relative;
    overflow-y: hidden;
    height: fit-content;
   z-index: 100;
  }
 .modal-window-background {
   position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(100, 60, 90, 0.48);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
 }
 .modal-dialog-header {
   justify-self: center;
 }
 .modal-dialog-header-text {
  color: #8f4cef;
  margin-bottom: 18px;
  font-size: 36px;
  font-weight: 700;
  text-align: left;
  text-shadow: 1.5px 1.5px 2px #e1c5ff96;
 }
 .modal-dialog-body {
  max-height: 65vh;
  overflow-y: auto;
 }
 .modal-dialog-footer {
  margin-top: 10px;
  margin-bottom: 10px;
 }
 .modal-dialog-footer>.btn {
   float: right;
   margin-left: 2vw;
 }

.save-btn:hover {
  background: #e5e1ff;
  transform: scale(1.04);
}
.modal-dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 30px;
  padding: 0 4px;
  transition: transform 0.1s;
  float: right;
}
.modal-dialog-close:hover {
  transform: scale(1.18) rotate(7deg);
}
</style>