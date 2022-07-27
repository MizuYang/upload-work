<template>
  <uploader :options="options" class="uploader-example" :autoStart="true" ref="uploader"
    @file-added="onFileAdded"
    @file-success="onFileSuccess"
    @file-progress="onFileProgress"
    @file-error="onFileError">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>將文件拖放到此處以上傳</p>
      <uploader-btn v-if="uploadMode==='一般檔案'">選擇檔案</uploader-btn>
      <uploader-btn v-if="uploadMode==='圖片'" :attrs="attrs">選擇圖片</uploader-btn>
      <uploader-btn :directory="true">選擇資料夾</uploader-btn>
    </uploader-drop>
    <uploader-list ref="uploaderList"></uploader-list>
  </uploader>

  <!-- 上傳回饋 -->
  <div class="my-3">
    <p ref="feedback"></p>
  </div>

  <!-- 圖片預覽 -->
  <PreviewImg :file="file" :imgType="imgType"></PreviewImg>

  <!-- 確定上傳 -->
  <div class="text-center my-2" v-if="Object.keys(file).length > 0">
    <button type="button" class="btn btn-primary" @click="$emit('getFormData', file)">確定上傳</button>
  </div>
</template>

<script>
import PreviewImg from '@/components/upload/function/PreviewImg.vue'
import SparkMD5 from 'spark-md5'
import heic2any from 'heic2any'
export default {

  components: {
    PreviewImg
  },

  emits: ['getFormData'],

  props: {
    //* 上傳模式
    uploadMode: {
      type: String,
      required: true
    },
    //* 檔案大小
    validateSize: {
      type: Number
    },
    //* 解析度
    validateResolution: {
      type: Boolean
    },
    validateW: {
      type: Number
    },
    validateH: {
      type: Number
    }
  },

  data () {
    return {
      file: [], //* 給後端的 file
      // uploader: null,
      options: {
        // target: '//localhost:3000/upload', // '//jsonplaceholder.typicode.com/posts/',
        target: '/', // 測試上傳
        testChunks: true,
        chunkSize: '2048000', // 切塊大小
        maxChunkRetries: 3 // 最大自动失败重试上传次数
      },
      attrs: {
        accept: 'image/*'
      },
      statusText: {
        success: '成功了',
        error: '出錯了',
        uploading: '上傳中',
        paused: '暫停中',
        waiting: '等待中'
      },
      uploadStatus: {
        null: 0,
        success: 1,
        fail: 2
      },
      //* 驗證條件
      imgType: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif', 'heic', 'heif']
    }
  },

  methods: {
    async onFileAdded (file) {
      const type = file.name.split('.').pop()
      //* 若選圖片上傳 > 檢查檔案格式
      if (this.uploadMode === '圖片') {
        if (!this.imgType.includes(type)) {
          file.cancel()
          const err = `請上傳正確的圖片格式！您上傳的是${type}檔`
          this.failFeedback(err)
          throw err
        }
      }
      //* 檢查檔案大小
      const size = file.size
      if (size > this.validateSize) {
        file.cancel()
        const err = `請上傳低於 ${this.validateSize / 1024} Kb 的檔案`
        this.failFeedback(err)
        throw (err)
      }
      //* 若 圖片模式+限制圖片寬高 > 檢查檢析度
      if (this.uploadMode === '圖片') {
        if (type === 'heic' || type === 'heif') {
        //* heic 先轉檔才取的到寬高，所以另外在這處理
          await this.heic2Jpeg(file.file).then(url => {
            const img = new Image()
            img.src = url
            img.onload = () => {
              if (this.validateResolution) {
                if (img.width > this.validateW || img.height > this.validateH) {
                  file.cancel()
                  this.removeValidateFailFile(file)
                  const err = `請上傳 ${this.validateW}*${this.validateH} 的圖片，您上傳的是${img.width}*${img.height}`
                  this.failFeedback(err)
                  throw err
                }
              }
            }
          })
        } else {
          await this.getImgSize(file)
            .then(img => {
              if (this.validateResolution) {
                if (img.width > this.validateW || img.height > this.validateH) {
                  file.cancel()
                  this.removeValidateFailFile(file)
                  const err = `請上傳 ${this.validateW}*${this.validateH} 的圖片，您上傳的是${img.width}*${img.height}`
                  this.failFeedback(err)
                  throw err
                }
              }
            })
        }
      }

      //* 驗證成功
      this.successFeedback()
      this.panelShow = true
      this.computeMD5(file)
      file.params = this.params
    },
    getImgSize (file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file.file)
        const img = new Image()
        img.src = url
        img.onload = function () {
          const imgResolution = {}
          imgResolution.height = img.naturalWidth
          imgResolution.width = img.naturalHeight
          resolve(imgResolution)
        }
      })
    },
    // getRandomFileName () {
    //   let text = ''
    //   const randomLen = 30
    //   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    //   for (let i = 0; i < randomLen; i++) {
    //     text += possible.charAt(Math.floor(Math.random() * possible.length))
    //   }
    //   return text
    // },

    //* 若圖檔為 heic 或 heif 則轉檔為 JPG
    heic2Jpeg (file) {
      return new Promise((resolve, reject) => {
        const name = file.name
        heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 1
        }).then((heicToJpgResult) => {
          const url = URL.createObjectURL(heicToJpgResult)
          //* 取出上傳區 Heic 檔的物件，再加上我們自行取得的圖片Url
          const obj = this.$refs.uploaderList.fileList.filter(files => {
            return files.name === file.name
          })
          const newObj = obj[0]
          newObj.heic = true //* Heic 檔不在 previewImg 處理的依據
          newObj.newFileName = newObj.uniqueIdentifier
          newObj.url = url
          newObj.name = name
          newObj.heic2Jpeg = heicToJpgResult

          //* 將 heic 轉成 jepg 檔後傳至 file
          this.file.push(newObj)

          resolve(url)
        })
      })
    },
    //* 移除驗證失敗的檔案
    removeValidateFailFile (file) {
      const fileName = file.name
      const removeFileIndex = this.file.findIndex(file => {
        return file.name === fileName
      })
      this.file.splice(removeFileIndex, 1)
    },
    onFileProgress (rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess (rootFile, file, response, chunk) {
      const isHeic = 'heic'
      //* heic 會在 heic2Jpeg 傳到 file，而不會在這上傳
      //* (因轉檔關係，轉檔後的檔案無法透過套件自動上傳)
      if (file.name.includes(isHeic)) return

      //* 如果沒被中斷上傳，才丟到 file
      if (!file.aborted) {
        this.file.push(file)
        // const fileLen = this.file.length
        // this.file[fileLen - 1].newFileName = this.getRandomFileName() //* 30碼名字
      }
    },
    onFileError (rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: 'error'
      })
    },
    //* 计算md5，实现断点续传及秒传
    computeMD5 (file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      file.pause()
      loadNext()
      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }
      function loadNext () {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success (md5, file) {
      file.uniqueIdentifier = md5
      file.resume()
    },
    close () {
      this.uploader.cancel()
      this.panelShow = false
    },
    error (msg) {
      this.$notify({
        title: '错误',
        message: msg,
        type: 'error',
        duration: 2000
      })
    },
    //* 上傳回饋
    failFeedback (content) {
      this.status = this.uploadStatus.fail
      this.$refs.feedback.textContent = content
      this.$refs.feedback.className = 'fail text-danger fst-italic'
    },
    successFeedback (e) {
      this.status = this.uploadStatus.success
      this.$refs.feedback.textContent = '上傳成功！'
      this.$refs.feedback.className = 'success text-success'
    }
  }

}
</script>

<style>
  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
