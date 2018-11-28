<template>
  <div class="svg-wrapper">
    <svg viewBox="0 0 1000 600" class="svg-container" @click="onClicked" ref="svgThumb">
      <rect width="100%" height="100%" fill="#2B2B2B"></rect>
      <use x="0" y="0" xlink:href="#svg_root"></use>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'CanvasNav',
    methods: {
      onClicked(e) {
        const el = this.$refs.svgThumb
        const pos = {
          x: e.offsetX / el.clientWidth,
          y: e.offsetY / el.clientHeight
        }
        console.log(pos)
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