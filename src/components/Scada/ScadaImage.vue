<template>
  <CompWrapper :layout="comp">
    <image :xlink:href="options.url" :width="comp.width" :height="comp.height"/>
  </CompWrapper>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    // props: {
    //   options: Object
    // },
    extends: BaseComp,
    name: 'ScadaImage'
  }
</script>

<style scoped>

</style>