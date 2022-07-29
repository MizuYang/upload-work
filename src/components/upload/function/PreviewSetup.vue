<template>
    <!-- <h3>已設定的項目</h3> -->
    <ul class="px-0">
      <li v-if="setup.size?.hasValidateSize==='true' && setup.size?.setSize">
        <span class="fs-5">檔案限制大小：</span>
        <span class="border-bottom">{{ setup.size.setSize }} {{ setup.size.unit }}</span>
      </li>
      <li v-if="setup.hasValidateResolution">
        <span class="fs-5">圖片解析度：</span>
        <span v-if="setup.validateW || setup.validateH" class="border-bottom">
          {{ setup.validateW }} * {{ setup.validateH }}
        </span>
      </li>
      <li v-if="setup.mode !== '請選擇檔案格式'">
        <span class="fs-5">上傳模式：</span>
        <span class="border-bottom">{{ uploadMode }}</span>
      </li>
      <li v-if="setup.validateType?.length > 0">
        <span class="fs-5">檔案格式：</span> <br />
        <code v-for="type in setup.validateType" :key="type" class="symbol border-bottom">
          {{ type }}
        </code>
      </li>
    </ul>
</template>

<script>
export default {

  props: {
    setup: {
      type: Object
    }
  },

  computed: {
    uploadMode () {
      let resolut = ''
      //* 若有資料再讀取才不會出錯
      if (this.setup.modeList && this.setup.mode) {
        resolut = this.setup.modeList[this.setup.mode]
      }
      return resolut
    }
  },

  mounted () {
    // setInterval(() => {
    //   console.log(this.setup)
    // }, 2000)
  }
}
</script>
