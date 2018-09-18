<template>
  <g :width="layout.width"
     :height="layout.height"
     :transform="gTransformStr">
    <slot></slot>
  </g>
</template>

<script>
  export default {
    name: 'CompWrapper',
    props: {
      layout: Object
    },
    computed: {
      gTransformStr() {
        return `translate(${this.layout.x - this.layout.offsetX * this.layout.scaleX} ${this.layout.y - this.layout.offsetY * this.layout.scaleY})
            rotate(${this.layout.rotation} ${this.layout.offsetX * this.layout.scaleX} ${this.layout.offsetY * this.layout.scaleY})
            scale(${this.layout.scaleX} ${this.layout.scaleY})`
      }
    }
  }
</script>

<style scoped>

</style>