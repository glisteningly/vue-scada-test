<script>
  import _ from 'lodash'

  export default {
    name: 'BaseComp',
    props: {
      // options: Object,
      comp: Object,
      defaultOptions: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    computed: {
      // rectTransformStr() {
      //   return `translate(${this.layout.x - this.layout.offsetX * this.layout.scaleX} ${this.layout.y - this.layout.offsetY * this.layout.scaleY})
      //       rotate(${this.layout.rotation} ${this.layout.offsetX * this.layout.scaleX} ${this.layout.offsetY * this.layout.scaleY})`
      // }
      options() {
        // return this.comp.options
        return _.defaultsDeep({}, this.comp.options, this.defaultOptions)
      },

      rectTransformStr() {
        return `translate(${this.comp.x - this.comp.offsetX * this.comp.scaleX} ${this.comp.y - this.comp.offsetY * this.comp.scaleY})
            rotate(${this.comp.rotation} ${this.comp.offsetX * this.comp.scaleX} ${this.comp.offsetY * this.comp.scaleY})`
      }
    }
  }
</script>

<style scoped>

</style>