<template>
    <!-- 檔案上傳設定 -->
    <SetUpload @setUpload="setUpload"></SetUpload>

    <!-- 檔案上傳 -->
    <FileUpload :uploadMode="options.uploadMode" :validateSize="options.validateSize" :validateResolution="options.validateResolution" :validateW="options.validateW" :validateH="options.validateH" @getFormData="getFormData"></FileUpload>
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
    // formData  fileData
    //* 要給後端的資料
    getFormData (obj) {
      console.log(obj)
      // const fd = new FormData()
      // for (const i in obj) {
      //   this.addendFormData(obj[i], fd, i)
      // }
      // console.log(obj)
    },
    appendFromData (data, formData, key) {
      if ((typeof data === 'object' && data !== null && !(data instanceof File)) || Array.isArray(data)) {
        for (const i in data) {
          if ((typeof data[i] === 'object' && data[i] !== null) || Array.isArray(data[i])) {
            this.objectToFormData(data[i], formData, key + '[' + i + ']')
          } else {
            formData.append(key + '[' + i + ']', data[i])
          }
        }
      } else {
        formData.append(key, data)
      }
    }
  }

}
</script>

<style lang='scss' scope>
.inputSize {
  width: 60px;
}
</style>
