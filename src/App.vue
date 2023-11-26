<template>
  <div id="canvas-wrapper" class="editor-area">
    <div class="canvas-bg-wrapper h-100">
      <canvas :width="state.width" :height="state.height" ref="c"></canvas>
    </div>
  </div>

  <Menu ref="menu" v-model:open="state.openNav" @insertText="insertText" @output="output" />

  <!-- 通用控制 -->
  <div class="controls">
    <input type="file" id="imgLoader" @change="handleImage" class="d-none" accept=".jpg, .jpeg, .png, .bmp" />
    <input type="file" id="bgImgLoader" @change="handleBgImage" class="d-none" accept=".jpg, .jpeg, .png, .bmp" />

    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
      title="移除背景" @click="clearCanvasBackground">
      <font-awesome-icon icon="chess-board" size="lg" fixed-width />
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
      :class="{ 'd-none': !state.selected_obj_class }" title="刪除" @click="deleteObjects">
      <font-awesome-icon icon="trash-alt" size="lg" fixed-width />
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
      :class="{ 'd-none': !state.selected_obj_class }" title="上移" @click="bringForward">
      <font-awesome-icon icon="caret-square-up" size="lg" fixed-width />
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
      :class="{ 'd-none': !state.selected_obj_class }" title="下移" @click="sendBackwards">
      <font-awesome-icon icon="caret-square-down" size="lg" fixed-width />
    </button>
    <button v-if="!!state.undo.length"
      class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" title="返回"
      @click="doUndo()">
      <font-awesome-icon icon="undo" size="lg" fixed-width />
    </button>
    <button v-if="!!state.redo.length"
      class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" title="重做"
      @click="doRedo()">
      <font-awesome-icon icon="redo" size="lg" fixed-width />
    </button>
  </div>

  <!-- 文字控制選項 -->
  <TextControls :open="state.hideOperations" :control="state.control" @addHandler="addHandler" />

  <!-- 圖庫 -->
  <BucketModal :open="state.openBucket" @closeNav="state.openNav = false" @insertImg="insertImg" />
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";

import Menu from './components/Menu.vue';
import TextControls from './components/TextControls.vue';
import BucketModal from './components/BucketModal.vue';

import { fabric } from 'fabric'

const c = ref(null);
let canvas
const state = reactive({
  // width : 260,
  // height: 360
  width: window.innerWidth,
  height: window.innerHeight,
  hideOperations: true,
  control: {
    color: '#000000',
    bgColor: '#000000'
  },
  undo: [],
  redo: [],
  selected_obj_class: false,

  //
  openNav: false,
  openBucket: false,
})

watch(
  () => state.control.color,
  (count) => {
    let obj = canvas.getActiveObject()
    obj.set({
      fill: count,
    })
    canvas.renderAll()
  }
)
watch(
  () => state.control.bgColor,
  (count) => {
    let obj = canvas.getActiveObject()
    obj.set({
      textBackgroundColor: count
    })
    canvas.renderAll()
  }
)


//upload image
function handleImage(e) {
  // 紀錄
  statusSave()

  let reader = new FileReader();
  reader.onload = function (event) {
    let imgObj = new Image();
    imgObj.src = event.target.result;
    imgObj.onload = function () {
      // alert(this.width + 'x' + this.height);
      let image = new fabric.Image(imgObj);
      let icon_ize = 200
      let scale = this.width > this.height ? icon_ize / this.width : icon_ize / this.height
      image.set({
        angle: 0,
        padding: 0,
        cornersize: 10,
        // height: 110,
        // width: 110,
        // opacity            : 0.5,
        borderColor: 'red',
        centeredScaling: true,
        minimumScaleTrigger: 1,
        scaleX: scale,
        scaleY: scale
      });

      canvas.centerObject(image);
      canvas.add(image);
      // console.log(image)
      canvas.renderAll();
    };
  };
  reader.readAsDataURL(e.target.files[0]);

  state.openNav = false;
  // bucketModal.hide();
}

function handleBgImage(e) {
  // 紀錄
  statusSave()

  clearCanvasBackground()

  let reader = new FileReader();
  reader.onload = function (event) {
    let imgObj = new Image();
    imgObj.src = event.target.result;
    imgObj.onload = function () {
      // alert(this.width + 'x' + this.height);
      // let image = new fabric.Image(imgObj);
      // canvas.setBackgroundColor({
      //   source: event.target.result,
      //   repeat: 'no-repeat',
      //   // offsetX: 200,
      //   // offsetY: 100
      // }, canvas.renderAll.bind(canvas));
      let scale = this.width > this.height ? canvas.width / this.width : canvas.height / this.height

      canvas.setBackgroundImage(event.target.result, canvas.renderAll.bind(canvas), {

        // Needed to position backgroundImage at 0/0
        originX: 'left',
        originY: 'top',
        left: (canvas.width / 2) - (this.width * scale / 2),
        top: (canvas.height / 2) - (this.height * scale / 2),
        scaleX: scale,
        scaleY: scale
      });

    };
  };
  reader.readAsDataURL(e.target.files[0]);

  state.openNav = false;
  // bucketModal.hide();
}

// 出問題
function onObjectSelected(e) {
  if (e.selected.length === 1) {
    // 如果是不是選擇文字，隱藏操作
    state.hideOperations = !e.selected[0].text;
  }

  state.selected_obj_class = true
}

// 插入文字
function insertText() {
  // 紀錄
  statusSave()

  let text = new fabric.IText('hello world', {
    left: 100,
    top: 200,
    // underline: true,
    fill: !canvas.backgroundColor && !canvas.backgroundImage ? 'black' : 'white'
  });
  canvas.add(text);
}

function addHandler(e) {
  // 紀錄
  statusSave()

  let styleName = e
  let obj = canvas.getActiveObject()
  let params = []
  switch (styleName) {
    case 'underline':
      params[styleName] = !obj[styleName]
      break
    case 'italic':
      params['fontStyle'] = obj['fontStyle'] === 'normal' ? 'italic' : 'normal'
      break
    case 'center':
    case 'left':
    case 'right':
      params['textAlign'] = styleName
      break
    case 'size':
      params['fontSize'] = e.target.value
      break
    case 'height':
      params['lineHeight'] = e.target.value
      break
  }

  obj.set(params)
  canvas.renderAll()
}

// 刪除物件
function deleteObjects() {
  // 紀錄
  statusSave()

  let activeObject = canvas.getActiveObject(),
    activeGroup = canvas.getActiveObjects();
  if (activeGroup.length === 1) {
    canvas.remove(activeObject);
  } else if (activeGroup.length > 1) {
    activeGroup.forEach(function (object) {
      canvas.remove(object);
    })
  }
}

// 輸出圖片
function output(formatType) {
  const dataURL = canvas.toDataURL({
    format: `image/${formatType}`,
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    multiplier: 1,
    quality: 1
  })
  const a = document.createElement('a')
  a.href = dataURL
  a.download = `your_image.${formatType}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 從 bucket 插入選擇的圖片
function insertImg(selected_img) {
  // 紀錄
  statusSave()

  fabric.Image.fromURL(selected_img.url, function (image) {

    let icon_ize = 200
    let scale = image.width > image.height ? icon_ize / image.width : icon_ize / image.height
    image.set({
      angle: 0,
      padding: 0,
      cornersize: 10,
      // height: 110,
      // width: 110,
      // opacity            : 0.5,
      borderColor: 'red',
      centeredScaling: true,
      minimumScaleTrigger: 1,
      scaleX: scale,
      scaleY: scale
    });

    canvas.centerObject(image);
    canvas.add(image);
    canvas.renderAll();

  }, {
    crossOrigin: 'Anonymous'
  });
}

// clearCanvasBackground
function clearCanvasBackground() {
  // 紀錄
  statusSave()

  canvas.setBackgroundImage(null);
  canvas.setBackgroundColor('');
  canvas.renderAll();
}

// doUndo 
function doUndo() {
  // 取出 undo 最後一筆資料讀取
  let lastJSON = state.undo.pop()
  if (!lastJSON) return alert('沒有上一步了')
  canvas.loadFromJSON(lastJSON)
  // 換成上一步的狀態
  state.redo.push(lastJSON)
}

// doRedo
function doRedo() {
  let lastJSON = state.redo.pop()
  if (!lastJSON) return alert('目前沒有動作可復原')
  canvas.loadFromJSON(lastJSON)
  // 在做下一步時把目前狀態 push 到 undo 陣列
  state.undo.push(lastJSON)
}

// status save
function statusSave() {
  state.undo.push(canvas.toJSON()); // 導出的Json
  state.redo = []
}

// 上移
function bringForward() {
  statusSave()
  canvas.getActiveObject().bringForward();
}

// 下移
function sendBackwards() {
  statusSave()
  canvas.getActiveObject().sendBackwards();
}



// mounted
onMounted(() => {
  // 啟動 canvas
  canvas = new fabric.Canvas(c.value);
  canvas.preserveObjectStacking = true // 禁止選中圖層時自定置於頂部

  // 添加背景圖片
  let imageUrl = '/image/background.png'
  // canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
  //   width: canvas.width,
  //   height: canvas.height,
  //   // Optionally add an opacity lvl to the image
  //   backgroundImageOpacity: 1,
  //   // should the image be resized to fit the container?
  //   backgroundImageStretch: true,
  //   crossOrigin: 'Anonymous',
  //   repeat: 'repeat'
  // });

  canvas.setBackgroundColor({
    source: imageUrl,
    repeat: 'repeat',
    // offsetX: 200,
    // offsetY: 100
  }, canvas.renderAll.bind(canvas));

  // 鐵人賽特效測試，會造成畫面污染問題
  // fabric.util.loadImage('https://www.pakutaso.com/shared/img/thumb/KAZTDSCF2521_TP_V4.jpg', function (img) {
  //   // 新增一個 pattern 物件
  //   const pattern = new fabric.Pattern({
  //     source: img,
  //     repeat: 'repeat',
  //
  //   })
  //   // 將圖片的 fill 屬性設定成某個 pattern
  //   const text = new fabric.Text('鐵人賽\n倒數兩天', {
  //     fontSize  : 100,
  //     fontWeight: 800,
  //     fill      : pattern // 設為 pattern
  //   },)
  //   canvas.add(text)
  // })


  // 監聽 bucketModal
  // bucketModal = new Offcanvas(bucket.value)


  // 文字控制
  // 選擇監測
  canvas.on("selection:created", onObjectSelected);
  // 選擇切換監測
  canvas.on("selection:updated", onObjectSelected);
  // 選擇結束監測
  canvas.on("before:selection:cleared", function () {
    state.selected_obj_class = false
    state.hideOperations = true
  });
  // 監聽畫布的圖層編輯事件
  canvas.on('object:modified', () => {
    statusSave()
  });
});
</script>