<template>
  <svg id="svg_scada_view"
       style="position: absolute; left: 0;top: 0;"
       :width="canvasLayout.width"
       :height="canvasLayout.height"
       :viewBox="svgViewbox">
    <svg id="svg_root" overflow="visible">
      <SvgColorFilter :blink="true"/>
      <component v-for="comp in comps"
                 :bindingValue="comp.bindingValue"
                 :key="comp.name"
                 :is="comp.type"
                 :comp="comp"/>
    </svg>
  </svg>
</template>

<script>
  import SvgColorFilter from '../components/SvgColorFilter'

  export default {
    components: { SvgColorFilter },
    name: 'SvgScadaView',
    props: {
      dataBinding: {
        type: Object,
        default: function () {
          return {}
        }
      },
      comps: {
        type: Array
      },
      canvasLayout: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        testVal: true
      }
    },
    computed: {
      svgViewbox() {
        const x = (-this.canvasLayout.x / this.canvasLayout.scale).toFixed(2)
        const y = (-this.canvasLayout.y / this.canvasLayout.scale).toFixed(2)
        const w = (this.canvasLayout.width / this.canvasLayout.scale).toFixed(2)
        const h = (this.canvasLayout.height / this.canvasLayout.scale).toFixed(2)
        return `${x} ${y} ${w} ${h}`
      },
    },
    mounted() {
    }
  }
</script>

<style>

</style>