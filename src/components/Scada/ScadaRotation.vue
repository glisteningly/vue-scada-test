<template>
  <g class="scada-comp scada-rotation scada-anime"
     :class="alarmClass"
     :style="rotatingStyle"
     @click="onCompClicked"
     @mouseout="onCompMouseOut"
     @mouseover="onCompMouseOver">
    <image :xlink:href="options.param.imgUrl || './images/scada-res/scada-rotation-default.svg'"
           :transform="rectTransformStr"
           :width="comp.width * comp.scaleX"
           :height="comp.height * comp.scaleY"/>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  const CompDefine = {
    param: {
      imgUrl: {
        label: '图片路径',
        type: 'String'
      },
      rotating: {
        label: '始终旋转',
        type: 'Boolean'
      },
      direction: {
        label: '旋转方向',
        type: 'Enum',
        opts: [
          { label: '顺时针', value: 'cw' },
          { label: '逆时针', value: 'ccw' }
        ]
      },
      speed: {
        label: '旋转速度',
        type: 'Int'
      }
    },
    binding: {
      val: {
        label: '旋转'
      },
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaRotation',
    define: CompDefine,
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: 0,
            alarm: 0
          }
        }
      },
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              fill: '#52a6e7'
            },
            param: {
              imgUrl: '',
              rotating: false,
              direction: 'ccw',
              speed: 2
            }
          }
        }
      }
    },
    computed: {
      rotatingStyle() {
        const speed = (2 / parseFloat(this.options.param.speed)) || 1
        const direction = this.options.param.direction || 'cw'
        const rotationOrigin = `${this.comp.x}px ${this.comp.y}px`
        const styleObj = {
          transformOrigin: rotationOrigin,
          animation: `rotate_anime_${direction} ${speed}s infinite linear`
        }
        if (this.options.param.rotating) {
          return styleObj
        } else {
          if (this.values.val) {
            return styleObj
          } else {
            return null
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .scada-rotation {
    /*will-change: transform;*/
    /*transform: translateZ(0);*/
    &.alarm {
      filter: url("#filter-red-overlay");
    }
  }

  .scada-rotation-img {
    fill: #F00;
  }

  .rotating-item-cw {
    animation: rotate_anime_cw 1s infinite linear;
  }

  @keyframes rotate_anime_cw {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rotating-item-ccw {
    animation: rotate_anime_ccw 1s infinite linear;
  }

  @keyframes rotate_anime_ccw {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
</style>