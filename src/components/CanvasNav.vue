<template>
  <div class="svg-wrapper">
    <svg :viewBox="svgViewBox" class="svg-container" @click="onClicked" ref="svgThumb">
      <clipPath id="myClip">
        <rect :x="viewportX"
              :y="viewportY"
              :width="viewportW"
              :height="viewportH"
              stroke="rgba(0, 255, 0)"
              stroke-width="8"
              fill="rgba(0, 0, 0, 0.3)">
        </rect>
      </clipPath>
      <rect width="100%" height="100%" :fill="docSettings.bgColor"></rect>
      <use x="0" y="0" xlink:href="#svg_root"></use>
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.4)"></rect>
      <use clip-path="url(#myClip)" x="0" y="0" xlink:href="#svg_root"></use>
      <rect :x="viewportX"
            :y="viewportY"
            :width="viewportW"
            :height="viewportH"
            fill="transparent"
            stroke="#20a0ff"
            stroke-width="10">
      </rect>
      <!--<rect :x="viewportX"-->
      <!--:y="viewportY"-->
      <!--:width="viewportW"-->
      <!--:height="viewportH"-->
      <!--stroke="rgba(0, 255, 0)"-->
      <!--stroke-width="8"-->
      <!--fill="rgba(0, 0, 0, 0.3)">-->
      <!--</rect>-->
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'CanvasNav',
    props: ['docSettings', 'canvasLayout'],
    methods: {
      onClicked(e) {
        const el = this.$refs.svgThumb
        const pos = {
          x: e.offsetX / el.clientWidth,
          y: e.offsetY / el.clientHeight
        }
        // console.log(pos)
        this.$emit('canvasPosNav', pos)
      },
      getViewportSize() {
        const el = document.getElementById('work_area')
        if (el) {
          return {
            width: el.clientWidth,
            height: el.clientHeight
          }
        } else {
          return {
            width: 1000,
            height: 600
          }
        }
        // const width = this.$refs['workCanvas'].clientWidth
        // const height = this.$refs['workCanvas'].clientHeight
        // return { width, height }
      }
    },
    computed: {
      svgViewBox() {
        return `0 0 ${this.docSettings.width} ${this.docSettings.height}`
      },
      viewportX() {
        return -this.canvasLayout.x / this.canvasLayout.scale
      },
      viewportY() {
        return -this.canvasLayout.y / this.canvasLayout.scale
      },
      viewportW() {
        return this.getViewportSize().width / this.canvasLayout.scale
      },
      viewportH() {
        return this.getViewportSize().height / this.canvasLayout.scale
      },
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