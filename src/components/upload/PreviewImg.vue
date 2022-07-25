<template>
    <!-- <template v-if="previewImg.length > 0"> -->
    <ul class="row row-cols-3 g-3 list-unstyled my-3">
      <li v-for="(img) in previewImg" :key="img">
        <img :src="img" alt="" width="200" height="200">
      </li>
    </ul>
  <!-- </template> -->
</template>

<script>

export default {
  components: {
  },

  data () {
    return {
    }
  },

  watch: {
  },

  methods: {
    // getCropUrl (cropUrl, index) {
    //   // console.log(cropUrl)
    //   // console.log(index)
    //   console.log(this.file[0])
    //   this.file[0].url = cropUrl
    //   // this.file.perviewImgUrl = cropUrl
    // },
    // getOriginUrl () {
    //   this.file.perviewImgUrl = this.tempPreviewImgUrl
    // }
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope></style>
