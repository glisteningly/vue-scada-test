<template>
  <CompWrapper :layout="comp">
    <image :xlink:href="options.url" :width="comp.width" :height="comp.height" class="scada-image"/>
    <!--<image :xlink:href="options.url" :width="comp.width" :height="comp.height" filter="url(#filter-red-overlay)"/>-->
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

<style lang="scss">
  .scada-image{
    &.alarm {
      filter: url("#filter-red-overlay");
    }
  }

  .scada-image.alarm1 {
    filter: url("#filter-orange-overlay");
  }
</style>