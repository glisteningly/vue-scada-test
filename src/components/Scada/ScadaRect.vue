<template>
  <rect :fill="options.style.fill"
        :stroke="options.style.stroke"
        :stroke-width="options.style.strokeWidth"
        :transform="rectTransformStr"
        :width="comp.width * comp.scaleX"
        :height="comp.height * comp.scaleY"
        :rx="options.style.cornerRadius"
        :ry="options.style.cornerRadius"/>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    extends: BaseComp,
    name: 'ScadaRect',
    props: {
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              fill: '#08334C',
              stroke: '#20A0FF',
              strokeWidth: 2,
              cornerRadius: 0
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>