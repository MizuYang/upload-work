<template>
  <section class="my-3">
    <h2>上傳 + 驗證</h2>
    <UploadImg :size="size" :type="type" :width="width" :height="height"></UploadImg>
  </section>

  <hr />

  <section class="my-3">
    <h2>測試：props 參數,<code>size:165800</code> (B), <code>w:150</code>, <code>h:150</code></h2>
    <UploadImg :size="165800" :type="type" :width="150" :height="150"></UploadImg>
  </section>
</template>

<script>
import UploadImg from '@/components/UploadImg.vue'
export default {

  components: {
    UploadImg
  },

  data () {
    return {
      isLoading: false,
      size: 31457280,
      type: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif'],
      width: 400,
      height: 400,
      previewShow: false, //* 圖片預覽
      previewImgUrl: ''

    }
  }
}
</script>
