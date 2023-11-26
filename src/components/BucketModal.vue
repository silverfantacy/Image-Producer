<script setup>
import { ref, reactive, watch, onMounted } from 'vue';


const props = defineProps({
  open: Boolean
})

const emits = defineEmits(['update:open', 'insertImg', 'closeNav'])

import image_lists from '@/image_url.json'
const bucket_data = ref(image_lists.map(item => {
  item.selected = false;
  return item
}))
const state = reactive({
  selected_img: [],
})
const bucket = ref(null)

onMounted(() => {
  bucket.value.addEventListener('hide.bs.offcanvas', function () {
    // do something...
    state.selected_img.selected = false
    state.selected_img = []
    emits('closeNav', false)
  })
})


// 選擇 bucket 圖片
function selected(item) {
  if (state.selected_img) {
    state.selected_img.selected = false
  }
  item.selected = true
  state.selected_img = item
}

const closeButton = ref(null)
const close = () => {
  closeButton.value.click()
}

</script>

<template>
  <div class="offcanvas offcanvas-bottom rounded-3" tabindex="-1" id="bucketModal" aria-labelledby="bucketModalLabel"
    ref="bucket">
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title" id="bucketModalLabel">圖庫</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"
        ref="closeButton"></button>
    </div>
    <div class="offcanvas-body img_list">
      <ul class="">
        <li class="list-item cursor-pointer" v-for="(item, key) in bucket_data" :key="key" @click="selected(item)"
          data-toggle="tooltip" :data-original-title="item.title" data-placement="bottom">
          <img :src="item.url" :alt="item.title">
          <span class="selected" v-if="item.selected">
            <font-awesome-icon icon="check-circle" size="3x" fixed-width />
          </span>
        </li>
      </ul>
    </div>
    <div class="border-top p-3 d-flex justify-content-center">
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group" aria-label="Second group">
          <label for="imgLoader" title="上傳圖片" class="btn btn-outline-primary">上傳圖片</label>
          <label for="bgImgLoader" title="上傳背景" class="btn btn-outline-primary">上傳背景</label>
        </div>
        <div class="btn-group" role="group" aria-label="Third group">
          <button type="button" class="btn btn-primary"
            @click="emits('insertImg', state.selected_img); close()">置入</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>