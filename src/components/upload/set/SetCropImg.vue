<template>
    <h3>裁切模式</h3>
    <select name="" id="" v-model="freeCropMode">
      <option :value="true">自由裁切</option>
      <option :value="false">限制裁切寬高</option>
    </select>
    <div class="my-3" v-if="!freeCropMode">
      <p class="fs-5">輸入希望裁切的圖片尺寸</p>
      <label for="width">寬：</label>
      <input id="width" type="number" v-model="crop.width"
      placeholder="輸入裁切寬度" style="width:120px"
      oninput="value=value.replace(/[^\d]/g,'')">
      <br />
      <label for="height">高：</label>
      <input id="height" type="number" v-model="crop.height" placeholder="輸入裁切高度" style="width:120px" oninput="value=value.replace(/[^\d]/g,'')">
    </div>
</template>

<script>

export default {

  watch: {
    crop: {
      handler () {
        this.$parent.$refs.cropImg.option.autoCropWidth = this.crop.width
        this.$parent.$refs.cropImg.option.autoCropHeight = this.crop.height
      },
      deep: true
    },
    freeCropMode () {
      this.$parent.$refs.cropImg.option.fixedBox = Boolean(!this.freeCropMode)
    }
  },

  data () {
    return {
      crop: {
        width: 160,
        height: 150
      },
      freeCropMode: true
    }
  }

}
</script>
