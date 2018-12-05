<template>
  <g class="scada-label" @click="$emit('labelClicked')">
    <text :class="alarmClass"
          :fill="options.style.fill"
          :x="comp.width * comp.scaleX / 2"
          :y="comp.height * comp.scaleY / 2"
          :transform="rectTransformStr"
          :font-size="options.style.fontSize">
      <template v-if="options.style.textAlignH === 'auto'">
        <tspan v-if="options.param.prefixText"
               class="scada-label-prefix"
               alignment-baseline="middle" x="0"
               :fill="options.style.prefixFill"
               text-anchor="start">
          {{ options.param.prefixText }}
        </tspan>
        <tspan v-if="!options.param.suffixText" class="scada-label-text" alignment-baseline="middle"
               :x="comp.width * comp.scaleX / 2"
               text-anchor="middle">
          {{ labelText }}
        </tspan>
        <tspan v-else
               :x="comp.width * comp.scaleX"
               text-anchor="end">
          <tspan class="scada-label-text" alignment-baseline="middle">{{ labelText }}</tspan>
          <tspan class="scada-label-suffix"
                 :class="alarmClass"
                 :fill="options.style.suffixFill"
                 alignment-baseline="middle">
            {{ options.param.suffixText }}
          </tspan>
        </tspan>
      </template>
      <template v-else>
        <tspan :text-anchor="options.style.textAlignH" :x="alignPosX">
          <tspan v-if="options.param.prefixText"
                 class="scada-label-prefix"
                 :fill="options.style.prefixFill">
            {{ options.param.prefixText }}
          </tspan>
          <tspan class="scada-label-text">
            {{ labelText }}
          </tspan>
          <tspan v-if="options.param.suffixText"
                 class="scada-label-suffix"
                 :class="alarmClass"
                 :fill="options.style.suffixFill">
            {{ options.param.suffixText }}
          </tspan>
        </tspan>
      </template>
    </text>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'
  import _ from 'lodash'

  const CompDefine = {
    style: {
      fill: {
        label: '字体颜色',
        type: 'Color'
      },
      fontSize: {
        label: '字体尺寸',
        type: 'Int'
      },
      textAlignH: {
        label: '水平对齐',
        type: 'Enum',
        opts: [
          { label: '自动', value: 'auto' },
          { label: '左', value: 'start' },
          { label: '居中', value: 'middle' },
          { label: '右', value: 'end' },
        ]
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
    },
    binding: {
      text: {
        label: '数据显示'
      },
      // alarm: {
      //   label: '告警状态'
      // }
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaLabel',
    define: CompDefine,
    props: {
      value: {
        type: Object
      },
      defaultValue: {
        type: Object,
        default: function () {
          return {
            text: '----',
            alarm: 0
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
              textAlignH: 'auto',
              prefixFill: '#FFF',
              suffixFill: '#FFF',
            },
            param: {
              defaultText: '',
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
          if ((!this.options.param.defaultText) || (this.options.param.defaultText === '')) {
            return '----'
          } else {
            return this.options.param.defaultText
          }
        }
      },
      alignPosX() {
        switch (this.options.style.textAlignH) {
          case 'start':
            return 0
          case 'end':
            return this.comp.width * this.comp.scaleX
          case 'middle':
            return this.comp.width * this.comp.scaleX / 2
        }
      },
      alarmClass() {
        if (this.values.alarm && this.values.alarm !== 0) {
          return 'scada-label-alarm'
        } else
          return null
      }
    }
  }
</script>

<style lang="scss">
  .scada-label {
    /*&:hover {*/
      /*cursor: pointer;*/
    /*}*/
  }

  .scada-label-text, .scada-label-prefix, .scada-label-suffix {
    alignment-baseline: middle;
  }

  .scada-label-alarm {
    fill: #d00000;
  }

</style>