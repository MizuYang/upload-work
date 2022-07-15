<template>
  <label for="file"></label>
  <input type="file" id="file" name="file" @change="getFileInfo">
  <div class="my-3" v-show="progressBarShow === 1">
    <ProgressBar ref="progressBar"></ProgressBar>
  </div>
  <div class="my-3">
    <p ref="uploadResult"></p>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar.vue'
export default {
  components: {
    ProgressBar
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

  data () {
    return {
      file: {},
      reader: '',
      imgType: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif'],
      progressBarShow: 0,
      uploadStatus: {
        null: 0,
        success: 1,
        fail: 2
      },
      resolutionValidate: false
    }
  },

  methods: {
    getFileInfo (e) {
      const file = e.target.files[0]
      const type = file.name.split('.').pop() //* 取得檔案類型
      const size = file.size
      //* 驗證類型、大小，一個驗證失敗就中斷
      const typeValidate = this.checkType(type)
      if (!typeValidate) return
      //* 若為圖檔，驗證寬高(解析度)
      if (this.imgType.includes(type)) {
        // const resolutionValidate = this.checkType(type)
        // if (!resolutionValidate) return
        this.checkResolution(file)
      }
      const sizeValidate = this.checkSize(size)
      if (!sizeValidate) return
      //* 驗證通過、取得圖片資訊
      this.successFeedback()
      this.getProgressBar()
      const name = file.name.split('.')[0]
      const lastModifiedDate = file.lastModifiedDate.toLocaleString()
      const uploadDate = new Date().toLocaleString()
      this.file = { uploadDate, name, size, type, lastModifiedDate }
    },
    getProgressBar () {
      this.reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          // 計算完成百分比
          const percent = (event.loaded / event.total) * 100
          // 將值設定為進度元件
          const pBarVal = this.$refs.progressBar.$refs.progress
          const pBarLabel = this.$refs.progressBar.$refs.progressLabel
          pBarVal.value = percent
          pBarLabel.innerHTML = Math.round(percent) + '%'
        }
      })
    },
    //* 檢查圖片解析度
    checkResolution (file) {
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
          } else if (result) {
            this.resolutionValidate = true
          }
        }
        if (!this.resolutionValidate) return
        image.src = data
      }
      this.reader.readAsDataURL(file)
    },
    checkType (type) {
      const result = this.type.includes(type)
      if (!result) {
        this.failFeedback(`請上傳 ${this.type} 的檔案，您上傳的是 ${type}檔`)
        return false
      } else if (result) {
        // this.successFeedback()
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
        // this.successFeedback()
        return true
      }
    },
    //* 上傳回饋
    failFeedback (content) {
      this.progressBarShow = this.uploadStatus.fail
      this.$refs.uploadResult.textContent = content
      this.$refs.uploadResult.className = 'fail text-danger fst-italic'
    },
    successFeedback () {
      this.progressBarShow = this.uploadStatus.success
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
