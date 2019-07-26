<template>
  <section class="app-main">
    <!--界面是个现实和隐藏的过程，所以以动画效果，先退出，后现实来现实router-view里面的路由-->
    <transition name="fade" mode="out-in">
      <router-view :key="key" class="container"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return null;
//      return this.$route.name !== undefined ? this.$route.name + +new Date()  : this.$route + +new Date()
    }
  }
}
</script>
<style type="text/css">
   .container{
     height:calc(100vh - 170px);
     overflow-y:auto;
     overflow-x: hidden;
   }
</style>
