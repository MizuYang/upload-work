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

  data () {
    return {
      setup: {}
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
