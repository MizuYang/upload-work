<template>
    <!-- 上傳模式 -->
    <header class="text-center mb-3">
      <h2>上傳設定</h2>
    </header>
    <main>
     上傳格式：
      <select name="" id="" v-model="options.mode" @change="changeMode">
        <option selected="請選擇檔案格式" disabled>請選擇檔案格式</option>
        <option :value="key" v-for="(mode, key) in options.modeList" :key="mode">{{ mode }}</option>
      </select>
      <br /> <br />

//! 把 section 複用，利用 modeList

    <!-- 上傳格式設定 -->

      <!-- 測試開始 -->
      <!-- <section class="border-bottom mb-2 pb-2"  v-for="(format, key) in options.modeList" :key="key">
        <template v-if="options.mode===key">
          <h5>
            <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('word')">{{ format }} 類型</button>
          </h5>
          <div class="d-flex flex-wrap flex-wrap">
            <div v-for="formatC in format.word" :key="formatC" class="mx-1">
              <input type="checkbox" :value="formatC" :id="formatC" class="me-1" v-model="options.validateFormat"  data-format="word">
              <label :for="formatC">{{ formatC }}</label>
            </div>
          </div>
        </template>
      </section> -->
      <!-- 測試結束 -->

      <!-- Word 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-if="options.mode==='word'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('word')">Word 類型</button>
        </h5>
        <div class="d-flex flex-wrap flex-wrap">
          <div v-for="format in format.word" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="word">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- Excel 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='excel'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('excel')">Excel 類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.excel" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="excel">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- PPT -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='ppt'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('ppt')">PPT 類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.ppt" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="ppt">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- PDF 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='pdf'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('pdf')">PDF 類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.pdf" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="pdf">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- 影像檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='img'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('img')">圖片類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.img" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="img">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- 視訊檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='video'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('video')">影片類型</button>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="format in format.video" :key="format" class="mx-1">
            <input type="checkbox" :value="format" :id="format" class="me-1" v-model="options.validateFormat"  data-format="video">
            <label :for="format">{{ format }}</label>
          </div>
        </div>
      </section>

      <!-- 音訊檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-else-if="options.mode==='music'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('music')">音訊類型</button>
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
      <div v-if="options.mode === 'img'">
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

    <!-- 預覽已設定項目 -->
    <footer class="my-3">
      <h3>已設定的項目</h3>
      <ul class="px-0">
        <li v-if="options.validateSize"><span class="fs-5">檔案限制大小：</span>{{ options.validateSize }}</li>
        <li v-if="options.validateResolution">
          <span class="fs-5">圖片解析度：</span>
          <span v-if="options.validateW || options.validateH">
            {{ options.validateW }} * {{ options.validateH }}
          </span>
        </li>
        <li v-if="options.mode!=='請選擇檔案格式'">
          <span class="fs-5">選擇的上傳模式：</span>
          {{ options.modeList[options.mode] }}
        </li>
        <li v-if="options.mode!=='請選擇檔案格式'">
          <span class="fs-5">可上傳檔案格式：</span>
          <code v-for="format in options.validateFormat" :key="format" class="symbol">
            {{ format }}
          </code>
        </li>
      </ul>
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
      allCheckCount: {},
      options: {
        modeList: {
          word: 'Word',
          excel: 'Excel',
          ppt: 'PPT',
          pdf: 'PDF',
          img: '圖片',
          video: '影片',
          music: '音訊'
        },

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
    //* 全部勾選
    allCheck (format) {
      const hasCheck = this.allCheckCount[format] === undefined || this.allCheckCount[format] === 1
      if (hasCheck) {
        //* 若已勾選過，則將該項目全部取消勾選
        this.allCheckCount[format] = 0
        //* 將該類型從 options 全部移除
        this.format[format].forEach(format => {
          const removeIndex = this.options.validateFormat.indexOf(format)
          this.options.validateFormat.splice(removeIndex, 1)
        })
      } else {
        //* 若沒勾選過的話，將該類型項目全部勾選
        this.allCheckCount[format] = 1
        //* 將該類型新增至 options
        this.format[format].forEach(format => {
          //* 若已有該選該項目，則不再新增進去
          if (this.options.validateFormat.indexOf(format) === -1) {
            this.options.validateFormat.push(format)
          }
        })
      }
    },
    //* 下拉選單切換模式
    changeMode () {
      const format = this.options.mode
      // //* 切換上傳格式，原先的選擇的格式都會清空
      this.options.validateFormat = []
      // //* 選擇模式後該格式全勾選
      this.format[format].forEach(format => {
      //   //* 若已有該選該項目，則不再新增進去
        if (this.options.validateFormat.indexOf(format) === -1) {
          this.options.validateFormat.push(format)
        }
      })
    }
  }

}
</script>

<style lang='scss' scope>
.symbol::after {
  content: '、'
}
.symbol:last-child::after {
  content: ''
}
</style>
