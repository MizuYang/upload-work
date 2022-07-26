<template>
    <template v-if="previewImg.length > 0">
      <!-- 預覽圖片列表 -->
      <ul class="row row-cols-3 g-3 list-unstyled my-3">
        <!-- <li v-for="(img, index) in previewImg" :key="`preview${index}`" class="text-center">
          <img :src="img" alt="上傳的圖片預覽" width="200" height="200">
          <div class="my-3">
            <button type="button" class="btn btn-danger" @click="removeFile(img,index)">刪除</button>
            <button class="btn btn-primary btn-secondary mx-2" type="button"
            @click="getOriginUrl(index)" ref="originBtn">恢復原圖</button>
            <button type="button" class="btn btn-primary" @click="$refs.cropImgModal.openModal(img, index)">裁切</button>
          </div>
        </li> -->
        <li v-for="(img, index) in previewImg" :key="`preview${index}`" class="text-center">
          <img :src="img.url" alt="上傳的圖片預覽" width="200" height="200">
          <div class="fileNameStyle my-2 p-3">
            {{ img.fileName }}
          </div>
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
      //* 初始化
      this.imgUrlArr = [] // eslint-disable-line
      this.tempImgUrlArr = [] // eslint-disable-line

      this.file.forEach((file, index) => {
        console.log('index:', index, file)
        const type = file.name.split('.').pop()
        //* 是圖片才設定預覽
        if (this.imgType.includes(type)) {
          //* 若是 Heic 檔就從 heic2Jpeg 來處理 Url
          if (file.heic) {
            const obj = {
              fileName: file.name,
              url: file.url
            }
            this.imgUrlArr.push(obj)
            console.error(this.imgUrlArr)
            return
          }
          const url = URL.createObjectURL(file.file)
          const obj = {
            fileName: file.name,
            url: url
          }
          this.imgUrlArr.push(obj)
          console.error(this.imgUrlArr)
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
      console.log(this.$parent.$refs.uploaderList.fileList)
      //* 若上傳 heic 檔，非同步問題會導致上傳區與預覽列表索引不同步，所以分開刪除
      //* 刪除已上傳列表
      const removeIndex = this.$parent.$refs.uploaderList.fileList.findIndex(item => {
        return item.name === img.fileName
      })
      this.$parent.$refs.uploaderList.fileList.splice(removeIndex, 1)

      //* 刪除圖片預覽列表
      this.imgUrlArr.splice(index, 1)
      this.tempImgUrlArr.splice(index, 1)

      //! 刪除索引位置怪怪的，因為 Heic 檔上傳有非同步問題，導致上傳區與預覽區索引位置不同
      //! 這裡刪除檔案和上傳區實際刪除的不同
      //! 須優先處理預覽時非同步問題
      // ? previewImg 改寫成物件看看，給他 fileName 到時候用 findIndex 就不會出錯了
      // ? 這樣也可以查看渲染的圖片和檔案名稱是否一致
      // ? 監聽整個上傳區，使用點擊事件，並看 e.target 是否能抓到檔案名稱，再做刪除按鈕
      // ? 也可試試看將隱藏的 X 刪除按鈕顯示
    }
  },

  mounted () {
    setInterval(() => {
      // console.log('預覽圖片：', this.file)
    }, 2500)
  }

}
</script>

<style lang="scss" scoped>
.fileNameStyle {
  background: rgba(0, 0, 0, 0.189);
  color: rgb(0, 0, 0);
}
</style>
