<template>
  <svg id="svg_scada_view"
       style="position: absolute; left: 0;top: 0;"
       :width="canvasLayout.width"
       :height="canvasLayout.height"
       :viewBox="svgViewbox">
    <svg id="svg_root" overflow="visible">
      <SvgColorFilter/>
      <component v-for="comp in comps"
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
      return {}
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

<style scoped>

</style>