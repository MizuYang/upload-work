<template>
  <uploader :options="options" class="uploader-example" :autoStart="true" ref="uploader"
    @file-added="onFileAdded"
    @file-success="onFileSuccess"
    @file-progress="onFileProgress"
    @file-error="onFileError">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>將文件拖放到此處以上傳</p>
      <uploader-btn>選擇檔案</uploader-btn>
      <uploader-btn :attrs="attrs" ref="img">選擇圖片</uploader-btn>
      <uploader-btn :directory="true">選擇資料夾</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>

  <!-- <img :src="previewImg" alt=""> -->
</template>

<script>
import SparkMD5 from 'spark-md5'
import heic2any from 'heic2any'
export default {

  computed: {
    // Uploader实例
    // uploader () {
    //   return this.$refs.uploader.uploader
    // }
  },

  data () {
    return {
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
      //* 驗證條件
      imgType: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif', 'heic', 'heif'],
      size: 153600,
      // previewImg: '',
      width: 150,
      height: 150

    }
  },

  methods: {
    async onFileAdded (file) {
      console.log(file)
      //* 檢查格式
      const type = file.name.split('.').pop()
      if (!this.imgType.includes(type)) {
        const err = `請上傳正確的圖片格式！您上傳的是${type}檔`
        file.cancel()
        throw err
      }
      //* 檢查大小
      const size = file.size
      if (size > this.size) {
        const err = `請上傳低於 ${this.size / 1024} Kb 的圖片`
        file.cancel()
        throw (err)
      }
      console.log(1)

      //* 驗證寬高
      if (type === 'heic' || type === 'heif') {
        //* heic 先轉檔才取的到寬高，所以另外在這處理
        await this.heic2Jpeg(file.file).then(url => {
          console.log(2)
          const img = new Image()
          img.src = url
          img.onload = () => {
            if (img.width > this.width || img.height > this.height) {
              file.cancel()
              const err = `請上傳 ${this.width}*${this.height} 的圖片，您上傳的是${img.width}*${img.height}`
              throw err
            }
          }
        })
      } else {
        await this.getImgSize(file)
          .then(img => {
            console.log(2)
            if (img.width > this.width || img.height > this.height) {
              const err = `請上傳 ${this.width}*${this.height} 的圖片，您上傳的是${img.width}*${img.height}`
              file.cancel()
              throw err
            }
          })
      }

      console.log(3)

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

    //* 若圖檔為 heic 或 heif 則轉檔為 JPG
    heic2Jpeg (file) {
      return new Promise((resolve, reject) => {
        heic2any({
          blob: file, //* 将heic转换成一个buffer数组的图片
          toType: 'image/jpeg', //* 要转化成具体的图片格式，可以是png/gif
          quality: 1 //* 图片的质量，参数在0-1之间
        }).then((heicToJpgResult) => {
          console.log('heicToJpgResult', heicToJpgResult)
          console.log(this)
          // 后续上传逻辑
          const url = URL.createObjectURL(heicToJpgResult) //* 取得網址
          resolve(url)
        })
      })
    },

    onFileProgress (rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess (rootFile, file, response, chunk) {
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
    /**
             * 计算md5，实现断点续传及秒传
             * @param file
             */
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
    /**
             * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
             * @param id
             * @param status
             */
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
      console.log('id:', id)
      console.log('status:', status)

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
    }
  },

  mounted () {
    // const uploader = this.$refs.uploader
    // console.log(uploader)
    this.$nextTick(() => {
      // window.uploader = this.uploader.uploader
    })
    // setInterval(() => {
    // }, 3500)
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
