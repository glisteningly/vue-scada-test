<template>
  <text fill="#FFF"
        :x="comp.width * comp.scaleX / 2"
        :y="comp.height * comp.scaleY / 2"
        :transform="rectTransformStr"
        :font-size="options.style.fontSize || 16"
        alignment-baseline="middle"
        text-anchor="middle">
    全应科技
  </text>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    extends: BaseComp,
    name: 'ScadaLabel',
  }
</script>

<style scoped>
  s {
    color: dodgerblue;
  }
</style>