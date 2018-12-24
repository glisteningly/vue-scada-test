<template>
  <g class="scada-comp scada-image-wrap"
     @click="onCompClicked"
     @mouseover="onCompMouseOver">
    <image v-if="this.values.val"
           class="scada-image"
           :class="alarmClass"
           :xlink:href="options.param.imgUrl"
           :transform="rectTransformStr"
           :width="comp.width * comp.scaleX"
           :height="comp.height * comp.scaleY"/>
    <rect class="scada-cover"
          rx="5"
          ry="5"
          stroke="transparent"
          stroke-width="2"
          fill="transparent"
          :transform="rectTransformStr"
          :width="comp.width * comp.scaleX"
          :height="comp.height * comp.scaleY"
    >
    </rect>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  const CompDefine = {
    param: {
      imgUrl: {
        label: '图片路径',
        type: 'String'
      }
    },
    binding: {
      val: {
        label: '图像可见'
      },
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaImage',
    define: CompDefine,
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: 1,
            alarm: 0
          }
        }
      },
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            param: {
              imgUrl: '',
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .scada-image-wrap {
    .scada-image {
      &.alarm {
        filter: url("#filter-red-overlay");
      }
    }
    &:hover {
      .scada-cover {
        fill: rgba(255, 255, 255, 0.1);
        stroke: rgba(32, 160, 255, 0.2);
      }
    }
  }
</style>