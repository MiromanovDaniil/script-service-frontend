<template>
    <div class="w-full h-full fixed top-0 left-0 bg-white shadow-lg rounded-lg p-6 flex flex-col">
        <!-- Left Column -->
        <div class="flex-1 space-y-4">
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-[#6200CD]">Имя</label>
              <input type="text" class="w-full border rounded p-2 input bg-[#FFF1FF]" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-[#6200CD]">Профессия</label>
              <input type="text" class="w-full border rounded p-2 input bg-[#FFF1FF]" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#6200CD] mb-1">Характеристика</label>
            <textarea
              class="w-full border rounded p-2 min-h-[120px] input resize-y overflow-auto bg-[#FFF1FF]"
              rows="5"
            ></textarea>
          </div>
        </div>

        <!-- Right Column -->
        <div class="w-1/3 space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#6200CD]">Тип персонажа</label>
            <select class="w-full border rounded p-2 input bg-[#FFF1FF]">
              <option value="npc">NPC</option>
              <option value="main">Главный персонаж</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#6200CD]">Настроение</label>
            <input type="text" class="w-full border rounded p-2 input bg-[#FFF1FF]" />
          </div>

          <div>
            <label class="block text-sm font-medium text-[#6200CD]">Стиль речи</label>
            <textarea
              class="w-full border rounded p-2 input resize-y overflow-auto bg-[#FFF1FF]"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#6200CD]">Внешний вид</label>
            <textarea
              class="w-full border rounded p-2 input resize-y overflow-auto bg-[#FFF1FF]"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-[#6200CD]">Дополнительно</label>
            <textarea
              class="w-full border rounded p-2 input resize-y overflow-auto bg-[#FFF1FF]"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
</template>

<script>
import ModalWindow from './ModalWindow.vue';

export default {
  name: "CharacterForm",
  components: { ModalWindow }
};
</script>

<style scoped>
/* Дополнительные стили при необходимости */
.input{
  resize: none;
}
</style>
