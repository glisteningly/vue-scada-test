<template>
  <CompWrapper :layout="layout">
    <image :xlink:href="options.url" :width="layout.width" :height="layout.height"/>
  </CompWrapper>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    props: {
      options: Object
    },
    extends: BaseComp,
    name: 'scadaImage'
  }
</script>

<style scoped>

</style>