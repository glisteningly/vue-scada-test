<template>
  <g>
    <path class="round-path"
          fill="none"
          :stroke="options.style.stroke"
          :stroke-width="options.style.strokeWidth"
          :d="roundPath"
          :transform="pathTransformStr"/>
    <path class="flow-path"
          fill="none"
          :stroke="options.style.fill"
          :stroke-width="4"
          :d="roundPath"
          :transform="pathTransformStr"/>
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
              tempPt.y = pt
              pathPts.push(Object.assign({}, tempPt))
            } else {
              tempPt.x = pt
            }
          })

          return roundPathCorners(pathPts, this.options.style.cornerRadius)
        }
        // return `M0 0 L 100 0 L100 100 L 0 50`
        else {
          return ''
        }
      }
    }
  }
</script>

<style>
  .round-path {
    /*stroke: deepskyblue;*/
  }

  .flow-path {
    /*stroke: rgba(0, 0, 0, 0.2);*/
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