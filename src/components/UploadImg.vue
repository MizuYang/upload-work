<template>
  <label for="file"></label>
  <input type="file" id="file" name="file" @change="getFileInfo" :accept="accept">

  <!-- 進度條 -->
  <div v-if="uploadSuccess" class="my-2">
    <ProgressBar ref="progressBar"></ProgressBar>
  </div>
  <!-- 上傳 成功/失敗 回饋 -->
  <div class="my-3">
    <p ref="uploadResult"></p>
  </div>
  <!-- 檔案預覽 -->
  <div v-if="uploadSuccess" class="my-3">
    <PerviewImg :imgUrl="file.perviewImgUrl" ref="preview"></PerviewImg>
  </div>
  <!-- 裁切模式、裁切尺寸 -->
    <div v-if="uploadSuccess" class="my-5">
      <CropSize @getCropSize="getCropSize" @getCropMode="getCropMode"></CropSize>
    </div>
  <!-- 圖片裁切 -->
  <div v-if="uploadSuccess" class="my-5">
    <div class="my-3">
      <CropImg :imgUrl="file.perviewImgUrl" :cropW="cropSize.width" :cropH="cropSize.height" :fixedSize="fixedSize" @getCropUrl="getCropUrl" @getOriginUrl="getOriginUrl"></CropImg>
    </div>
  </div>

  <div class="my-5">
    <UploaderView></UploaderView>
  </div>

  <div v-if="uploadSuccess" class="my-5">
    <button class="btn btn-primary" type="button" @click="$emit('upload', file)">確認上傳</button>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar.vue' //* 進度條
import PerviewImg from '@/components/PreviewImg.vue' //* 圖片預覽
import CropImg from '@/components/CropImg.vue' //* 圖片裁切
import CropSize from '@/components/CropSize.vue' //* 裁切尺寸設定
import heic2any from 'heic2any' //* 轉檔
import UploaderView from '@/components/UploaderView.vue'
export default {

  components: {
    ProgressBar,
    PerviewImg,
    CropImg,
    CropSize,
    UploaderView
  },

  props: {
    size: {
      type: Number,
      default: 31457280
      // required: true
    },
    type: {
      type: Array,
      default: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif'] // eslint-disable-line
    },
    //* 解析度
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  },

  emits: ['upload'],

  computed: {
    uploadSuccess () {
      return this.status === this.uploadStatus.success
    }
  },

  data () {
    return {
      file: {},
      reader: '',
      imgType: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif', 'heic', 'heif'],
      status: 0,
      uploadStatus: {
        null: 0,
        success: 1,
        fail: 2
      },
      accept: '.jpg, .png, .svg, .gif, .jpeg', //* 上傳時能顯示的檔案類型
      resolutionValidate: false,
      cropSize: {},
      fixedSize: false
    }
  },

  methods: {
    getFileInfo (e) {
      if (!e) { return }
      const file = e.target.files[0]
      const type = file.name.split('.').pop() //* 取得檔案類型
      const size = file.size
      //* 驗證類型、大小，一個驗證失敗就中斷
      const typeValidate = this.checkType(type, file)
      if (!typeValidate) return
      //* 若為圖檔，驗證寬高(解析度)
      if (this.imgType.includes(type)) {
        this.checkResolution(file).then((res) => {
          console.log(res)
          // if (!res) return
        })
        if (type === 'heic' || type === 'heif') {
          this.checkHeicResolution()
        }
      }
      const sizeValidate = this.checkSize(size)
      if (!sizeValidate) return

      Promise.all([typeValidate, sizeValidate])
        .then((res) => {
          console.log(res)
          if (type === 'heic' || type === 'heif') {
            this.heic2Jpeg(file) //* 轉檔
          }
          //* 驗證通過
          this.successFeedback(e)
          this.getProgressBar()
          //* 取得圖片資訊
          const name = file.name.split('.')[0]
          const lastModifiedDate = file.lastModifiedDate.toLocaleString()
          const uploadDate = new Date().toLocaleString()
          const newFileName = this.getNewFileName()
          const perviewImgUrl = this.getPreviewImgUrl(e)
          this.file = { uploadDate, name, newFileName, size, type, lastModifiedDate, perviewImgUrl, file }
          // this.getPreviewImgUrl(e) //* 在這取得 url 才不會上面的file被覆蓋
          console.log(this.file)
        })
    },
    getProgressBar () {
      this.reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          // 計算完成百分比
          const percent = (event.loaded / event.total) * 100
          // 將值設定為進度元件
          const pBarVal = this.$refs.progressBar?.$refs.progress
          const pBarLabel = this.$refs.progressBar?.$refs.progressLabel
          if (pBarVal && pBarLabel) {
            pBarVal.value = percent
            pBarLabel.innerHTML = Math.round(percent) + '%'
          }
        }
      })
    },
    getNewFileName () {
      const random = `${Math.random()}${Math.random()}`
      const name = random.split('.')
      name.shift()
      const newFileName = name.join('').slice(0, 30) //* 取30位隨機碼
      return newFileName
    },
    getCropSize (cropSize) {
      this.cropSize.width = cropSize.width
      this.cropSize.height = cropSize.height
    },
    getCropMode (cropType) {
      if (cropType === '自由裁切') {
        this.fixedSize = false
      } else if (cropType === '限制裁切寬高') {
        this.fixedSize = true
      }
    },
    getPreviewImgUrl (e) {
      const file = e.target.files[0]
      const perviewImgUrl = URL.createObjectURL(file)
      // this.file.perviewImgUrl = url
      return perviewImgUrl
    },
    getCropUrl (cropUrl) {
      this.file.perviewImgUrl = cropUrl
    },
    getOriginUrl (originUrl) {
      this.file.perviewImgUrl = originUrl
    },
    clearPreviewImgUrl () {
      this.file.perviewImgUrl = ''
    },
    //* 若圖檔為 heic 或 heif 則轉檔為 JPG
    heic2Jpeg (file) {
      heic2any({
        blob: file, //* 将heic转换成一个buffer数组的图片
        toType: 'image/jpeg', //* 要转化成具体的图片格式，可以是png/gif
        quality: 1 //* 图片的质量，参数在0-1之间
      }).then((heicToJpgResult) => {
        // 后续上传逻辑
        this.file.perviewImgUrl = URL.createObjectURL(heicToJpgResult)
      })
    },
    //* 檢查圖片解析度
    checkResolution (file) {
      return new Promise((resolve, reject) => {
        this.resolutionValidate = false
        this.reader.onload = (e) => {
          const data = e.target.result //* 取得 Base64
          // 加载图片获取图片真实宽度和高度
          const image = new Image()
          image.onload = () => {
            const width = image.width
            const height = image.height
            const result = width < this.width && height < this.height
            if (!result) {
              this.failFeedback(`圖片寬高須低於${this.width}*${this.height}！`)
              this.resolutionValidate = false
              resolve(false)
            } else if (result) {
              this.resolutionValidate = true
              resolve(true)
            }
          }
          if (this.resolutionValidate) { return } //* 驗證失敗中斷程式碼
          image.src = data
        }
        this.reader.readAsDataURL(file)
      })
    },
    //* 檢查 Heic 檔的解析度
    checkHeicResolution () {
      setTimeout(() => {
        const width = this.$refs.preview.$refs.previewImg.naturalWidth
        const height = this.$refs.preview.$refs.previewImg.naturalHeight
        const result = width < this.width && height < this.height
        if (!result) {
          this.failFeedback(`圖片寬高須低於${this.width}*${this.height}！`)
          this.resolutionValidate = false
        } else if (result) {
          this.resolutionValidate = true
        }
      }, 500)
    },
    checkType (type, file) {
      const result = this.type.includes(type)
      if (!result) {
        this.failFeedback(`請上傳 ${this.type} 的檔案，您上傳的是 ${type}檔`)
        return false
      } else if (result) {
        // if (type === 'heic' || type === 'heif') {
        //   this.heic2Jpeg(file)
        // }
        return true
      }
    },
    checkSize (size) {
      const result = size < this.size //* 檔案符合大小
      if (!result) {
        const validateMB = (this.size / 1024 / 1024).toFixed(1)
        const sizeMB = (size / 1024 / 1024).toFixed(1)
        this.failFeedback(`檔案大小不得高於 ${validateMB}MB！您的檔案大小為 ${sizeMB} MB`)
        return false
      } else if (result) {
        return true
      }
    },
    //* 上傳回饋
    failFeedback (content) {
      this.status = this.uploadStatus.fail
      this.clearPreviewImgUrl()
      this.$refs.uploadResult.textContent = content
      this.$refs.uploadResult.className = 'fail text-danger fst-italic'
    },
    successFeedback (e) {
      this.status = this.uploadStatus.success
      this.$refs.uploadResult.textContent = '上傳成功！'
      this.$refs.uploadResult.className = 'success text-success'
    }
  },
  mounted () {
    this.reader = new FileReader()
  }

}
</script>

<style lang='scss' scope>
.fail::before {
  content: '';
  border: 7px solid red;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.success::before {
  content: '';
  border: 7px solid green;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>
