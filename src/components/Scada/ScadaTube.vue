<template>
  <g class="scada-tube">
    <path class="round-path"
          :stroke="options.style.tubeColor"
          :stroke-width="options.style.tubeWidth"
          :d="roundPath"
          :transform="rectTransformStr"/>
    <path class="flow-path"
          :style="dashLineStyle"
          :stroke="options.style.flowLineColor"
          :stroke-width="options.style.flowLineWidth"
          :d="roundPath"
          :transform="rectTransformStr"/>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'
  import roundPathCorners from './utils/rounding'

  const CompDefine = {
    style: {
      tubeWidth: {
        label: '管道线宽',
        type: 'Int'
      },
      tubeColor: {
        label: '管道颜色',
        type: 'Color'
      },
      flowLineWidth: {
        label: '流向线宽',
        type: 'Int'
      },
      flowLineColor: {
        label: '流向颜色',
        type: 'Color'
      }
    },
    param: {
      showFlow: {
        label: '显示流向',
        type: 'Boolean',
      },
      direction: {
        label: '流动方向',
        type: 'Enum',
        opts: [
          { label: '正向', value: 'forward' },
          { label: '反向', value: 'backward' }
        ]
      },
      velocity: {
        label: '流动速度',
        type: 'Int',
      },
    },
    binding: {
      val: {
        label: '流动',
      }
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaTube',
    // data() {
    //   return {
    //     value: {
    //       isFlow: false
    //     }
    //   }
    // },
    define: CompDefine,
    props: {
      value: {
        type: Object
      },
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: false
          }
        }
      },
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              tubeColor: '#CCC',
              tubeWidth: 10,
              flowLineColor: 'rgba(0,0,0,0.5)',
              flowLineWidth: 6,
              cornerRadius: 6
            },
            param: {
              showFlow: false,
              direction: 'forward',
              velocity: 4,
            }
          }
        }
      },
    },
    computed: {
      roundPath() {
        if (this.comp.points && this.comp.points.length > 1) {
          const pathPts = []

          let tempPt = { x: 0, y: 0 }

          this.comp.points.forEach((pt, index) => {
            if ((index + 1) % 2 === 0) {
              tempPt.y = pt * this.comp.scaleY
              pathPts.push(Object.assign({}, tempPt))
            } else {
              tempPt.x = pt * this.comp.scaleX
            }
          })
          return roundPathCorners(pathPts, this.options.style.cornerRadius)
        }
        else {
          return ''
        }
      },
      velocity() {
        if (this.options.param.velocity < 0) {
          return 1 + 's'
        } else {
          return (10 / this.options.param.velocity) + 's'
        }
      },
      dashLineStyle() {
        if (this.options.param.showFlow || (this.values.val && this.values.val !== '0')) {
          const s = { 'animation-duration': this.velocity }

          if (this.options.param.direction === 'forward') {
            Object.assign(s, { 'animation-name': 'tube-dash' })
          } else {
            Object.assign(s, { 'animation-name': 'tube-dash-reverse' })
          }
          return s
        } else {
          return null
        }
      }
    }
  }
</script>

<style>
  .scada-tube {
    fill: none;
    stroke-linejoin: round;
  }

  .flow-path {
    stroke-dasharray: 10;
    /*stroke-dashoffset: 0px;*/
    /*animation-name: tube-dash;*/
    /*animation-duration: 2s;*/
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes tube-dash {
    from {
      stroke-dashoffset: 100px;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes tube-dash-reverse {
    from {
      stroke-dashoffset: -100px;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
</style>