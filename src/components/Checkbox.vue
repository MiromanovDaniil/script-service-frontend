<script>

export default {
  name: "Checkbox",
  props: ['id', 'label', 'modelValue', 'value'],
  emits: ['update:modelValue', 'onChange'],
  methods: {
    handleChange(e) {
      this.$emit('update:modelValue', e.target.checked);
      this.$emit('onChange', e.target.checked);
    }
  }
}
</script>

<template>
  <div class="checkbox">
    <input
        type="checkbox"
        :id="id"
        :checked="value"
        @change="handleChange"
        class="checkbox-input"
    />
    <label :for="id">
      <span class="checkbox-label">{{ label }}</span>
    </label>
  </div>
</template>

<style scoped>
  .checkbox-label {
    padding-left: 5px;
  }
  .checkbox {
    margin-top: 5px;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .checkbox-input {
    appearance: none;
    position: relative;
    width: 30px;
    height: 30px;
    box-shadow: inset 0 0 5px rgb(0 0 0 / 0.2);
    border-radius: 10px;
    border: 1px solid #737373;
    transition: 500ms;
  }
  .checkbox-input::after {
    content: "\2714";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 0px;
    height: 0px;
    font-size: 26px;
    transition: 500ms;
    overflow: hidden;
  }
  .checkbox-input::after {
    content: "";
    position: absolute;
    width: 0px;
    height: 0px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='30' viewBox='0 -960 960 960' width='30' stroke='%23737373' stroke-width='30' fill='%23737373'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    transition: 500ms;
  }
  .checkbox-input:checked::after {
    width: 30px;
    height: 30px;
    transition: 500ms;
  }
  .checkbox-input:disabled {
    background: #ccc;
    border-color: #ccc;
  }

  .checkbox-input:disabled::after {
    filter: grayscale(100%);
  }
</style>