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
      <!-- <uploader-btn :directory="true">選擇資料夾</uploader-btn> -->
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>

  <!-- 上傳回饋 -->
  <div class="my-3">
    <p ref="feedback"></p>
  </div>

  <!-- 圖片預覽 -->
  <PreviewImg :file="file" :imgType="imgType"></PreviewImg>

</template>

<script>
import PreviewImg from '@/components/upload/function/PreviewImg.vue'
import SparkMD5 from 'spark-md5'
import heic2any from 'heic2any'
// import CropImg from '@/components/CropImg.vue' //* 圖片裁切
export default {

  components: {
    PreviewImg
    // CropImg
  },

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
      file: [],
      uploader: null,
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
      // size: 153600
      // width: 150,
      // height: 150

    }
  },

  //! 元件化
  //! 完成其他需求，例：圖片裁切
  //! 確認裁切、恢復裁切
  //! 按確認上傳後取得 file 物件

  // ? 檔案大小上傳熱氣球第二次，不會跳錯

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
            console.log(2)
            const img = new Image()
            img.src = url
            img.onload = () => {
              if (this.validateResolution) {
                if (img.width > this.validateW || img.height > this.validateH) {
                  file.cancel()
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
      // Bus.$emit('fileAdded')
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
    getRandomFileName () {
      let text = ''
      const randomLen = 30
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < randomLen; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }
      return text
    },
    //* 若圖檔為 heic 或 heif 則轉檔為 JPG
    heic2Jpeg (file) {
      return new Promise((resolve, reject) => {
        console.log(file)
        const name = file.name
        heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 1
        }).then((heicToJpgResult) => {
          const url = URL.createObjectURL(heicToJpgResult)
          console.log('heicToJpgResult', heicToJpgResult)

          //* 將 heic 轉成 jepg 檔後傳至 file
          this.file.push(heicToJpgResult)
          const fileLen = this.file.length
          this.file[fileLen - 1].newFileName = this.getRandomFileName()
          this.file[fileLen - 1].url = url
          this.file[fileLen - 1].name = name
          this.file[fileLen - 1].heic = true //* Heic 檔不在 previewImg 處理的依據
          // 后续上传逻辑
          resolve(url)
        })
      })
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
        const fileLen = this.file.length
        this.file[fileLen - 1].newFileName = this.getRandomFileName()
      }

      // const res = JSON.parse(response)
      // // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      // if (!res.result) {
      //   this.$message({ message: res.message, type: 'error' })
      //   // 文件状态设为“失败”
      //   this.statusSet(file.id, 'failed')
      //   return
      // }
      // // 如果服务端返回需要合并
      // if (res.needMerge) {
      //   // 文件状态设为“合并中”
      //   this.statusSet(file.id, 'merging')
      // //   api.mergeSimpleUpload({
      // //     tempName: res.tempName,
      // //     fileName: file.name,
      // //     ...file.params
      // //   }).then(res => {
      // //     // 文件合并成功
      // //     Bus.$emit('fileSuccess')
      // //     this.statusRemove(file.id)
      // //   }).catch(e => {})
      // //   // 不需要合并
      // // } else {
      // //   Bus.$emit('fileSuccess')
      // //   console.log('上传成功')
      // }
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
      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5')
      file.pause()
      loadNext()
      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          // this.$nextTick(() => {
          //   $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          // })
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
      this.statusRemove(file.id)
    },
    fileListShow () {
      // const $list = $('#global-uploader .file-list')
      // if ($list.is(':visible')) {
      //   $list.slideUp()
      //   this.collapse = true
      // } else {
      //   $list.slideDown()
      //   this.collapse = false
      // }
    },
    close () {
      this.uploader.cancel()
      this.panelShow = false
    },
    //* 新增的自定义的状态: 'md5'、'transcoding'、'failed'
    statusSet (id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }
      console.log(statusMap)
      // this.$nextTick(() => {
      //   this.$refs.feedback.textContent = statusMap[status].text
      //   this.$refs.feedback.setAttribute(`'style', 'background-color: ${statusMap[status].bgc}'`)
      //   console.log(this.$refs.feedback)
      // })

      // this.$nextTick(() => {
      //   $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
      //     position: 'absolute',
      //     top: '0',
      //     left: '0',
      //     right: '0',
      //     bottom: '0',
      //     zIndex: '1',
      //     backgroundColor: statusMap[status].bgc
      //   }).text(statusMap[status].text)
      // })
    },
    statusRemove (id) {
      // this.$nextTick(() => {
      //   $(`.myStatus_${id}`).remove()
      // })
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
      // this.clearPreviewImgUrl()
      this.$refs.feedback.textContent = content
      this.$refs.feedback.className = 'fail text-danger fst-italic'
    },
    successFeedback (e) {
      this.status = this.uploadStatus.success
      this.$refs.feedback.textContent = '上傳成功！'
      this.$refs.feedback.className = 'success text-success'
    }
    // getCropUrl (cropUrl, index) {
    //   // console.log(cropUrl)
    //   // console.log(index)
    //   console.log(this.file[0])
    //   this.file[0].url = cropUrl
    //   // this.file.perviewImgUrl = cropUrl
    // },
    // getOriginUrl () {
    //   this.file.perviewImgUrl = this.tempPreviewImgUrl
    // }
  },

  mounted () {
    this.$nextTick(() => {
      // window.uploader = this.uploader.uploader
    })
    setInterval(() => {
      // console.log(this.file)
    }, 2500)
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
