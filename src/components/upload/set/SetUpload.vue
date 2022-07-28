<template>
    <!-- 上傳模式 -->
    <header class="text-center mb-3">
      <h2>上傳設定</h2>
    </header>
    <main>
     上傳模式：
      <select name="" id="" v-model="options.mode">
        <option selected="請選擇檔案格式" disabled>請選擇檔案格式</option>
        <option :value="mode" v-for="mode in options.modeList" :key="mode">{{ mode }}</option>
      </select>
      <br /> <br />

    <!-- 上傳格式設定 -->
      <!-- Word 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-if="options.mode==='Word'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('word')">Word 類型</button>
        </h5>
        <div class="d-flex flex-wrap flex-wrap">
          <div v-for="format in format.word" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="word">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- Excel 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='Excel'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('excel')">Excel 類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.excel" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="excel">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- PPT -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='PPT'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('ppt')">PPT 類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.ppt" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="ppt">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- PDF 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='PDF'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('pdf')">PDF 類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.pdf" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="pdf">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- 影像檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='圖片'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('img')">圖片類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.img" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="img">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- 視訊檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='影片'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('video')">影片類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.video" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="video">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- 音訊檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='音訊'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allSelect('music')">音訊類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.music" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="music">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

    <!-- 限制檔案大小 -->
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
    </main>

    <!-- 開始上傳按鈕 -->
    <footer class="my-3 text-center">
      <h3>已設定的項目</h3>
      <ul>
        <li v-if="options.validateSize">檔案限制大小：{{ options.validateSize }}</li>
        <li v-if="options.validateSize">檔案限制大小：{{ options.validateSize }}</li>
      </ul>
      {{ options }}
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
      allSelectCount: {},
      options: {
        modeList: ['Word', 'Excel', 'PPT', 'PDF', '圖片', '影片', '音訊'],
        mode: '請選擇檔案格式',
        validateSize: 153600,
        validateResolution: false,
        validateFormat: [],
        setFinish: false
      },
      format: {
        word: ['.doc', '.dot', '.wbk', '.docx', '.docm', '.dotx', '.dotm', '.docb'],
        excel: ['.xls', '.xlt', '.xlm', '.xlsx', '.xlsm', '.xltx', '.xltm'],
        ppt: ['.ppt', '.pot', '.pps', '.pptx', '.pptm', '.potx', '.potm', '.ppam', '.ppsx', '.ppsm', '.sldx', '.sldm'],
        pdf: ['.pdf'],
        img: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.psd', '.thm', '.yuv', '.ai', '.drw', '.eps', '.ps', '.svg', '.3dm', '.max', 'heic', 'heif'],
        video: ['.avi', '.mp4', '.mov', '.wmv', '.asf', '.3g2', '.3gp', '.asx', '.flv', '.mpg', '.rm', '.swf', '.vob'],
        music: ['.mp3', '.aif', '.iff', '.m3u', '.m4a', '.mid', '.mpa', '.ra', '.wav', '.wma']

      }
    }
  },
  methods: {
    startUpload () {
      this.options.setFinish = true
    },
    allSelect (format) {
      if (!this.allSelectCount[format]) {
        //* 若沒勾選過的話，將該類型項目全部勾選
        this.allSelectCount[format] = 1
        //* 將該類型新增至 options
        this.format[format].forEach(format => {
          //* 若已有該選該項目，則不再新增進去
          if (this.options.validateFormat.indexOf(format) === -1) {
            this.options.validateFormat.push(format)
          }
        })
      } else {
        //* 若已勾選過，則將該項目全部取消勾選
        this.allSelectCount[format] = 0
        //* 將該類型從 options 全部移除
        this.format[format].forEach(format => {
          const removeIndex = this.options.validateFormat.indexOf(format)
          this.options.validateFormat.splice(removeIndex, 1)
        })
      }
    }
  }

}
</script>

<style lang='scss' scope></style>
