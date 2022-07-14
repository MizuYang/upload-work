<template>
  <UploadImg></UploadImg>
</template>

<script>
import UploadImg from '@/components/UploadImg.vue'
export default {
  components: {
    UploadImg
  },

  data () {
    return {
      isLoading: false
    }
  },

  mounted () {
  }
}
</script>
