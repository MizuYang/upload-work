<template>
    <!-- 檔案上傳設定 -->
    <SetUpload @setUpload="setUpload"></SetUpload>

    <!-- 檔案上傳 -->
    <FileUpload :uploadMode="options.uploadMode" :validateSize="options.validateSize" :validateResolution="options.validateResolution" :validateW="options.validateW" :validateH="options.validateH" @upload="upload"></FileUpload>
</template>

<script>
import SetUpload from '@/components/upload/set/SetUpload.vue'
import FileUpload from '@/components/upload/FileUpload.vue'
export default {

  components: {
    SetUpload,
    FileUpload
  },

  data () {
    return {
      options: {}
    }
  },

  methods: {
    setUpload (options) {
      this.options = options
    },
    //* 要給後端的資料
    upload (fileData) {
      console.log(fileData)
    }
  }

}
</script>

<style lang='scss' scope>
.inputSize {
  width: 60px;
}
</style>
