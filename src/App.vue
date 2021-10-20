<template>
  <div id="canvas-wrapper" class="editor-area">
    <div class="canvas-bg-wrapper h-100">
      <!--      <img class="canvas-bg" alt="" src="https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkaUlpHVEpDTGhjQzg"/>-->
      <canvas :width="state.width" :height="state.height" ref="c"></canvas>
    </div>
  </div>

  <!-- 操作列 -->
  <div class="base" :class="{ 'close' : state.open}">
   <div class="menu" @click="state.open = !state.open">
      <div class="icon">
         <div class="bar"></div>
      </div>
   </div>
   <div class="icons">
      <font-awesome-icon icon="images"/>
      <font-awesome-icon icon="font"/>
      <font-awesome-icon icon="save"/>
   </div>
   <div class="section">
      <div class="cover1">
         <div class="cover2">
            <a class="content" @click="insertText();state.open = false"></a>
         </div>
      </div>
   </div>
   <a class="section-static top" title="圖庫"
            data-bs-toggle="offcanvas" data-bs-target="#bucketModal" aria-controls="offcanvasBottom"></a>
   <a class="section-static bottom" @click="output('png');state.open = false"></a>
  </div>

  <div class="controls">
    <input type="file" id="imgLoader" @change="handleImage" class="d-none"
           accept=".jpg, .jpeg, .png, .bmp"/>
    <input type="file" id="bgImgLoader" @change="handleBgImage" class="d-none"
           accept=".jpg, .jpeg, .png, .bmp"/>

    <!-- <label for="imgLoader" title="新增"
           class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center">
      <font-awesome-icon icon="plus" size="lg" fixed-width/>
    </label>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="圖庫"
            data-bs-toggle="modal" data-bs-target="#bucketModal">
      <font-awesome-icon icon="images" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="文字" @click="insertText">
      <font-awesome-icon icon="font" size="lg" fixed-width/>
    </button> -->
    
    <!-- <label for="bgImgLoader" title="新增背景"
           class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center">
      <font-awesome-icon icon="plus-square" size="lg" fixed-width/>
    </label> -->
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="移除背景" @click="clearCanvasBackground">
      <font-awesome-icon icon="chess-board" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" :class="{'d-none': !state.selected_obj_class}"
            title="刪除" @click="deleteObjects">
      <font-awesome-icon icon="trash-alt" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" :class="{'d-none': !state.selected_obj_class}"
            title="上移" @click="bringForward">
      <font-awesome-icon icon="caret-square-up" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" :class="{'d-none': !state.selected_obj_class}"
            title="下移" @click="sendBackwards">
      <font-awesome-icon icon="caret-square-down" size="lg" fixed-width/>
    </button>
    <!-- <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="匯出 jpg" @click="output('jpeg')">
      <font-awesome-icon icon="save" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="匯出 png" @click="output('png')">
      <font-awesome-icon icon="save" size="lg" fixed-width/>
    </button> -->
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="返回" @click="doUndo()">
      <font-awesome-icon icon="undo" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="重做" @click="doRedo()">
      <font-awesome-icon icon="redo" size="lg" fixed-width/>
    </button>
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->

  <!-- 控制選項 -->
  <div id="textMenu" class="container-fluid d-flex flex-row justify-content-center"
       :class="{'d-none':state.hideOperations}" ref="textMenu">
    <!-- <div class="row">
      <div class="col-6">
        <input type="range" min="5" max="150" value="40" id="size" class="form-range" @change="addHandler">
      </div>
      <div class="col-6">
        <input type="range" min="0.1" max="5" value="0.1" id="height" class="form-range" @change="addHandler">
      </div>
    </div> -->
    <!-- <div class="row">
      <div class="col-3"><input type="color" id="color" class="form-control form-control-color"
                                v-model="state.control.color"></div>
      <div class="col-3"><input type="color" id="bg-color" class="form-control form-control-color"
                                v-model="state.control.bgColor"></div>
      <div class="col-3">
        <button id="underline" class="btn btn-primary btn-sm" @click="addHandler">底線</button>
      </div>
      <div class="col-3">
        <button id="italic" class="btn btn-primary btn-sm" @click="addHandler">斜體</button>
      </div>
    </div> -->
    <!-- <div class="row">
      <div class="col-4">
        <button id="center" class="btn btn-primary btn-sm" @click="addHandler">文字置中</button>
      </div>
      <div class="col-4">
        <button id="left" class="btn btn-primary btn-sm" @click="addHandler">文字置左</button>
      </div>
      <div class="col-4">
        <button id="right" class="btn btn-primary btn-sm" @click="addHandler">文字置右</button>
      </div>
    </div> -->

    <!-- <div class="row">
      <div class="col-6 d-flex align-items-center">
        <label for="color" class="text-white me-2">文字尺寸</label>
        <input type="range" min="5" max="150" value="40" id="size" class="form-range" @change="addHandler">
      </div>
      <div class="col-6 d-flex align-items-center">
        <label for="bg-color" class="text-white me-2">文字行高</label>
        <input type="range" min="0.1" max="5" value="0.1" id="height" class="form-range" @change="addHandler">
      </div>
    </div> -->
    
    <div class="d-flex flex-wrap justify-content-center" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group m-2 align-items-center" role="group" aria-label="Second group">
        <label for="color" class="text-white me-2">文字顏色</label>
        <input type="color" id="color" class="form-control form-control-color"
              v-model="state.control.color">
      </div>
      <div class="btn-group m-2 align-items-center" role="group" aria-label="Second group">
        <label for="bg-color" class="text-white me-2">背景顏色</label>
            <input type="color" id="bg-color" class="form-control form-control-color"
                v-model="state.control.bgColor">
      </div>
      <div class="btn-group m-2" role="group" aria-label="Second group">
        <button id="italic" class="btn btn-primary btn-sm" @click="addHandler">斜體</button>
        <button id="underline" class="btn btn-primary btn-sm" @click="addHandler">底線</button>
      </div>
      <div class="btn-group m-2" role="group" aria-label="Third group">
        <button id="center" class="btn btn-primary btn-sm" @click="addHandler">置中</button>
        <button id="left" class="btn btn-primary btn-sm" @click="addHandler">置左</button>
        <button id="right" class="btn btn-primary btn-sm" @click="addHandler">置右</button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="offcanvas offcanvas-bottom rounded-3" tabindex="-1" id="bucketModal" aria-labelledby="bucketModalLabel" ref="bucket">
        <div class="offcanvas-header border-bottom">
          <h5 class="offcanvas-title" id="bucketModalLabel">圖庫</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body img_list">
          <ul class="">
            <li class="list-item cursor-pointer" v-for="(item,key) in state.bucket_data" :key="key"
                @click="selected(item)" data-toggle="tooltip"
                :data-original-title="item.title" data-placement="bottom">
              <img :src="item.url" :alt="item.title">
              <span class="selected" v-if="item.selected">
                  <font-awesome-icon icon="check-circle" size="3x" fixed-width/>
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
              <button type="button" class="btn btn-primary" @click="insertImg">置入</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="offcanvas">取消</button>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {fabric} from 'fabric'
import image_lists from './image_url.json'
import {Offcanvas} from 'bootstrap'

export default {
  name      : "App",
  components: {
    // HelloWorld,
  },
  setup() {
    const c = ref(null);
    const bucket = ref(null);
    const dom_textMenu = ref(null);
    let canvas
    let bucketModal
    const state = reactive({
      // width : 260,
      // height: 360
      width         : window.innerWidth,
      height        : window.innerHeight,
      bucket_data   : image_lists.map(item => {
        item.selected = false;
        return item
      }),
      selected_img  : [],
      hideOperations: true,
      control       : {
        color  : '#000000',
        bgColor: '#000000'
      },
      undo: [],
      redo: [],
      selected_obj_class: false,
      open: false
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
            angle     : 0,
            padding   : 0,
            cornersize: 10,
            // height: 110,
            // width: 110,
            // opacity            : 0.5,
            borderColor        : 'red',
            centeredScaling    : true,
            minimumScaleTrigger: 1,
            scaleX             : scale,
            scaleY             : scale
          });

          canvas.centerObject(image);
          canvas.add(image);
          // console.log(image)
          canvas.renderAll();
        };
      };
      reader.readAsDataURL(e.target.files[0]);
      
      state.open = false;
      bucketModal.hide();
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
            left: (canvas.width / 2) - (this.width * scale /2),
            top: (canvas.height / 2) - (this.height * scale /2),
            scaleX             : scale,
            scaleY             : scale
          });

        };
      };
      reader.readAsDataURL(e.target.files[0]);

      state.open = false;
      bucketModal.hide();
    }

    function onObjectSelected(e) {
      state.selected_obj_class = true
      state.hideOperations = e.target.get("type") !== "i-text";
    }


    // 插入文字
    function insertText() {
      // 紀錄
      statusSave()

      let text = new fabric.IText('hello world', {
        left: 100,
        top : 200,
        // underline: true,
        fill: !canvas.backgroundColor && !canvas.backgroundImage ? 'black' : 'white'
      });
      canvas.add(text);
    }

    function addHandler(e) {
      // 紀錄
      statusSave()

      // console.log('styleName',e)
      let styleName = e.target.id
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
          activeGroup  = canvas.getActiveObjects();
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
        format    : `image/${formatType}`,
        top       : 0,
        left      : 0,
        width     : window.innerWidth,
        height    : window.innerHeight,
        multiplier: 1,
        quality   : 1
      })
      const a = document.createElement('a')
      a.href = dataURL
      a.download = `your_image.${formatType}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    // 選擇 bucket 圖片
    function selected(item) {
      if (state.selected_img) {
        state.selected_img.selected = false
      }
      item.selected = true
      state.selected_img = item
      // state.selected_img.selected = true

    }

    // 從 bucket 插入選擇的圖片
    function insertImg() {
      // 紀錄
      statusSave()

      fabric.Image.fromURL(state.selected_img.url, function (image) {

        let icon_ize = 200
        let scale = image.width > image.height ? icon_ize / image.width : icon_ize / image.height
        image.set({
          angle     : 0,
          padding   : 0,
          cornersize: 10,
          // height: 110,
          // width: 110,
          // opacity            : 0.5,
          borderColor        : 'red',
          centeredScaling    : true,
          minimumScaleTrigger: 1,
          scaleX             : scale,
          scaleY             : scale
        });

        canvas.centerObject(image);
        canvas.add(image);
        // console.log(image)
        canvas.renderAll();

        // 處理後續
        state.selected_img.selected = false
        bucketModal.hide();
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
    function doUndo () {
      // 取出 undo 最後一筆資料讀取
      let lastJSON = state.undo.pop()
      if(!lastJSON) return alert('沒有上一步了')
      canvas.loadFromJSON(lastJSON)
      // 換成上一步的狀態
      state.redo.push(lastJSON)
    }

    // doRedo
    function doRedo () {
      let lastJSON = state.redo.pop()
      if(!lastJSON) return alert('目前沒有動作可復原')
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
      bucketModal = new Offcanvas(bucket.value)
      bucket.value.addEventListener('hide.bs.offcanvas', function () {
        // do something...
        state.open = false
        state.selected_img.selected = false
        state.selected_img = []
      })

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

    return {
      c,
      bucket,
      state,
      canvas,
      bucketModal,
      dom_textMenu,

      handleImage,
      handleBgImage,
      insertText,
      deleteObjects,
      output,
      selected,
      insertImg,

      addHandler,
      clearCanvasBackground,
      doUndo,
      doRedo,
      bringForward,
      sendBackwards,
    };
  },
};
</script>

<style lang="css">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  /*background-image: url("https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkaSjRtQThYR1ZTRGs");*/
}

.hideOperations {
  display: none;
}

.displayOperations {
  display: block;
}

.editor-area {
  overflow: hidden;
  /* float: left; */
}

.controls {
  /*overflow: hidden;*/
  position: fixed;
  right: 1.5rem;
  top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-bg-wrapper {
  position: relative;
  /*width: 600px;*/
  /*height: 560px;*/
}

.canvas-bg {
  position: absolute;
}

.canvas-bg-wrapper {
  /*padding: 20px;*/
  /*top: 75px;*/
  /*left: 155px;*/
  /*border-style: solid;*/
  /*border-width: 20px 20px 20px 20px;*/
  /*-moz-border-image: url(https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkabEZhbkJseW5IZWc) 19 22 21 19 round;*/
  /*-webkit-border-image: url(https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkabEZhbkJseW5IZWc) 19 22 21 19 round;*/
  /*-o-border-image: url(https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkabEZhbkJseW5IZWc) 19 22 21 19 round;*/
  /*border-image: url(https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkabEZhbkJseW5IZWc) 19 22 21 19 round;*/
}

#c {
  position: relative;
}

.btn-circle {
  width: 48px;
  height: 48px;
}

.btn-circle + .btn-circle {
  margin-top: 10px;
}

/* Modal Style*/
#bucketModal {
  height: 50%;
  top: unset;
  bottom: 0;
}

.img_list, .img_info {
  height: 500px;
  overflow-y: auto;
  padding: 0 12px;
}

.img_list ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-auto-rows: minmax(50px, auto);
}

.img_list ul .list-item {
  position: relative;
  border: 1px solid #e8ebf1;
  cursor: pointer;
}

.img_list ul .list-item img {
  /*position: absolute;*/
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.img_list ul .list-item .selected {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.6);
}

.img_info p {
  word-break: break-all;
  text-align: justify;
}

.img_info_container {
  padding-bottom: 32px;
}

.img_info_container .image {
  cursor: auto;
}

.img_info_btn {
  position: absolute;
  right: 16px;
  bottom: 0;
}


/* textMenu */
#textMenu {
  position: fixed;
  bottom: 1rem;
  width: 100%;

}

.base {
  z-index: 90;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: #FFFFFF;
  width: 98px;
  height: 98px;
  transition: all 0.5s cubic-bezier(0.5, -0.75, 0.05, 1);
  border-bottom-right-radius: 100%;
}
.base .menu {
  z-index: 100;
  background-color: #FFFFFF;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100px;
  height: 100px;
  border-bottom-right-radius: 200px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.5, -0.75, 0.05, 1), background-color 0.2s ease;
}
.base .menu .icon {
  position: absolute;
  width: 25px;
  height: 25px;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%);
}
.base .menu .icon:before, .base .menu .icon:after {
  content: "";
  transform: rotate(0deg);
  transition: top 0.5s ease 0.5s, transform 0.5s ease, background-color 0.75s ease 0.25s;
}
.base .menu .icon .bar, .base .menu .icon:before, .base .menu .icon:after {
  position: absolute;
  height: 5px;
  left: 0px;
  right: 0px;
  border-radius: 5px;
  background-color: #21264B;
}
.base .menu .icon .bar {
  transition: opacity 0s linear 0.5s, background-color 0.5s ease 0.25s;
  opacity: 1;
  top: 10px;
}
.base .menu .icon:before {
  top: 0px;
}
.base .menu .icon:after {
  top: initial;
  top: 20px;
}
.base .icons {
  z-index: 98;
  position: absolute;
  top: 0px;
  left: 0px;
}
.base .icons > * {
  position: absolute;
  font-size: 40px;
  color: #21264B;
  transition: 0.3s cubic-bezier(0.5, -0.25, 0.05, 1);
}
.base .icons .fa-images {
  top: 35px;
  left: 0px;
  transition-delay: 0.2s;
}
.base .icons .fa-font {
  top: 0px;
  left: 0px;
  color: #fff;
  transition-delay: 0.1s;
}
.base .icons .fa-save {
  top: 0px;
  left: 35px;
}
.base .section {
  z-index: 96;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 0px;
  width: 0px;
  transform-origin: 100% 100%;
  transform: rotate(135deg);
}
.base .section .cover1 {
  transform-origin: 100% 100%;
}
.base .section .cover1,
.base .section .cover1 .cover2,
.base .section .cover1 .cover2 .content {
  position: absolute;
  width: 600px;
  height: 600px;
}
.base .section .cover1,
.base .section .cover1 .cover2 {
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%) rotate(4deg);
  overflow: hidden;
  pointer-events: none;
  transition: transform 0.5s ease-in;
}
.base .section .cover1 .cover2 {
  transform: translate(50%, -50%) rotate(-8deg);
  transform-origin: 0% 100%;
}
.base .section .cover1 .cover2 .content {
  width: 150px;
  height: 150px;
  border-radius: 100%;
  background-color: #EE1B59;
  top: 100%;
  left: 0%;
  transform: translate(-50%, -50%);
  transition: background-color 0s, width 0.5s cubic-bezier(0.5, -0.5, 0.05, 1) 0s, height 0.5s cubic-bezier(0.5, -0.5, 0.05, 1) 0s;
  pointer-events: auto;
}
.base .section-static {
  z-index: 94;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0px;
  left: 0px;
  transform-origin: 0% 0%;
  transition: width 0.5s cubic-bezier(0.5, -0.75, 0.05, 1), height 0.5s cubic-bezier(0.5, -0.75, 0.05, 1);
}
.base .section-static:hover {
  background-color: #EAEAEA;
}
.base .section-static.top {
  transform: rotate(-45deg);
  border-bottom-right-radius: 400px;
}
.base .section-static.bottom {
  transform: rotate(45deg);
  border-bottom-right-radius: 400px;
}
.base.close {
  width: 300px;
  height: 300px;
  transition: all 0.5s cubic-bezier(0.5, 0, 0.05, 1.75);
}
.base.close .menu {
  width: 150px;
  height: 150px;
  transition: all 0.5s cubic-bezier(0.5, 0, 0.05, 1.75), background-color 0.5s ease;
  background-color: #21264B;
}
.base.close .menu .icon .bar, .base.close .menu .icon:before, .base.close .menu .icon:after {
  background-color: #FFFFFF;
}
.base.close .menu .icon .bar {
  opacity: 0;
}
.base.close .menu .icon:before, .base.close .menu .icon:after {
  transition: top 0.5s linear, transform 0.5s ease 0.5s, background-color 0.5s ease 0.25s;
}
.base.close .menu .icon:before {
  top: 10px;
  transform: rotate(-45deg);
}
.base.close .menu .icon:after {
  top: 10px;
  transform: rotate(45deg);
}
.base.close .icons {
  position: absolute;
  top: 0px;
  left: 0px;
}
.base.close .icons > * {
  position: absolute;
  font-size: 40px;
  color: #21264B;
  transition: 0.3s cubic-bezier(0.5, 0, 0.05, 1.75) 0.5s;
  pointer-events: none;
}
.base.close .icons .fa-images {
  top: 35px;
  left: 200px;
}
.base.close .icons .fa-font {
  top: 141px;
  left: 141px;
  color: #fff;
  transition-delay: 0.5s;
}
.base.close .icons .fa-save {
  top: 200px;
  left: 35px;
  transition-delay: 0.5s;
}
.base.close .section .cover1 {
  transform-origin: 100% 100%;
}
.base.close .section .cover1,
.base.close .section .cover1 .cover2,
.base.close .section .cover1 .cover2 .content {
  position: absolute;
  width: 600px;
  height: 600px;
}
.base.close .section .cover1,
.base.close .section .cover1 .cover2 {
  top: 50%;
  left: 50%;
  transform: translate(-100%, -100%) rotate(16deg);
  overflow: hidden;
  transition: transform 0.5s ease-in 0.5s;
}
.base.close .section .cover1 .cover2 {
  transform: translate(50%, -50%) rotate(-32deg);
  transform-origin: 0% 100%;
}
.base.close .section .cover1 .cover2 .content {
  border-radius: 100%;
  background-color: #EE1B59;
  top: 100%;
  left: 0%;
  transform: translate(-50%, -50%);
  transition: background-color 0s, width 0.5s cubic-bezier(0.5, 0, 0.05, 1.75) 0.25s, height 0.5s cubic-bezier(0.5, 0, 0.05, 2) 0.25s;
}
.base.close .section .cover1 .cover2 .content:hover {
  background-color: #DD1350;
}
.base.close .section-static {
  width: 300px;
  height: 300px;
  transition: width 1.25s cubic-bezier(0.5, 0, 0.05, 2), height 0.5s cubic-bezier(0.5, 0, 0.05, 2);
}
</style>
