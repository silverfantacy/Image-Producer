<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emits = defineEmits(['update:open', 'insertText', 'output']);

const toggleOpen = () => {
  emits('update:open', !props.open)
}

</script>

<template>
  <!-- 操作列 -->
  <div class="base" :class="{ 'close': props.open }" style="cursor: pointer;">
    <div class="menu" @click="toggleOpen()">
      <div class="icon">
        <div class="bar"></div>
      </div>
    </div>
    <div class="icons">
      <font-awesome-icon icon="images" />
      <font-awesome-icon icon="font" />
      <font-awesome-icon icon="save" />
    </div>
    <div class="section">
      <div class="cover1">
        <div class="cover2">
          <a class="content" @click="emits('insertText'); toggleOpen();"></a>
        </div>
      </div>
    </div>
    <a class="section-static top" title="圖庫" data-bs-toggle="offcanvas" data-bs-target="#bucketModal"
      aria-controls="offcanvasBottom"></a>
    <a class="section-static bottom" @click="emits('output', 'png'); toggleOpen();"></a>
  </div>
</template>