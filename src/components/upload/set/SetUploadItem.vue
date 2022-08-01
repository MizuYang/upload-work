<template>
      <h2 class="text-center mb-3" v-if="!setup.setFinish">上傳設定</h2>
      <!-- 上傳格式設定 -->
      <section class="mb-3">
        上傳格式：
        <select v-model="setup.mode" @change="changeMode">
          <option selected="請選擇檔案格式" disabled>請選擇檔案格式</option>
          <option :value="key" v-for="(mode, key) in setup.modeList" :key="mode">{{ mode }}</option>
        </select>

      <i class="text-danger ms-2 d-none" ref="mode">*此欄位必填</i>
      </section>

      <!-- 勾選可上傳格式 -->
      <section class="border-bottom mb-2 pb-2" v-for="(type, key) in setup.modeList" :key="key" v-show="setup.mode === key">
        <h5>
          <button type="button" class="btn btn-dark btn-sm" @click.self="allCheck(key)">{{ type }} 類型  {{ key }}  借放</button>
          <i class="text-danger ms-2 d-none" :class="key">*此欄位必填</i>
        </h5>
        <div class="d-flex flex-wrap flex-wrap">
          <div v-for="item in typeList" :key="item" class="mx-1">
            <input type="checkbox" :value="item" :id="item" class="me-1" v-model="setup.validateType">
            <label :for="item">{{ item }}</label>
          </div>
        </div>
      </section>

      <!-- 限制檔案大小 -->
      <section class="mb-3">
        <input type="radio" name="size" id="freeSize" value="false" v-model="setup.size.hasValidateSize">
        <label for="freeSize">大小無限制</label>

        <input type="radio" name="size" id="sizeRule" class="ms-3" value="true" v-model="setup.size.hasValidateSize">
        <label for="sizeRule">限制檔案大小</label>

        <template v-if="setup.size.hasValidateSize==='true'">
          <select class="mx-2" v-model="setup.size.unit">
            <option :value="unit" v-for="unit in setup.size.unitList" :key="unit">{{ unit }}</option>
          </select>

          <label for="validateSize" class="ms-3">檔案大小：</label>
          <input id="validateSize" type="number" v-model="setup.size.setSize" oninput="value=value.replace(/[^\d]/g,'')"
            :class="inputSize">
            {{ setup.size.unit }}
          <i class="text-danger ms-2 d-none" ref="size">*此欄位必填</i>
        </template>
      </section>

      <!-- 設定上傳單一檔案、多個檔案 -->
      <section class="mb-3">
        <input type="radio" id="multiple" name="uploadFileNum" :value="false" v-model="setup.singleFile">
        <label for="multiple">上傳多檔</label>

        <input type="radio" id="single" name="uploadFileNum" :value="true" v-model="setup.singleFile" class="ms-2">
        <label for="single">上傳單檔</label>
      </section>

      <!-- 限制圖片寬高 -->
      <section v-if="setup.mode === 'img'">
        <input type="checkbox" id="resolution" v-model="setup.hasValidateResolution">
        <label for="resolution">我要限制圖片寬高</label>
        <div v-if="setup.hasValidateResolution" class="my-3">
          <label for="width">寬：</label>
          <input type="number" id="width" class="inputSize" v-model="setup.validateW" oninput="value=value.replace(/[^\d]/g,'')">
          <i class="text-danger ms-2 d-none" ref="w">*此欄位必填</i>
          <br /> <br />
          <label for="height">高：</label>
          <input type="number" id="height" class="inputSize" v-model="setup.validateH" oninput="value=value.replace(/[^\d]/g,'')">
          <i class="text-danger ms-2 d-none" ref="h">*此欄位必填</i>
        </div>
      </section>
</template>

<script>
export default {

  emits: ['getSetup'],

  watch: {
    setup: {
      handler () {
        this.$emit('getSetup', this.setup)
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    inputSize () {
      const style = this.setup.size.unitStyle
      const unit = this.setup.size.unit
      return style[unit]
    },
    typeList () {
      const mode = this.setup.mode
      return this.type[mode]
    }
  },

  data () {
    return {
      allCheckCount: {},
      setup: {
        modeList: {
          word: 'Word',
          excel: 'Excel',
          ppt: 'PPT',
          pdf: 'PDF',
          img: '圖片',
          video: '影片',
          music: '音訊'
        },
        mode: '請選擇檔案格式', //* 用戶選擇上傳模式：Word、PTT..等
        validateType: [], //* 能上傳的格式
        size: {
          unitList: ['GB', 'MB', 'KB', 'B'],
          unitStyle: {
            GB: 'w-s',
            MB: 'w-m',
            KB: 'w-l',
            B: 'w-xl'
          },
          unit: 'KB',
          setSize: 150,
          validateSize: 0,
          hasValidateSize: false
        },
        hasValidateResolution: false,
        validateW: '',
        validateH: '',
        singleFile: false, //* 僅能上傳單個檔案
        setFinish: false
      },
      type: {
        word: ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb'],
        excel: ['xls', 'xlt', 'xlm', 'xlsx', 'xlsm', 'xltx', 'xltm'],
        ppt: ['ppt', 'pot', 'pps', 'pptx', 'pptm', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm'],
        pdf: ['pdf', 'accdb'],
        img: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'psd', 'thm', 'yuv', 'ai', 'drw', 'eps', 'ps', 'svg', '3dm', 'max', 'heic', 'heif'],
        video: ['avi', 'mp4', 'mov', 'wmv', 'asf', '3g2', '3gp', 'asx', 'flv', 'mpg', 'rm', 'swf', 'vob'],
        music: ['mp3', 'aif', 'iff', 'm3u', 'm4a', 'mid', 'mpa', 'ra', 'wav', 'wma']

      }
    }
  },

  methods: {
    //* 全部勾選
    allCheck (type) {
      const hasCheck = this.allCheckCount[type] === undefined || this.allCheckCount[type] === 1
      if (hasCheck) {
        //* 若已勾選過，則將該項目全部取消勾選
        this.allCheckCount[type] = 0
        //* 將該類型從 setup 全部移除
        this.type[type].forEach(type => {
          const removeIndex = this.setup.validateType.indexOf(type)
          this.setup.validateType.splice(removeIndex, 1)
        })
      } else {
        //* 若沒勾選過的話，將該類型項目全部勾選
        this.allCheckCount[type] = 1
        //* 將該類型新增至 setup
        this.type[type].forEach(type => {
          //* 若已有該選該項目，則不再新增進去
          if (this.setup.validateType.indexOf(type) === -1) {
            this.setup.validateType.push(type)
          }
        })
      }
    },
    //* 下拉選單切換模式
    changeMode () {
      const type = this.setup.mode
      // //* 切換上傳格式，原先的選擇的格式都會清空
      this.setup.validateType = []
      // //* 選擇模式後該格式全勾選
      this.type[type].forEach(type => {
      //   //* 若已有該選該項目，則不再新增進去
        if (this.setup.validateType.indexOf(type) === -1) {
          this.setup.validateType.push(type)
        }
      })
    }
  }

}
</script>
