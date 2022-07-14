<template>
  <label for="file"></label>
  <input type="file" id="file " name="file" @change="getFileInfo">

  <p ref="uploadResult"></p>
</template>

<script>
export default {

  data () {
    return {
      file: {},
      size: 31457280, //* 30MB
      // size: 166500, //* 測試大小用
      type: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif']
    }
  },

  methods: {
    getFileInfo (e) {
      const file = e.target.files[0]
      console.log(file)
      const type = file.name.split('.').pop() //* 取得檔案類型
      const size = file.size
      //* 驗證圖片類型、大小，其中一個驗證失敗就中斷
      const typeValidate = this.checkType(type)
      if (!typeValidate) return
      const sizeValidate = this.checkSize(size)
      if (!sizeValidate) return

      const name = file.name.split('.')[0]
      const lastModifiedDate = file.lastModifiedDate.toLocaleString()
      const uploadDate = new Date().toLocaleString()
      this.file = { uploadDate, name, size, type, lastModifiedDate }
    },
    checkType (type) {
      const result = this.type.includes(type)
      if (!result) {
        this.failFeedback('請上傳正確的檔案類型！')
        return false
      } else if (result) {
        this.successFeedback()
        return true
      }
    },
    checkSize (size) {
      const result = size < this.size //* 檔案符合大小
      if (!result) {
        this.failFeedback('檔案大小不得高於 30MB！')
        return false
      } else if (result) {
        this.successFeedback()
        return true
      }
    },
    failFeedback (content) {
      this.$refs.uploadResult.textContent = content
      this.$refs.uploadResult.className = 'fail text-danger fst-italic'
    },
    successFeedback () {
      this.$refs.uploadResult.textContent = '上傳成功！'
      this.$refs.uploadResult.className = 'success text-success'
    }
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
