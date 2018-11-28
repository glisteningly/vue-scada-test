<template>
  <image :xlink:href="options.url"
         :transform="rectTransformStr"
         :width="comp.width * comp.scaleX"
         :height="comp.height * comp.scaleY"/>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    extends: BaseComp,
    name: 'ScadaImage'
  }
</script>

<style lang="scss">
  .scada-image {
    &.alarm {
      filter: url("#filter-red-overlay");
    }
  }

  .scada-image.alarm1 {
    filter: url("#filter-orange-overlay");
  }
</style>