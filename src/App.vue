<template>
  <div class="container p-5">
    <header>
      <ul>
        <li>
          <router-link to="/" class="btn mx-2 p-2">首頁</router-link>
          <router-link to="/upload" class="btn mx-2 p-2">檔案上傳</router-link>
        </li>
      </ul>
    </header>
    <main class="border m-5 p-5">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {

  data () {
    return {
      currentPage: ''
    }
  }

}
</script>

<style lang="scss">
@import "@/assets/stylesheets/all.scss";
.active {
  background-color: gray;
  color: #fff;
}
</style>
