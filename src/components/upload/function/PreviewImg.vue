<template>
    <template v-if="previewImg.length > 0">
      <!-- 預覽圖片列表 -->
      <ul class="row row-cols-3 g-3 list-unstyled my-3">
        <li v-for="(img, index) in previewImg" :key="`preview${index}`" class="text-center">
          <img :src="img.url" alt="上傳的圖片預覽" width="200" height="200">
          <div class="fileNameStyle my-2 p-3">
            {{ img.fileName }}
          </div>
          <div class="my-3">
            <button type="button" class="btn btn-danger" @click="removeFile(img,index)">刪除</button>
            <button class="btn btn-primary btn-secondary mx-2" type="button"
            @click="getOriginUrl(index)" ref="originBtn">恢復原圖</button>
            <button type="button" class="btn btn-primary" @click="$refs.cropImgModal.openModal(img.url, index)">裁切</button>
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
      type: Array
    },
    imgType: {
      imgType: Array
    }
  },

  computed: {
    previewImg () {
      //* 有檔案才執行
      if (this.file.length === 0) return []

      //* 初始化
      this.imgUrlArr = [] // eslint-disable-line

      this.file.forEach((file, index) => {
        const type = file.name.split('.').pop()
        const obj = {
          fileName: file.name,
          url: null
        }
        //* 是圖片才設定預覽
        if (this.imgType.includes(type)) {
          //* 若是 Heic 就用 heic2Jpeg 處理好的 Url(在props file)
          if (file.heic) {
            obj.url = file.url
            obj.tempUrl = file.url
          } else {
            const url = URL.createObjectURL(file.file)
            obj.url = url
            obj.tempUrl = url
          }
          this.imgUrlArr.push(obj)
        }
      })
      return this.imgUrlArr
    }
  },

  data () {
    return {
      imgUrlArr: []
    }
  },

  methods: {
    getOriginUrl (index) {
      this.imgUrlArr[index].url = this.imgUrlArr[index].tempUrl
    },
    removeFile (img, index) {
      //* 若上傳 heic 檔，非同步問題會導致上傳區與預覽列表索引不同步，所以分開刪除
      //* 刪除已上傳列表
      const removeIndex = this.$parent.$refs.uploaderList.fileList.findIndex(item => {
        return item.name === img.fileName
      })
      if (removeIndex !== -1) {
        this.$parent.$refs.uploaderList.fileList.splice(removeIndex, 1)
      }

      //* 刪除圖片預覽列表
      this.imgUrlArr.splice(index, 1)

      //* 要給後端的 file data
      this.$parent.file.splice(index, 1)
    }
  }

}
</script>

<style lang="scss" scoped>
.fileNameStyle {
  background: rgba(0, 0, 0, 0.189);
  color: rgb(0, 0, 0);
}
</style>
