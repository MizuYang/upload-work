<template>
  <div class="modal" tabindex="-1" ref="modal">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">圖片裁切</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>裁切</p>
        <!-- <img :src="img" alt="要裁切的圖片"> -->
        <CropImg :imgUrl="imgUrl"></CropImg>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary">確定裁切</button>
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
      imgUrl: ''
    }
  },

  watch: {
  },

  methods: {
    openModal (imgUrl) {
      this.imgUrl = imgUrl
      this.modal.show()
    }
  },

  mounted () {
    this.modal = new Modal(this.$refs.modal)
  }

}
</script>

<style lang='scss' scope></style>
