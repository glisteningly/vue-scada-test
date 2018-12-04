<template>
  <g class="scada-label">
    <text :fill="options.style.fill"
          :x="comp.width * comp.scaleX / 2"
          :y="comp.height * comp.scaleY / 2"
          :transform="rectTransformStr"
          :font-size="options.style.fontSize"
          text-anchor="end">
      <tspan class="scada-label-prefix"
             alignment-baseline="middle" x="0"
             :fill="options.style.prefixFill"
             text-anchor="start">
        {{ options.param.prefixText }}
      </tspan>
      <!--<tspan class="scada-label-text" alignment-baseline="middle" :x="comp.width * comp.scaleX / 2"-->
      <!--text-anchor="middle">-->
      <!--326.54-->
      <!--</tspan>-->
      <tspan
          :x="comp.width * comp.scaleX"
          text-anchor="end">
        <tspan class="scada-label-text" alignment-baseline="middle">{{ labelText }}</tspan>
        <tspan class="scada-label-suffix"
               :fill="options.style.suffixFill"
               alignment-baseline="middle">
          {{ options.param.suffixText }}
        </tspan>
      </tspan>
    </text>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'
  import _ from 'lodash'

  const CompOptionsDefine = {
    style: {
      fill: {
        label: '字体颜色',
        type: 'Color'
      },
      fontSize: {
        label: '字体尺寸',
        type: 'Int'
      },
      prefixFill: {
        label: '前缀颜色',
        type: 'Color'
      },
      suffixFill: {
        label: '后缀颜色',
        type: 'Color'
      },
    },
    param: {
      defaultText: {
        label: '默认文本',
        type: 'String',
      },
      prefixText: {
        label: '前缀文本',
        type: 'String',
      },
      suffixText: {
        label: '后缀文本',
        type: 'String',
      },
      decTrim: {
        label: '小数保留',
        type: 'Int',
      }
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaLabel',
    define: CompOptionsDefine,
    props: {
      value: {
        type: Object
      },
      defaultValue: {
        type: Object,
        default: function () {
          return {
            text: '----'
          }
        }
      },
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              fill: '#FFF',
              fontSize: 20,
              prefixFill: '#FFF',
              suffixFill: '#FFF',
            },
            param: {
              defaultText: '66.666',
              prefixText: '',
              suffixText: '',
              decTrim: 0
            }
          }
        }
      }
    },
    computed: {
      labelText() {
        if (!_.isNil(this.values.text) && this.values.text !== '') {
          // 小数点保留
          if (!isNaN(parseFloat(this.values.text))) {
            return _.round(this.values.text, parseInt(this.options.param.decTrim))
          } else {
            return this.values.text
          }
        } else {
          if (this.options.param.defaultText === '') {
            return '----'
          } else {
            return this.options.param.defaultText
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