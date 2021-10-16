<template>
  <div id="canvas-wrapper" class="editor-area">
    <div class="canvas-bg-wrapper h-100">
<!--      <img class="canvas-bg" alt="" src="https://drive.google.com/uc?export=view&id=0B3ubyt3iIvkaUlpHVEpDTGhjQzg"/>-->
      <canvas :width="state.width" :height="state.height" ref="c"></canvas>
    </div>
  </div>

  <div class="controls">
    <input type="file" id="imgLoader" @change="handleImage" class="d-none"/>

    <label for="imgLoader" title="新增" class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center">
      <font-awesome-icon icon="plus" size="lg" fixed-width/>
    </label>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" title="圖庫"
            data-bs-toggle="modal" data-bs-target="#bucketModal">
      <font-awesome-icon icon="images" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" title="刪除" @click="deleteObjects">
      <font-awesome-icon icon="trash-alt" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" title="匯出 jpg" @click="output('jpeg')">
      <font-awesome-icon icon="save" size="lg" fixed-width/>
    </button>
    <button class="btn btn-primary rounded-circle btn-circle d-flex justify-content-center align-items-center" title="匯出 png" @click="output('png')">
      <font-awesome-icon icon="save" size="lg" fixed-width/>
    </button>
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->

    <!-- Modal -->
    <div class="modal fade" id="bucketModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="bucketModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Understood</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import {onMounted, reactive, ref} from "vue";
import {fabric} from 'fabric'

export default {
  name      : "App",
  components: {
    // HelloWorld,
  },
  setup() {
    const c = ref(null);
    let canvas
    const state = reactive({
      // width : 260,
      // height: 360
      width : window.innerWidth,
      height: window.innerHeight
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
          var image = new fabric.Image(imgObj);
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

    function output (formatType) {
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

    // mounted
    onMounted(() => {
      // 啟動 canvas
      canvas = new fabric.Canvas(c.value);
      // fabric.util.loadImage('https://www.pakutaso.com/shared/img/thumb/KAZTDSCF2521_TP_V4.jpg', function (img) {
      //   // 新增一個 pattern 物件
      //   const pattern = new fabric.Pattern({
      //     source: img,
      //     repeat: 'repeat'
      //   })
      //   // 將圖片的 fill 屬性設定成某個 pattern
      //   const text = new fabric.Text('鐵人賽\n倒數兩天', {
      //     fontSize: 100,
      //     fontWeight: 800,
      //     fill: pattern // 設為 pattern
      //   })
      //   canvas.add(text)
      // })

      // 檔案列表
      // const testFolder = './img/';
      // const fs = require('fs');
      //
      // fs.readdirSync(testFolder).forEach(file => {
      //   console.log(file);
      // });
    });

    return {
      c,
      state,
      canvas,
      deleteObjects,
      handleImage,
      output
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

</style>
