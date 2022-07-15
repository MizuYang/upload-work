<template>
  <progress ref="progress" value="0" max="100"> </progress>
  <label ref="progressLabel" for="progress"></label>
</template>

<script>

export default {
  components: {
  },

  // props: ['reader'],

  data () {
    return {
    }
  },

  //!  參數雙向綁定數值
  //! 由外層綁定進度條的值 props 進來看看

  watch: {
  },

  methods: {
    // getProgressBar () {
    //   const reader = new FileReader()
    //   reader.addEventListener('progress', (event) => {
    //     // this.$nextTick(() => {
    //     if (event.loaded && event.total) {
    //       // 計算完成百分比
    //       const percent = (event.loaded / event.total) * 100
    //       // 將值設定為進度元件
    //       // progress.value = percent
    //       console.log(this.$refs.progress)
    //       console.log(this.$refs.progressLabel)
    //       this.$refs.progress.value = percent
    //       this.$refs.progressLabel.innerHTML = Math.round(percent) + '%'
    //     }
    //   })
    // })
    // }
  },

  mounted () {
    // const percent = 50
    // this.$refs.progress.value = percent
    // this.$refs.progressLabel.innerHTML = Math.round(percent) + '%'
    // const reader = new FileReader()
  //   this.reader.addEventListener('progress', (event) => {
  //     // this.$nextTick(() => {
  //     if (event.loaded && event.total) {
  //       // 計算完成百分比
  //       const percent = (event.loaded / event.total) * 100
  //       // 將值設定為進度元件
  //       // progress.value = percent
  //       this.$refs.progress.value = percent
  //       this.$refs.progressLabel.innerHTML = Math.round(percent) + '%'
  //     }
  //   })
  //   // })
  }

}
</script>

<style lang='scss' scope></style>
