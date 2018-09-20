<script>
  export default {
    name: 'BaseComp',
    props: {
      options: Object,
      comp: Object,
    },
    computed: {
      // rectTransformStr() {
      //   return `translate(${this.layout.x - this.layout.offsetX * this.layout.scaleX} ${this.layout.y - this.layout.offsetY * this.layout.scaleY})
      //       rotate(${this.layout.rotation} ${this.layout.offsetX * this.layout.scaleX} ${this.layout.offsetY * this.layout.scaleY})`
      // }

      rectTransformStr() {
        return `translate(${this.comp.x - this.comp.offsetX * this.comp.scaleX} ${this.comp.y - this.comp.offsetY * this.comp.scaleY})
            rotate(${this.comp.rotation} ${this.comp.offsetX * this.comp.scaleX} ${this.comp.offsetY * this.comp.scaleY})`
      }
    }
  }
</script>

<style scoped>

</style>