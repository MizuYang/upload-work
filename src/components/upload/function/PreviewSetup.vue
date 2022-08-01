<template>
    <h3 class="text-center">已設定項目</h3>
    <ul class="setupList px-0">
      <li>
        <span class="setupStyle" v-if="setup.mode !== '請選擇檔案格式'">{{ uploadMode }} / </span>
        <span class="setupStyle">
          {{ setup.singleFile? '僅能上傳單獨檔案': '可上傳多個檔案' }}
        </span>
      </li>
      <li v-if="setup.size?.hasValidateSize==='true' && setup.size?.setSize">
        <span class="fs-5">檔案大小：</span>
        <span class="setupStyle">{{ setup.size.setSize }} {{ setup.size.unit }}</span>
      </li>
      <li v-if="setup.hasValidateResolution">
        <span class="fs-5">圖片解析度：</span>
        <span v-if="setup.validateW || setup.validateH" class="setupStyle">
          {{ setup.validateW }} * {{ setup.validateH }}
        </span>
      </li>
      <li v-if="setup.validateType?.length > 0">
        <span class="fs-5">檔案格式：</span> <br />
        <code v-for="type in setup.validateType" :key="type" class="symbol setupStyle">
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
  }
}
</script>

<style lang="scss" scoped>
.setupStyle{
  border-bottom: 1px solid rgba(0, 0, 0, 0.419);
  background-color: rgba(0, 0, 255, 0.064);
}
</style>
