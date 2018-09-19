<template>
  <rect fill="#08334C" stroke="#20A0FF" stroke-width="2"
        :transform="rectTransformStr"
        :width="layout.width * layout.scaleX"
        :height="layout.height * layout.scaleY"/>
</template>

<script>
  import BaseComp from './BaseComp'
  export default {
    extends: BaseComp,
    name: 'scadaRect',
    props: {
      layout: Object
    }
  }
</script>

<style scoped>

</style>