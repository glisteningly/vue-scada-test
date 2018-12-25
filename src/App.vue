<template>
  <router-view></router-view>
</template>

<script>
  // import Main from './components/Main'

  export default {
    // components: { Main },
    name: 'App',
    data() {
      return {}
    },
    mounted() {
      this.$root._isShowLog = false
    },
  }

</script>
<style lang="scss">

</style>