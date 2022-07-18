<template>
  <input type="radio" id="radioA" name="radio" value="自由裁切"
     v-model="cropType">
    <label for="radioA">自由裁切</label>
    <br />
    <input type="radio" id="radioB" name="radio" value="限制裁切寬高"
     v-model="cropType">
    <label for="radioB">限制裁切寬高</label>
    <div class="my-3" v-if="cropType==='限制裁切寬高'">
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
  components: {
  },

  emits: ['getCropSize', 'getCropType'],

  watch: {
    crop: {
      handler () {
        this.$emit('getCropSize', this.crop)
      },
      deep: true
    },
    cropType () {
      this.$emit('getCropType', this.cropType)
    }
  },

  data () {
    return {
      crop: {
        width: 160,
        height: 150
      },
      cropType: '自由裁切'
    }
  },

  methods: {
  },

  mounted () {
  }

}
</script>

<style lang='scss' scope></style>
