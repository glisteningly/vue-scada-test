<template>
  <g class="scada-label" @click="onCompClicked" @mouseover="onCompMouseOver">
    <rect class="scada-label-bg"
          rx="5"
          ry="5"
          fill="transparent"
          :transform="rectTransformStr"
          :width="comp.width * comp.scaleX"
          :height="comp.height * comp.scaleY">

    </rect>
    <text :class="alarmClass"
          :fill="options.style.fill"
          :x="comp.width * comp.scaleX / 2"
          :y="comp.height * comp.scaleY / 2"
          :transform="rectTransformStr"
          :font-size="options.style.fontSize">
      <template v-if="options.style.textAlignH === 'auto'">
        <tspan v-if="options.param.prefixText"
               class="scada-label-prefix"
               :class="alarmClass"
               alignment-baseline="middle"
               :x="options.style.fontSize / 2"
               :fill="options.style.prefixFill"
               text-anchor="start">
          {{ options.param.prefixText }}
        </tspan>
        <tspan v-if="!options.param.suffixText"
               class="scada-label-text"
               alignment-baseline="middle"
               :x="comp.width * comp.scaleX / 2"
               :font-family="fontFamily"
               :font-size="labelFontSize"
               text-anchor="middle">
          {{ labelText }}
        </tspan>
        <tspan v-else
               :x="comp.width * comp.scaleX - options.style.fontSize / 2"
               text-anchor="end">
          <tspan class="scada-label-text"
                 :font-family="fontFamily"
                 :font-size="labelFontSize"
                 alignment-baseline="middle">
            {{ labelText }}
          </tspan>
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
                 :class="alarmClass"
                 :fill="options.style.prefixFill">
            {{ options.param.prefixText }}
          </tspan>
          <tspan class="scada-label-text"
                 :font-family="fontFamily"
                 :font-size="labelFontSize">
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
      fontFamily: {
        label: '字体',
        type: 'Enum',
        opts: [
          { label: '默认', value: 'default' },
          { label: 'LCD', value: 'lcdmono' }
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
    name: 'ScadaLabel',
    define: CompDefine,
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: null,
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
              fontFamily: 'default',
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
        if (!_.isNil(this.values.val) && this.values.val !== '') {
          // 小数点保留
          if (!isNaN(parseFloat(this.values.val))) {
            return _.round(this.values.val, parseInt(this.options.param.decTrim))
          } else {
            return this.values.val
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
      fontFamily() {
        switch (this.options.style.fontFamily) {
          case 'lcdmono':
            return 'lcdmono'
          default:
            return ''
        }
      },
      labelFontSize() {
        if (this.fontFamily === 'lcdmono') {
          return this.options.style.fontSize * 1.2
        } else {
          return this.options.style.fontSize
        }
      },
    }
  }
</script>

<style lang="scss">
  .scada-label {
    letter-spacing: 0.6px;
    .scada-label-text {
      letter-spacing: 1px;
    }
    &:hover {
      cursor: pointer;
      .scada-label-bg {
        fill: rgba(255, 255, 255, 0.1);
      }
    }
    .alarm {
      fill: #d00000;
    }
  }

  .scada-label-text, .scada-label-prefix, .scada-label-suffix {
    alignment-baseline: middle;
  }

</style>