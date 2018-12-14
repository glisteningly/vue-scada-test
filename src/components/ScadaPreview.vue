<template>
  <component id="scada_view" :is="scadaView" :value="value"></component>
</template>

<script>
  import SvgColorFilter from '../components/SvgColorFilter'

  export default {

    components: { SvgColorFilter },
    name: 'ScadaPreview',
    props: {
      // comps: {
      //   type: Array
      // },
      tplStr: {
        type: String
      },
    },
    data() {
      return {
        scadaView: null,
        value: {
          aaa: {
            ccc1: {
              bbbb: 666
            }
          }
        }
      }
    },
    methods: {
      initScadaView(template) {
        this.scadaView = {
          name: 'scadaSvg',
          // extends: BaseScadaView,
          template: template,
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
      this.initScadaView(this.tplStr)
    },

  }
</script>

<style>

</style>