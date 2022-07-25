<template>
  <div class="modal" tabindex="-1" ref="modal">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">圖片裁切</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- 圖片裁切 -->
        <CropImg :imgUrl="imgUrl" ref="cropImg"></CropImg>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary d-none" ref="confirmCrop" @click="crop">確定裁切</button>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import Modal from 'bootstrap/js/dist/modal.js'
import CropImg from '@/components/upload/function/CropImg.vue' //* 圖片裁切
export default {
  components: {
    CropImg
  },

  data () {
    return {
      modal: '',
      imgUrl: '',
      currentImgIndex: -1
    }
  },

  watch: {
  },

  methods: {
    openModal (imgUrl, index) {
      this.currentImgIndex = index
      this.imgUrl = imgUrl
      this.modal.show()
    },
    crop () {
      const cropImg = this.$refs.cropImg.getCropUrl()
      //* 變更圖片預覽
      this.$parent.previewImg[this.currentImgIndex] = cropImg
      //* 將裁切後的圖傳回外層 file
      this.$parent.$parent.file[this.currentImgIndex].cropImgUrl = cropImg
      console.log(this.$parent.$parent.file)

      this.$refs.confirmCrop.classList.add('d-none')
      this.modal.hide()
    }
  },

  mounted () {
    this.modal = new Modal(this.$refs.modal)
  }

}
</script>

<style lang='scss' scope></style>
