<template>
  <component id="scada_view" :is="scadaView" :value="value"></component>
</template>

<script>
  import SvgColorFilter from '../components/SvgColorFilter'

  import ScadaVueTpl from '../utils/scadaVueTpl'

  export default {

    components: { SvgColorFilter },
    name: 'ScadaPreview',
    props: {
      scadaDoc: null
    },
    data() {
      return {
        scadaView: null,
        value: null
      }
    },
    methods: {
      initMappingData() {
        const queryConfig = ScadaVueTpl.getQueryConfig(this.scadaDoc.comps)
        this.value = ScadaVueTpl.generateMappingObj(queryConfig)
      },

      initScadaView() {
        const tpl = ScadaVueTpl.getTplStr(this.scadaDoc.comps, this.scadaDoc.docSettings)

        this.scadaView = {
          name: 'scadaSvg',
          // extends: BaseScadaView,
          template: tpl,
          props: {
            value: {
              type: Object
            }
          }
        }
      }
    },
    computed: {},
    mounted() {
    },
    created() {
      this.initMappingData()
      this.initScadaView()
    },

  }
</script>

<style>

</style>