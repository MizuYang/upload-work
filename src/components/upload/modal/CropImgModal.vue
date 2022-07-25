<template>
  <div class="modal" tabindex="-1" ref="modal">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">圖片裁切</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- 裁切設定 -->
        <SetCropImg ref="setCropImg"></SetCropImg>
        <!-- 圖片裁切 -->
        <CropImg :imgUrl="imgUrl" ref="cropImg"></CropImg>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary d-none" ref="confirmCrop" @click="confirmCrop">確定裁切</button>
      </div>
    </div>
  </div>
</div>

</template>

<script>
import Modal from 'bootstrap/js/dist/modal.js'
import CropImg from '@/components/upload/function/CropImg.vue' //* 圖片裁切
import SetCropImg from '@/components/upload/set/SetCropImg.vue'
export default {
  components: {
    CropImg,
    SetCropImg
  },

  data () {
    return {
      modal: '',
      imgUrl: '',
      currentImgIndex: -1
    }
  },

  methods: {
    openModal (imgUrl, index) {
      this.currentImgIndex = index
      this.imgUrl = imgUrl
      this.modal.show()
    },
    confirmCrop () {
      const cropImg = this.$refs.cropImg.getCropUrl()
      //* 變更圖片預覽
      this.$parent.previewImg[this.currentImgIndex] = cropImg
      //* 將裁切後的圖傳回外層 file
      this.$parent.$parent.file[this.currentImgIndex].cropImgUrl = cropImg

      this.$refs.confirmCrop.classList.add('d-none')
      this.modal.hide()
    }
  },

  mounted () {
    this.modal = new Modal(this.$refs.modal)
    //* 監聽 Modal 關閉
    this.$refs.modal.addEventListener('hidden.bs.modal', () => {
      //* Modal 關閉後初始化裁切預覽圖片
      this.$refs.cropImg.cropImgUrl = ''
      //* 初始化裁切框大小
      this.$refs.cropImg.option.autoCropWidth = 160
      this.$refs.cropImg.option.autoCropHeight = 150
      //* 初始化 限制寬高輸入框
      this.$refs.setCropImg.crop.width = 160
      this.$refs.setCropImg.crop.height = 150
    })
  }

}
</script>
