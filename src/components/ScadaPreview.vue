<template>
  <component id="scada_view" :is="scadaView"></component>
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
        scadaView: null
      }
    },
    methods: {
      initScadaView(template) {
        this.scadaView = {
          // extends: BaseScadaView,
          template: template,
          // props: {
          //   value: {
          //     type: Object
          //   }
          // }
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

<style scoped>

</style>