<template>
    <template v-if="previewImg.length > 0">
      <!-- 預覽圖片列表 -->
      <ul class="row row-cols-3 g-3 list-unstyled my-3">
        <li v-for="(img, index) in previewImg" :key="`preview${index}`" class="text-center">
          <img :src="img" alt="上傳的圖片預覽" width="200" height="200">
          <div class="my-3">
            <button type="button" class="btn btn-danger" @click="removeFile(img,index)">刪除</button>
            <button class="btn btn-primary btn-secondary mx-2" type="button"
            @click="getOriginUrl(index)" ref="originBtn">恢復原圖</button>
            <button type="button" class="btn btn-primary" @click="$refs.cropImgModal.openModal(img, index)">裁切</button>
          </div>
        </li>
      </ul>
      <!-- Modal -->
      <CropImgModal ref="cropImgModal"></CropImgModal>
    </template>
</template>

<script>
import CropImgModal from '@/components/upload/modal/CropImgModal.vue' //* Modal
export default {
  components: {
    CropImgModal
  },

  props: {
    file: {
      type: Object
    },
    imgType: {
      imgType: Array
    }
  },

  computed: {
    previewImg () {
      //* 有檔案才執行
      if (this.file.length === 0) return this.imgUrlArr
      this.imgUrlArr = [] // eslint-disable-line
      this.tempImgUrlArr = [] // eslint-disable-line
      this.file.forEach((file, index) => {
        const type = file.name.split('.').pop()
        //* 是圖片才設定預覽
        if (this.imgType.includes(type)) {
          //* 若是 Heic 檔就從 heic2Jpeg 來處理 Url
          if (file.heic) {
            // this.imgUrlArr[index] = file.url
            // this.tempImgUrlArr[index] = file.url
            this.imgUrlArr.push(file.url)
            this.tempImgUrlArr.push(file.url)
            // this.$parent.$refs.uploaderList.fileList[index].url = file.url
            return
          }
          const url = URL.createObjectURL(file.file)
          // this.imgUrlArr[index] = url
          // this.tempImgUrlArr[index] = url
          this.imgUrlArr.push(url)
          this.tempImgUrlArr.push(url)
          // this.$parent.$refs.uploaderList.fileList[index].url = url
        }
      })
      return this.imgUrlArr
    }
  },

  data () {
    return {
      imgUrlArr: [],
      tempImgUrlArr: []
    }
  },

  methods: {
    getOriginUrl (index) {
      this.imgUrlArr[index] = this.tempImgUrlArr[index]
    },
    removeFile (img, index) {
      console.log(img)
      console.log(this.$parent.$refs.uploaderList.fileList)
      //* 刪除已上傳列表、預覽列表、佔存列表
      // const removeIndex = this.$parent.$refs.uploaderList.fileList.findIndex(item => {
      //   console.log(item)
      //   return item.url === img
      // })
      // console.log(removeIndex)
      this.$parent.$refs.uploaderList.fileList.splice(index, 1)
      this.imgUrlArr.splice(index, 1)
      this.tempImgUrlArr.splice(index, 1)
    }
  },

  mounted () {
    setInterval(() => {
      // console.log('預覽圖片：', this.file)
    }, 2500)
  }

}
</script>
