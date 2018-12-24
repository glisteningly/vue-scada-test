<template>
  <g class="scada-comp scada-progress" @click="onCompClicked" :class="alarmClass">
    <rect class="scada-progress-bg"
          :fill="options.style.bgColor"
          :transform="rectTransformStr"
          :width="comp.width * comp.scaleX"
          :height="comp.height * comp.scaleY"
          :rx="options.style.cornerRadius"
          :ry="options.style.cornerRadius"/>
    <rect class="scada-progress-bar"
          :fill="options.style.fill"
          :transform="rectTransformStr"
          :width="comp.width * comp.scaleX * percentNum"
          :height="comp.height * comp.scaleY"
          :rx="options.style.cornerRadius"
          :ry="options.style.cornerRadius"/>
    <rect class="scada-progress-border"
          fill="transparent"
          :stroke="options.style.stroke"
          :stroke-width="options.style.strokeWidth"
          :transform="rectTransformStr"
          :width="comp.width * comp.scaleX"
          :height="comp.height * comp.scaleY"
          :rx="options.style.cornerRadius"
          :ry="options.style.cornerRadius"/>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'
  import _ from 'lodash'

  const CompDefine = {
    style: {
      bgColor: {
        label: '背景色',
        type: 'Color'
      },
    },
    param: {
      minVal: {
        label: '最小值',
        type: 'Number',
      },
      maxVal: {
        label: '最大值',
        type: 'Number',
      }
    },
    binding: {
      val: {
        label: '数值显示'
      },
      // alarm: {
      //   label: '告警状态'
      // }
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaProgress',
    define: CompDefine,
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: 33.3,
            alarm: 0
          }
        }
      },
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              fill: '#20A0FF',
              stroke: '#BBB',
              bgColor: '#08334C',
              strokeWidth: 2,
              cornerRadius: 0
            },
            param: {
              minVal: 0,
              maxVal: 100
            }
          }
        }
      }
    },
    computed: {
      percentNum() {
        let min = 0
        let max = 100
        try {
          min = parseFloat(this.options.param.minVal)
          max = parseFloat(this.options.param.maxVal)
        } catch (e) {
          console.log(e)
        }
        if (!_.isNil(min) && !_.isNil(max) && (min < max)) {
          let p = ((parseFloat(this.values.val) - min) || 0) / (max - min)
          if (p > 1) p = 1
          if (p < 0) p = 0
          return p
        } else {
          return 0
        }
      },
    }
  }
</script>

<style lang="scss">
  .scada-progress {
    &.alarm {
      .scada-progress-bg {
        fill: rgba(255, 0, 0, .1);
      }
      .scada-progress-bar {
        fill: #d20000;
      }
      .scada-progress-border {
        stroke: #d20000;
      }
    }
  }
</style>