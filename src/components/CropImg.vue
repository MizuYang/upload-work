<template>
    <input type="button" @click="cropShow = !cropShow" :value="cropShow ? '關閉裁切': '開啟裁切'" class="btn btn-primary">
    <div v-if="cropShow" class="row height my-3">
      <div class="col-5">
        <h4>裁切前</h4>
        <VueCropper
          ref="cropper"
          :img="imgUrl"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          mode="contain"
          :max-img-size="option.max"
          @crop-moving="cropMoving"
          @img-load="imgLoad"
          @realTime="realTime"
        >
        </VueCropper>
      </div>
      <div class="col-2 my-auto">
        <button class="btn btn-primary" type="button" @click="getCropImgUrl">裁切</button>
      </div>
      <div class="col-5 m-auto">
        <h4>裁切後</h4>
        <img v-if="cropImgUrl" :src="cropImgUrl" alt="裁切後的圖片">
      </div>
    </div>

</template>

<script>
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
export default {
  components: {
    VueCropper
  },

  props: {
    imgUrl: {
      type: String
    },
    cropW: {
      type: Number,
      default: 160
    },
    cropH: {
      type: Number,
      default: 150
    },
    fixedSize: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    cropW () {
      this.option.autoCropWidth = this.cropW
    },
    cropH () {
      this.option.autoCropHeight = this.cropH
    },
    fixedSize () {
      this.option.fixedBox = this.fixedSize
    }
  },

  data () {
    return {
      option: {
        // img: 'https://avatars2.githubusercontent.com/u/15681693?s=460&v=4',
        size: 1,
        full: false, //* 是否输出原图比例的截图
        outputType: 'jpg', //* 裁剪生成图片的格式
        canMove: false, //* 圖片拖動
        fixedBox: this.fixedSize, //* 改變截圖框大小
        original: false, //* 上传图片按照原始比例渲染
        canMoveBox: true, //* 截圖框可否拖動
        autoCrop: true, //* 截圖框顯示
        //* 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.cropW, //* 默認生成的寬
        autoCropHeight: this.cropH, //* 默認生成的高
        centerBox: true, //* 截圖框是否被限制在圖片裡面
        high: true,
        max: 99999,
        fixed: false //* 截圖框等比例縮放
        // fixedNumber: [1, 1] //* 截图框的宽高比例
      },
      cropImgUrl: '',
      cropShow: false
    }
  },

  methods: {
    //* 取得裁切圖片
    getCropImgUrl () {
      this.$nextTick(() => {
        this.$refs.cropper.getCropData(cropImgUrl => {
          this.cropImgUrl = cropImgUrl
        })
      })
    }
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope>
.height {
  height: 300px;
}
</style>
