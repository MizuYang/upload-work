<template>
    <!-- 上傳設定 -->
    <main v-if="!setup.setFinish">
      <SetUploadItem @getSetup="getSetup" ref="setItem"></SetUploadItem>

      <hr />

    </main>

    <!-- 預覽已設定項目 -->
    <footer class="mt-3">
      <PreviewSetup :setup="setup"></PreviewSetup>

      <div class="text-center mt-3" v-if="!setup.setFinish">
        <button type="button" class="btn btn-primary" @click="startUpload">開始上傳</button>
      </div>
    </footer>

</template>

<script>
import SetUploadItem from '@/components/upload/set/SetUploadItem.vue'
import PreviewSetup from '@/components/upload/function/PreviewSetup.vue'
export default {

  components: {
    SetUploadItem,
    PreviewSetup
  },

  emits: ['setUpload'],

  // computed: {
  //   inputSize () {
  //     const style = this.setup.size.unitStyle
  //     const unit = this.setup.size.unit
  //     return style[unit]
  //   },
  //   typeList () {
  //     const mode = this.setup.mode
  //     return this.type[mode]
  //   }
  // },

  data () {
    return {
      setup: {}
      // allCheckCount: {}

      // setup: {
      //   modeList: {
      //     word: 'Word',
      //     excel: 'Excel',
      //     ppt: 'PPT',
      //     pdf: 'PDF',
      //     img: '圖片',
      //     video: '影片',
      //     music: '音訊'
      //   },
      //   mode: '請選擇檔案格式', //* 用戶選擇上傳模式：Word、PTT..等
      //   validateType: [], //* 能上傳的格式
      //   size: {
      //     unitList: ['GB', 'MB', 'KB', 'B'],
      //     unitStyle: {
      //       GB: 'w-s',
      //       MB: 'w-m',
      //       KB: 'w-l',
      //       B: 'w-xl'
      //     },
      //     unit: 'KB',
      //     setSize: 150,
      //     validateSize: 0,
      //     hasValidateSize: false
      //   },
      //   hasValidateResolution: false,
      //   setFinish: false
      // },

      // type: {
      //   word: ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb'],
      //   excel: ['xls', 'xlt', 'xlm', 'xlsx', 'xlsm', 'xltx', 'xltm'],
      //   ppt: ['ppt', 'pot', 'pps', 'pptx', 'pptm', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm'],
      //   pdf: ['pdf', 'accdb'],
      //   img: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'psd', 'thm', 'yuv', 'ai', 'drw', 'eps', 'ps', 'svg', '3dm', 'max', 'heic', 'heif'],
      //   video: ['avi', 'mp4', 'mov', 'wmv', 'asf', '3g2', '3gp', 'asx', 'flv', 'mpg', 'rm', 'swf', 'vob'],
      //   music: ['mp3', 'aif', 'iff', 'm3u', 'm4a', 'mid', 'mpa', 'ra', 'wav', 'wma']

      // }
    }
  },
  methods: {
    startUpload () {
      this.validate()
      const result = this.validate()

      //* 驗證通過才顯示上傳
      if (result) {
        //* 處理檔案大小單位
        if (this.setup.size.hasValidateSize) {
          this.unitChange()
        }
        //* 開啟檔案上傳、隱藏上傳設定
        this.setup.setFinish = true
        this.$emit('setUpload', this.setup)
      }
    },
    //* 驗證是否已上傳
    validate () {
      const validate = {}
      //* 上傳模式
      const mode = this.setup.mode
      if (mode === '請選擇檔案格式') {
        this.showErrorFeedback('mode', true)
        validate.mode = false
      } else {
        this.hideErrorFeedback('mode', true)
        validate.mode = true
      }
      //* 限制檔案大小
      const hasValidateSize = this.setup.size.hasValidateSize
      const size = this.setup.size.setSize
      if (hasValidateSize === 'true') {
        if (!size) {
          this.showErrorFeedback('size', true)
          validate.size = false
        } else if (size && hasValidateSize) {
          this.hideErrorFeedback('size', true)
          validate.size = true
        }
      } else {
      //* 若沒限制大小，即直接驗證通過
        validate.size = true
      }
      //* 限制解析度
      const hasValidateResolution = this.setup.hasValidateResolution
      const w = this.setup.validateW
      const h = this.setup.validateH
      if (hasValidateResolution) {
        if (!w) {
          this.showErrorFeedback('w', true)
          validate.w = false
        } else {
          this.hideErrorFeedback('w', true)
          validate.w = true
        }

        if (!h) {
          this.showErrorFeedback('h', true)
          validate.h = false
        } else {
          this.hideErrorFeedback('h', true)
          validate.h = true
        }
      } else {
        //* 若沒限制解析度，即直接驗證通過
        validate.w = true
        validate.h = true
      }
      //* 檔案類型
      const validateType = this.setup.validateType
      const type = this.setup.mode
      if (validateType.length === 0) {
        this.showErrorFeedback(type, false)
        validate.type = false
      } else {
        this.hideErrorFeedback(type, false)

        validate.type = true
      }

      const result = Object.values(validate).indexOf(false)
      //* 若其一驗證失敗，回傳 false
      const success = result === -1? true : false // eslint-disable-line
      return success
    },
    // //* 全部勾選
    // allCheck (type) {
    //   const hasCheck = this.allCheckCount[type] === undefined || this.allCheckCount[type] === 1
    //   if (hasCheck) {
    //     //* 若已勾選過，則將該項目全部取消勾選
    //     this.allCheckCount[type] = 0
    //     //* 將該類型從 setup 全部移除
    //     this.type[type].forEach(type => {
    //       const removeIndex = this.setup.validateType.indexOf(type)
    //       this.setup.validateType.splice(removeIndex, 1)
    //     })
    //   } else {
    //     //* 若沒勾選過的話，將該類型項目全部勾選
    //     this.allCheckCount[type] = 1
    //     //* 將該類型新增至 setup
    //     this.type[type].forEach(type => {
    //       //* 若已有該選該項目，則不再新增進去
    //       if (this.setup.validateType.indexOf(type) === -1) {
    //         this.setup.validateType.push(type)
    //       }
    //     })
    //   }
    // },
    // //* 下拉選單切換模式
    // changeMode () {
    //   const type = this.setup.mode
    //   // //* 切換上傳格式，原先的選擇的格式都會清空
    //   this.setup.validateType = []
    //   // //* 選擇模式後該格式全勾選
    //   this.type[type].forEach(type => {
    //   //   //* 若已有該選該項目，則不再新增進去
    //     if (this.setup.validateType.indexOf(type) === -1) {
    //       this.setup.validateType.push(type)
    //     }
    //   })
    // },
    //* 單位轉換
    unitChange () {
      const data = {
        GB: 3,
        MB: 2,
        KB: 1,
        B: 0
      }
      const unit = this.setup.size.unit
      const count = data[unit]
      //* 若是 B 則不需轉換單位
      if (count) {
        this.setup.size.validateSize = this.setup.size.setSize * (1024 ** count)
      }
    },
    showErrorFeedback (item, status) {
      this.$nextTick(() => {
        if (!status) {
          //* 勾選可上傳格式的錯誤訊息節點，用 ref 抓不到 DOM，所以這樣寫
          document.querySelector(`.${item}`).classList.remove('d-none')
        } else {
          this.$refs.setItem.$refs[item].classList.remove('d-none')
        }
      })
    },
    hideErrorFeedback (item, status) {
      this.$nextTick(() => {
        if (!status) {
          //* 勾選可上傳格式的錯誤訊息節點，用 ref 抓不到 DOM，所以這樣寫
          document.querySelector(`.${item}`).classList.add('d-none')
        } else {
          this.$refs.setItem.$refs[item].classList.add('d-none')
        }
      })
    },
    getSetup (setup) {
      this.setup = setup
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
//* 檔案大小單位欄位尺寸
.w-s {
  width: 40px;
}
.w-m {
  width: 50px;
}
.w-l {
  width: 60px;
}
.w-xl {
  width: 90px;
}
</style>
