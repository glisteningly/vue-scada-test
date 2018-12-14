<template>
  <div class="svg-wrapper">
    <svg :viewBox="svgViewBox" class="svg-container" @click="onClicked" ref="svgThumb">
      <rect width="100%" height="100%" :fill="docSettings.bgColor"></rect>
      <use x="0" y="0" xlink:href="#svg_root"></use>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'CanvasNav',
    props: ['docSettings'],
    methods: {
      onClicked(e) {
        const el = this.$refs.svgThumb
        const pos = {
          x: e.offsetX / el.clientWidth,
          y: e.offsetY / el.clientHeight
        }
        console.log(pos)
      }
    },
    computed: {
      svgViewBox() {
        return `0 0 ${this.docSettings.width} ${this.docSettings.height}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .svg-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    border-bottom: 1.5px solid #2B2B2B;
    .svg-container {
      width: 90%;
      border: 0.5px solid #888;
    }
  }
</style>