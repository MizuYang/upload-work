<template>
    <template v-if="previewImg.length > 0">
      <!-- 預覽圖片列表 -->
      <ul class="row row-cols-3 g-3 list-unstyled my-3">
        <li v-for="(img, index) in previewImg" :key="`preview${index}`" class="text-center">
          <img :src="img" alt="上傳的圖片預覽" width="200" height="200">
          <div class="my-3">
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
      this.file.forEach(file => {
        const type = file.name.split('.').pop()
        //* 是圖片才設定預覽
        if (this.imgType.includes(type)) {
          //* 若是 Heic 檔就從 heic2Jpeg 來處理 Url
          if (file.heic) {
            this.imgUrlArr.push(file.url)
            return
          }
          const url = URL.createObjectURL(file.file)
          this.imgUrlArr.push(url)
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

  mounted () {
    setInterval(() => {
      // console.log('預覽圖片：', this.file)
    }, 2500)
  }

}
</script>
