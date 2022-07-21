<template>
  <section class="my-3">
    <h2>上傳 + 驗證</h2>
    <UploadImg :size="size" :type="type" :width="width" :height="height"
     @upload="upload"></UploadImg>
  </section>

  <hr />

  <section class="my-3">
    <h2>測試：props 參數,<code>size:165800</code> (B), <code>w:150</code>, <code>h:150</code></h2>
    <UploadImg :size="165800" :type="type" :width="150" :height="150" @upload="upload"></UploadImg>
  </section>

  <hr />

  <section class="my-3">
    <h2>測試裁切</h2>
    <UploadImg :size="1658000" :type="type" :width="1500" :height="1500" @upload="upload"></UploadImg>
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
      size: 31457280,
      type: ['png', 'jpg', 'svg', 'jpeg', 'bmp', 'gif', 'heic', 'heif'],
      width: 400,
      height: 400,
      file: {}
      // previewShow: false, //* 圖片預覽
      // previewImgUrl: ''
    }
  },

  methods: {
    upload (file) {
      console.log(file)
    }
  }

}
</script>
