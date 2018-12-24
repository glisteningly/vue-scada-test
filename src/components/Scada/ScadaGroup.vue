<template>
  <g class="scada-comp scada-group" @click="onCompClicked"
     @mouseover="onCompMouseOver">
    <slot></slot>
    <rect class="scada-cover"
          rx="5"
          ry="5"
          stroke="transparent"
          stroke-width="2"
          fill="transparent"
          :transform="rectTransformStr"
          :width="comp.width * comp.scaleX"
          :height="comp.height * comp.scaleY">
    </rect>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    name: 'ScadaGroup',
    props: {},
    extends: BaseComp,
  }
</script>

<style lang="scss">
  .scada-cover {
    &:hover {
      fill: rgba(255, 255, 255, 0.1);
      stroke: rgba(32, 160, 255, 0.2);
    }
  }

</style>