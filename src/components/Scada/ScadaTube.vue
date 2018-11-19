<template>
  <g class="scada-tube">
    <path class="round-path"
          :stroke="options.style.stroke"
          :stroke-width="options.style.strokeWidth"
          :d="roundPath"
          :transform="rectTransformStr"/>
    <path class="flow-path"
          :stroke="options.style.fill"
          :stroke-width="4"
          :d="roundPath"
          :transform="rectTransformStr"/>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'
  import roundPathCorners from './utils/rounding'

  export default {
    extends: BaseComp,
    name: 'ScadaTube',
    props: {
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              fill: '#08334C',
              stroke: '#20A0FF',
              strokeWidth: 6,
              cornerRadius: 0
            }
          }
        }
      }
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
    animation-name: tube-dash;
    animation-duration: 2s;
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
</style>