<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  control: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['addHandler']);

</script>

<template>
  <div id="textMenu" class="container-fluid d-flex flex-row justify-content-center" :class="{ 'd-none': open }"
    ref="textMenu">
    <div class="d-flex flex-wrap justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group m-2 align-items-center" role="group" aria-label="Second group">
        <label for="color" class="text-white me-2">文字顏色</label>
        <input type="color" id="color" class="form-control form-control-color" v-model="control.color">
      </div>
      <div class="btn-group m-2 align-items-center" role="group" aria-label="Second group">
        <label for="bg-color" class="text-white me-2">背景顏色</label>
        <input type="color" id="bg-color" class="form-control form-control-color" v-model="control.bgColor">
      </div>
      <div class="btn-group m-2" role="group" aria-label="Second group">
        <button id="italic" class="btn btn-primary btn-sm" @click="emits('addHandler', 'italic')">斜體</button>
        <button id="underline" class="btn btn-primary btn-sm" @click="emits('addHandler', 'underline')">底線</button>
      </div>
      <div class="btn-group m-2" role="group" aria-label="Third group">
        <button id="center" class="btn btn-primary btn-sm" @click="emits('addHandler', 'center')">置中</button>
        <button id="left" class="btn btn-primary btn-sm" @click="emits('addHandler', 'left')">置左</button>
        <button id="right" class="btn btn-primary btn-sm" @click="emits('addHandler', 'right')">置右</button>
      </div>
    </div>
  </div>
</template>