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

      <i class="text-danger ms-2 d-none" data-feedback="mode">*此欄位必填</i>

      <br /> <br />

<!-- //! 把 section 複用，利用 modeList -->

    <!-- 上傳格式設定 -->

      <!-- 測試開始 -->
      <!-- <section class="border-bottom mb-2 pb-2"  v-for="(type, key) in options.modeList" :key="key">
        <template v-if="options.mode===key">
          <h5>
            <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('word')">{{ type }} 類型</button>
          </h5>
          <div class="d-flex flex-wrap flex-wrap">
            <div v-for="typeC in type.word" :key="typeC" class="mx-1">
              <input type="checkbox" :value="typeC" :id="typeC" class="me-1" v-model="options.validateType"  data-type="word">
              <label :for="typeC">{{ typeC }}</label>
            </div>
          </div>
        </template>
      </section> -->
      <!-- 測試結束 -->

      <!-- Word 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='word'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('word')">Word 類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="word">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap flex-wrap">
          <div v-for="type in type.word" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="word">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

      <!-- Excel 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='excel'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('excel')">Excel 類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="excel">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="type in type.excel" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="excel">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

      <!-- PPT -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='ppt'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('ppt')">PPT 類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="ppt">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="type in type.ppt" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="ppt">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

      <!-- PDF 檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='pdf'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('pdf')">PDF 類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="pdf">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="type in type.pdf" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="pdf">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

      <!-- 影像檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='img'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('img')">圖片類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="img">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="type in type.img" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="img">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

      <!-- 視訊檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='video'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('video')">影片類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="video">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="type in type.video" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="video">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

      <!-- 音訊檔案類型 -->
      <section class="border-bottom mb-2 pb-2" v-show="options.mode==='music'">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck('music')">音訊類型</button>
          <i class="text-danger ms-2 d-none" data-feedback="music">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap">
          <div v-for="type in type.music" :key="type" class="mx-1">
            <input type="checkbox" :value="type" :id="type" class="me-1" v-model="options.validateType"  data-type="music">
            <label :for="type">{{ type }}</label>
          </div>
        </div>
      </section>

    <!-- 限制檔案大小 -->
      <input type="radio" name="size" id="freeSize" value="false" v-model="options.hasValidateSize">
      <label for="freeSize">大小無限制</label>

      <input type="radio" name="size" id="sizeRule" class="ms-3" value="true" v-model="options.hasValidateSize">
      <label for="sizeRule">限制檔案大小</label>

      <template v-if="options.hasValidateSize==='true'">
        <label for="validateSize" class="ms-5">檔案大小：</label>
        <input id="validateSize" type="number" placeholder="檔案大小限制" v-model="options.validateSize" oninput="value=value.replace(/[^\d]/g,'')">
        <i class="text-danger ms-2 d-none" data-feedback="size">*此欄位必填</i>
      </template>
      <br /> <br />

    <!-- 限制圖片寬高 -->
      <div v-if="options.mode === 'img'">
        <input type="checkbox" id="resolution" v-model="options.hasValidateResolution">
        <label for="resolution">我要限制圖片寬高</label>
        <div v-if="options.hasValidateResolution" class="my-3">
          <label for="width">寬：</label>
          <input type="number" id="width" class="inputSize" v-model="options.validateW" oninput="value=value.replace(/[^\d]/g,'')">
          <i class="text-danger ms-2 d-none" data-feedback="w">*此欄位必填</i>
          <br /> <br />
          <label for="height">高：</label>
          <input type="number" id="height" class="inputSize" v-model="options.validateH" oninput="value=value.replace(/[^\d]/g,'')">
          <i class="text-danger ms-2 d-none" data-feedback="h">*此欄位必填</i>
        </div>
      </div>
    </main>

    <hr />

    <!-- 預覽已設定項目 -->
    <footer class="mt-3">
      <h3>已設定的項目</h3>
      <ul class="px-0">
        <li v-if="options.validateSize">
          <span class="fs-5">檔案限制大小：</span>
          <span class="border-bottom">{{ options.validateSize }}</span>
        </li>
        <li v-if="options.hasValidateResolution">
          <span class="fs-5">圖片解析度：</span>
          <span v-if="options.validateW || options.validateH" class="border-bottom">
            {{ options.validateW }} * {{ options.validateH }}
          </span>
        </li>
        <li v-if="options.mode!=='請選擇檔案格式'">
          <span class="fs-5">上傳模式：</span>
          <span class="border-bottom">{{ options.modeList[options.mode] }}</span>
        </li>
        <li v-if="options.mode!=='請選擇檔案格式'">
          <span class="fs-5">檔案格式：</span> <br />
          <code v-for="type in options.validateType" :key="type" class="symbol border-bottom">
            {{ type }}
          </code>
        </li>
      </ul>
      <div class="text-center mt-3">
        <button type="button" class="btn btn-primary" @click="startUpload">開始上傳</button>
      </div>
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
        validateType: [],
        hasValidateResolution: false,
        setFinish: false,
        hasValidateSize: false
      },
      type: {
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
      this.validate()
      const result = this.validate()

      //* 驗證通過才顯示上傳
      if (result) this.options.setFinish = true
    },
    //* 驗證是否已上傳
    validate () {
      const validate = {}
      //* 上傳模式
      const mode = this.options.mode
      if (mode === '請選擇檔案格式') {
        // this.$refs.mode.classList.remove('d-none')
        document.querySelector('[data-feedback="mode"]').classList.remove('d-none')
        validate.mode = false
      } else {
        // this.$refs.mode.classList.add('d-none')
        document.querySelector('[data-feedback="mode"]').classList.add('d-none')
        validate.mode = true
      }
      //* 限制檔案大小
      const hasValidateSize = this.options.hasValidateSize
      const size = this.options.validateSize
      // console.log('qq', hasValidateSize, typeof (hasValidateSize))
      if (hasValidateSize === 'true') {
        if (!size) {
          // this.$refs.size.classList.remove('d-none')
          document.querySelector('[data-feedback="size"]').classList.remove('d-none')
          validate.size = false
        } else if (size && hasValidateSize) {
          // this.$refs.size.classList.add('d-none')
          document.querySelector('[data-feedback="size"]').classList.add('d-none')
          validate.size = true
        }
      } else {
      //* 若沒限制大小，即直接驗證通過
        validate.size = true
      }
      //* 限制解析度
      const hasValidateResolution = this.options.hasValidateResolution
      const w = this.options.validateW
      const h = this.options.validateH
      if (hasValidateResolution) {
        if (!w) {
          // this.$refs.w.classList.remove('d-none')
          document.querySelector('[data-feedback="w"]').classList.remove('d-none')
          validate.w = false
        } else {
          // this.$refs.w.classList.add('d-none')
          document.querySelector('[data-feedback="w"]').classList.add('d-none')
          validate.w = true
        }

        if (!h) {
          // this.$refs.h.classList.remove('d-none')
          document.querySelector('[data-feedback="h"]').classList.remove('d-none')
          validate.h = false
        } else {
          // this.$refs.h.classList.add('d-none')
          document.querySelector('[data-feedback="h"]').classList.add('d-none')
          validate.h = true
        }
      } else {
        //* 若沒限制解析度，即直接驗證通過
        validate.w = true
        validate.h = true
      }
      //* 檔案類型
      const type = this.options.validateType
      if (type.length === 0) {
        // this.$refs.type.classList.remove('d-none')
        const type = this.options.mode
        console.log(type)
        document.querySelector(`[data-feedback="${type}"]`).classList.remove('d-none')
        validate.type = false
      } else {
        // this.$refs.type.classList.add('d-none')
        this.$nextTick(() => {
          document.querySelector(`[data-feedback="${type}"]`).classList.add('d-none')
        })

        validate.type = true
      }

      const result = Object.values(validate).indexOf(false)
      //* 若其一驗證失敗，回傳 false
      const success = result === -1? true : false // eslint-disable-line
      return success
    },
    //* 全部勾選
    allCheck (type) {
      const hasCheck = this.allCheckCount[type] === undefined || this.allCheckCount[type] === 1
      if (hasCheck) {
        //* 若已勾選過，則將該項目全部取消勾選
        this.allCheckCount[type] = 0
        //* 將該類型從 options 全部移除
        this.type[type].forEach(type => {
          const removeIndex = this.options.validateType.indexOf(type)
          this.options.validateType.splice(removeIndex, 1)
        })
      } else {
        //* 若沒勾選過的話，將該類型項目全部勾選
        this.allCheckCount[type] = 1
        //* 將該類型新增至 options
        this.type[type].forEach(type => {
          //* 若已有該選該項目，則不再新增進去
          if (this.options.validateType.indexOf(type) === -1) {
            this.options.validateType.push(type)
          }
        })
      }
    },
    //* 下拉選單切換模式
    changeMode () {
      const type = this.options.mode
      // //* 切換上傳格式，原先的選擇的格式都會清空
      this.options.validateType = []
      // //* 選擇模式後該格式全勾選
      this.type[type].forEach(type => {
      //   //* 若已有該選該項目，則不再新增進去
        if (this.options.validateType.indexOf(type) === -1) {
          this.options.validateType.push(type)
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
