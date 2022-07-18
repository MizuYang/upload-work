<template>
   <input type="button" @click="previewShow = !previewShow" :value="previewShow ? '關閉圖片預覽': '開啟圖片預覽'" class="btn btn-primary" />

   <section v-if="previewShow && imgUrl" class="my-3">
    <h3>檔案預覽</h3>
    <img :src="imgUrl" alt="上傳的圖片預覽">
   </section>
</template>

<script>
export default {

  props: {
    imgUrl: {
      type: String
    }
  },

  data () {
    return {
      previewShow: false
    }
  }

}
</script>
