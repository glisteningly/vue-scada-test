<template>
  <rect class="scada-rect"
        :class="alarmClass"
        :fill="options.style.fill"
        :stroke="options.style.stroke"
        :stroke-width="options.style.strokeWidth"
        :transform="rectTransformStr"
        :width="comp.width * comp.scaleX"
        :height="comp.height * comp.scaleY"
        :rx="options.style.cornerRadius"
        :ry="options.style.cornerRadius"
        @click="onCompClicked"
        @mouseover="onCompMouseOver"/>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    extends: BaseComp,
    name: 'ScadaRect',
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            alarm: 0
          }
        }
      },
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

<style lang="scss">
  .scada-rect {
    &.alarm {
      /*filter: url("#filter-red-overlay");*/
      stroke: rgba(255, 0, 0, 1);
    }
  }
</style>