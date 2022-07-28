<template>
    <!-- 上傳模式 -->
    <header class="text-center mb-3">
      <h2>上傳設定</h2>
    </header>
    <section class="">
      上傳模式：
      <select name="" id="" v-model="options.uploadMode">
        <option value="一般檔案">一般檔案</option>
        <option value="圖片">圖片</option>
      </select>
      <br /> <br />
      <!-- 限制檔案大小 -->

  <!-- 上傳格式設定 -->
      <!-- Word 檔案類型 -->

      <!-- Excel檔案類型 -->
      <!-- ppT -->
      <!-- PDF 檔案類型 -->
      <!-- 影像檔案類型 -->
      <!-- 視訊檔案類型 -->
      <!-- 音訊檔案類型 -->

      <label for="validateSize">檔案限制大小：</label>
      <input id="validateSize" type="number" placeholder="檔案大小限制" v-model="options.validateSize" oninput="value=value.replace(/[^\d]/g,'')">
      <br /> <br />
      <!-- 限制圖片寬高 -->
      <div v-if="options.uploadMode === '圖片'">
        <input type="checkbox" id="resolution" v-model="options.validateResolution">
        <label for="resolution">我要限制圖片寬高</label>
        <div v-if="options.validateResolution" class="my-3">
          <label for="width">寬：</label>
          <input type="number" id="width" class="inputSize" v-model="options.validateW" oninput="value=value.replace(/[^\d]/g,'')">
          <br /> <br />
          <label for="height">高：</label>
          <input type="number" id="height" class="inputSize" v-model="options.validateH" oninput="value=value.replace(/[^\d]/g,'')">
        </div>
      </div>
    </section>

    <!-- 開始上傳按鈕 -->
    <footer class="my-3 text-center">
      <button type="button" class="btn btn-primary" @click="startUpload">開始上傳</button>
    </footer>
</template>

<script>

export default {

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
        uploadMode: '圖片',
        validateSize: 153600,
        validateResolution: false,
        validateW: 0,
        validateH: 0,
        setFinish: false
      },
      format: {
        word: ['.doc', '.dot', '.wbk', '.docx', '.docm', '.dotx', '.dotm', '.docb'],
        excel: ['.xls', '.xlt', '.xlm', '.xlsx', '.xlsm', '.xltx', '.xltm'],
        ppt: ['.ppt', '.pot', '.pps', '.pptx', '.pptm', '.potx', '.potm', '.ppam', '.ppsx', '.ppsm', '.sldx', '.sldm'],
        pdf: ['.pdf'],
        img: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.psd', '.thm', '.yuv', '.ai', '.drw', '.eps', '.ps', '.svg', '.3dm', '.max'],
        video: ['.avi', '.mp4', '.mov', '.wmv', '.asf', '.3g2', '.3gp', '.asx', '.flv', '.mpg', '.rm', '.swf', '.vob'],
        music: ['.mp3', '.aif', '.iff', '.m3u', '.m4a', '.mid', '.mpa', '.ra', '.wav', '.wma']

      }
    }
  },
  methods: {
    startUpload () {
      this.options.setFinish = true
    }
  }

}
</script>

<style lang='scss' scope></style>
