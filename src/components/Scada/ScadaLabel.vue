<template>
  <text fill="#FFF"
        :x="comp.width * comp.scaleX / 2"
        :y="comp.height * comp.scaleY / 2"
        :transform="rectTransformStr"
        :font-size="options.style.fontSize"
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
    props: {
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              fontSize: 16
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  s {
    color: dodgerblue;
  }
</style>