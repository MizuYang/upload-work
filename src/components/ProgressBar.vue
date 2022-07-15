<template>
  <label ref="progressLabel" for="progress"></label>
  <progress ref="progress" value="0" max="100"> </progress>
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
    getProgressBar () {
      const reader = new FileReader()
      reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          // 計算完成百分比
          const percent = (event.loaded / event.total) * 100
          // 將值設定為進度元件
          // progress.value = percent
          this.$refs.progress.value = percent
          this.$refs.progressLabel.innerHTML = Math.round(percent) + '%'
        }
      })
    }
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope></style>
