<template>
    <!-- 檔案上傳設定 -->
    <!-- <div v-if="!setup.setFinish"> -->
    <SetUpload @setUpload="setUpload"></SetUpload>
    <!-- </div> -->

    <!-- 檔案上傳 -->
    <div v-if="setup.setFinish">
      <FileUpload :setup="setup" @getFormData="getFormData"></FileUpload>
    </div>

</template>

<script>
import SetUpload from '@/components/upload/set/SetUpload.vue'
import FileUpload from '@/components/upload/FileUpload.vue'
export default {

  // ! 檔案大小 上傳驗證失敗檔案第二次，不會跳錯

  components: {
    SetUpload,
    FileUpload
  },

  data () {
    return {
      setup: {}
    }
  },

  methods: {
    setUpload (setup) {
      this.setup = setup
    },
    //* 要給後端的資料
    getFormData (files) {
      console.log(files)

      const formData = new FormData()
      files.forEach((file, index) => formData.append(`file${index + 1}`, file))

      // //* 若要查看 formData
      const object = {}
      formData.forEach((value, key) => {
        object[key] = value
      })
      console.log(object)
      // #region //* axios
      //   this.$http.post(apiUrl, formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }).then((response) => {
      //       console.log(response);
      //   }).catch((error) => {
      //       console.log(error);
      //   })
      //     }
      // #endregion

      // #region //? formData
      // getFormData (obj) {
      //   // console.log(obj)
      //   const formData = new FormData()
      //   for (const i in obj) {
      //     this.appendFromData(obj[i], formData, i)
      //   }
      // },
      // appendFromData (data, formData, key) {
      //   // console.error('data', data)
      //   // console.error('formData', formData)
      //   // console.error('key', key)
      //   if ((typeof data === 'object' && data !== null && !(data instanceof File)) || Array.isArray(data)) {
      //     for (const i in data) {
      //       if ((typeof data[i] === 'object' && data[i] !== null) || Array.isArray(data[i])) {
      //         // this.objectToFormData(data[i], formData, key + '[' + i + ']')
      //         // console.error(data[i], formData, key + '[' + i + ']')
      //         console.log('data[i]', data[i])

    //         setTimeout(() => {
    //           console.error('formData', formData)
    //         }, 2500)
    //         setTimeout(() => {
    //           console.log(key + '[' + i + ']')
    //         }, 3500)
    //       } else {
    //         formData.append(key + '[' + i + ']', data[i])
    //       }
    //     }
    //   } else {
    //     formData.append(key, data)
    //   }
    // }
    // #endregion
    }
  }

}
</script>

<style lang='scss' scope>
.inputSize {
  width: 60px;
}
</style>
