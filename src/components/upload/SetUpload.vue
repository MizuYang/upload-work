<template>
  <!-- 上傳模式 -->
    上傳模式：
    <select name="" id="" v-model="options.uploadMode">
      <option value="一般檔案">一般檔案</option>
      <option value="圖片">圖片</option>
    </select>
    <br /> <br />
    <!-- 限制檔案大小 -->
    <label for="validateSize">檔案限制大小：</label>
    <input id="validateSize" type="number" placeholder="檔案大小限制" v-model="options.validateSize">
    <br /> <br />
    <!-- 限制圖片寬高 -->
    <div v-if="options.uploadMode === '圖片'">
      <input type="checkbox" id="resolution" v-model="options.validateResolution">
      <label for="resolution">我要限制圖片寬高</label>
      <div v-if="options.validateResolution" class="my-3">
        <label for="width">寬：</label>
        <input type="number" id="width" class="inputSize" v-model="options.validateW">
        <br /> <br />
        <label for="height">高：</label>
        <input type="number" id="height" class="inputSize" v-model="options.validateH">
      </div>
    </div>
</template>

<script>

export default {
  components: {
  },

  emits: ['setUpload'],

  watch: {
    options: {
      handler () {
        this.$emit('setUpload', this.options)
      },
      deep: true,
      immediate: true
    }
  },

  data () {
    return {
      options: {
        uploadMode: '一般檔案',
        validateSize: 153600,
        validateResolution: false,
        validateW: 0,
        validateH: 0
      }
    }
  },

  methods: {
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope></style>
