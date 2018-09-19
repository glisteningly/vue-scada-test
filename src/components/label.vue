<template>
  <g>
    <text fill="#FFF"
          :x="layout.width * layout.scaleX / 2"
          :y="layout.height * layout.scaleY / 2"
          :transform="rectTransformStr"
          :font-size="options.fontSize"
          alignment-baseline="middle"
          text-anchor="middle">
      全应科技
    </text>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    extends: BaseComp,
    name: 'scadaLabel',
    // props: {
    //   layout: Object
    // }
  }
</script>

<style scoped>
  s {
    color: dodgerblue;
  }
</style>