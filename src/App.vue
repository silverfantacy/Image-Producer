<template>
  <div id="canvas-wrapper" class="editor-area">
    <div class="canvas-bg-wrapper h-100">
      <!--      <img class="canvas-bg" alt="" src="https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkaUlpHVEpDTGhjQzg"/>-->
      <canvas :width="state.width" :height="state.height" ref="c"></canvas>
    </div>
  </div>

  <div class="controls">
    <input type="file" id="imgLoader" @change="handleImage" class="d-none"/>

    <label for="imgLoader" title="新增"
           class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center">
      <font-awesome-icon icon="plus" size="lg" fixed-width/>
    </label>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="圖庫"
            data-bs-toggle="modal" data-bs-target="#bucketModal">
      <font-awesome-icon icon="images" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="刪除" @click="deleteObjects">
      <font-awesome-icon icon="trash-alt" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="匯出 jpg" @click="output('jpeg')">
      <font-awesome-icon icon="save" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center"
            title="匯出 png" @click="output('png')">
      <font-awesome-icon icon="save" size="lg" fixed-width/>
    </button>
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->

  <!-- Modal -->
  <div class="modal fade" id="bucketModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="bucketModalLabel" aria-hidden="true" ref="bucket">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bucketModalLabel">圖庫</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body img_list">
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
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="insertImg">置入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import {onMounted, reactive, ref} from "vue";
import {fabric} from 'fabric'
import image_lists from './image_url.json'
import {Modal} from 'bootstrap'

export default {
  name      : "App",
  components: {
    // HelloWorld,
  },
  setup() {
    const c = ref(null);
    const bucket = ref(null);
    let canvas
    let bucketModal
    const state = reactive({
      // width : 260,
      // height: 360
      width       : window.innerWidth,
      height      : window.innerHeight,
      bucket_data : image_lists.map(item => {
        item.selected = false;
        return item
      }),
      selected_img: [],
    })

    function deleteObjects() {
      let activeObject = canvas.getActiveObject(),
          activeGroup  = canvas.getActiveObjects();
      if (activeGroup.length === 1) {
        if (
            confirm(
                "確定要刪除圖片嗎？"
            )
        ) {
          canvas.remove(activeObject);
        }
      } else if (activeGroup.length > 1) {
        if (
            confirm(
                "確定要刪除選取的圖片嗎？"
            )
        ) {
          activeGroup.forEach(function (object) {
            canvas.remove(object);
          });
        }
      }
    }

    //upload image

    function handleImage(e) {
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
    }

    // function onObjectSelected(e) {
    //   if (e.target.get("type") === "i-text") {
    //     document.getElementById("textMenu").className = "displayOperations";
    //   } else {
    //     // do nothing.
    //   }
    // }

    // canvas.on("object:selected", onObjectSelected);

    // canvas.on("before:selection:cleared", function () {
    //   document.getElementById("textMenu").className = "hideOperations";
    // });

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

    function selected(item) {
      if (state.selected_img) {
        state.selected_img.selected = false
      }
      item.selected = true
      state.selected_img = item
      // state.selected_img.selected = true

    }

    function insertImg() {
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

    // mounted
    onMounted(() => {
      // 啟動 canvas
      canvas = new fabric.Canvas(c.value);

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
      bucketModal = new Modal(bucket.value)
      bucket.value.addEventListener('hide.bs.modal', function () {
        // do something...
        state.selected_img.selected = false
        state.selected_img = []
      })
    });

    return {
      c,
      bucket,
      state,
      canvas,
      bucketModal,
      deleteObjects,
      handleImage,
      output,
      selected,
      insertImg
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
  background-image: url("https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkaSjRtQThYR1ZTRGs");
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
  width: 100px;
  /*overflow: hidden;*/
  position: fixed;
  right: 10px;
  top: 10px;
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

</style>
