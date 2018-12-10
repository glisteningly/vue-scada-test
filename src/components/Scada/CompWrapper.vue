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
      layout: Object,
      fixedLength: 3
    },
    computed: {
      gTransformStr() {
        return `translate(${this.layout.x - this.layout.offsetX * this.layout.scaleX} ${this.layout.y - this.layout.offsetY * this.layout.scaleY})
            rotate(${this.layout.rotation} ${this.layout.offsetX * this.layout.scaleX} ${this.layout.offsetY * this.layout.scaleY})
            scale(${this.layout.scaleX} ${this.layout.scaleY})`
      }
      // gTranslateX() {
      //   return (this.layout.x - this.layout.offsetX * this.layout.scaleX).toFixed(this.fixedLength)
      // },
      // gTranslateY() {
      //   return (this.layout.y - this.layout.offsetY * this.layout.scaleY).toFixed(this.fixedLength)
      // },
      // gRotationCenterX() {
      //   return (this.layout.offsetX * this.layout.scaleX).toFixed(this.fixedLength)
      // },
      // gRotationCenterY() {
      //   return (this.layout.offsetY * this.layout.scaleY).toFixed(this.fixedLength)
      // },
      // gRotationStr() {
      //   if (this.layout.rotation !== 0) {
      //     return `rotate(${this.layout.rotation} ${this.gRotationCenterX} ${this.gRotationCenterY})`
      //   } else {
      //     return ''
      //   }
      // },
      // gScaleX() {
      //   return (this.layout.scaleX).toFixed(this.fixedLength)
      // },
      // gTransformStr() {
      //   return `translate(${this.gTranslateX} ${this.gTranslateY})
      //       rotate(${this.layout.rotation} ${this.layout.offsetX * this.layout.scaleX} ${this.layout.offsetY * this.layout.scaleY})
      //       scale(${this.layout.scaleX} ${this.layout.scaleY})`
      // }
    }
  }
</script>

<style>

</style>