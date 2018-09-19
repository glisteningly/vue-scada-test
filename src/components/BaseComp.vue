<script>
  export default {
    name: 'BaseComp',
    props: {
      layout: Object,
      options: Object
    },
    computed: {
      rectTransformStr() {
        return `translate(${this.layout.x - this.layout.offsetX * this.layout.scaleX} ${this.layout.y - this.layout.offsetY * this.layout.scaleY})
            rotate(${this.layout.rotation} ${this.layout.offsetX * this.layout.scaleX} ${this.layout.offsetY * this.layout.scaleY})`
      }
    }
  }
</script>

<style scoped>

</style>