<template>
  <image class="scada-image"
         :class="alarmClass"
         :xlink:href="options.param.imgUrl"
         :transform="rectTransformStr"
         :width="comp.width * comp.scaleX"
         :height="comp.height * comp.scaleY"
         @click="onCompClicked"
         @mouseover="onCompMouseOver"/>
</template>

<script>
  import BaseComp from './BaseComp'

  const CompDefine = {
    param: {
      imgUrl: {
        label: '图片路径',
        type: 'String'
      }
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
  .scada-image {
    &.alarm {
      filter: url("#filter-red-overlay");
    }
  }

  /*.scada-image.alarm1 {*/
  /*filter: url("#filter-orange-overlay");*/
  /*}*/
</style>