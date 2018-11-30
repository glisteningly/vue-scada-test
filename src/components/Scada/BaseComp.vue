<script>
  import _ from 'lodash'

  export default {
    name: 'BaseComp',
    props: {
      comp: Object,
      defaultOptions: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    computed: {
      options() {
        return _.defaultsDeep({}, this.comp.options, this.defaultOptions)
      },
      values() {
        return _.defaultsDeep({}, this.value, this.defaultValue)
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