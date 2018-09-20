<template>
  <rect fill="#08334C" stroke="#20A0FF" :stroke-width="options.style.strokeWidth || 0"
        :transform="rectTransformStr"
        :width="comp.width * comp.scaleX"
        :height="comp.height * comp.scaleY"/>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    extends: BaseComp,
    name: 'scadaRect',
    // props: {
    //   layout: Object
    // }
  }
</script>

<style scoped>

</style>