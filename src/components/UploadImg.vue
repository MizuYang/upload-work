<template>
  <label for="file"></label>
  <input type="file" id="file " name="file" @change="getFileInfo">

  <p ref="uploadResult"></p>
</template>

<script>

export default {
  components: {
  },

  data () {
    return {
      file: {},
      type: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif']
    }
  },

  watch: {
  },

  methods: {
    getFileInfo (e) {
      const file = e.target.files[0]
      console.log(file)
      const type = file.name.split('.').pop() //* 從檔名最後面來取得檔案類型
      const size = file.size
      //* 驗證圖片類型、大小，合格才繼續執行
      // this.checkFile(file)
      const typeValidate = this.checkType(type)
      const sizeValidate = this.checkSize(size)
      if (!typeValidate && !sizeValidate) return //* 其中一個驗證失敗就中斷
      const name = file.name.split('.')[0]
      const lastModifiedDate = file.lastModifiedDate.toLocaleString()
      const uploadDate = new Date().toLocaleString()
      this.file = { uploadDate, name, size, type, lastModifiedDate }
      console.log('gg')
    },
    // checkFile (file) {
    // this.checkType(file)
    // this.checkSize(file)
    // },
    checkType (type) {
    },
    checkSize (size) {
    }

  },

  mounted () {
  }

}
</script>

<style lang='scss' scope>
</style>
