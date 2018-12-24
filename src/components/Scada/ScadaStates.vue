<template>
  <rect class="scada-comp scada-state"
        :fill="fillColor"
        :stroke="strokeColor"
        :stroke-width="options.style.strokeWidth"
        :transform="rectTransformStr"
        :width="comp.width * comp.scaleX"
        :height="comp.height * comp.scaleY"
        :rx="options.style.cornerRadius"
        :ry="options.style.cornerRadius"
        @click="onCompClicked"
        @mouseover="onCompMouseOver"/>
</template>

<script>
  import BaseComp from './BaseComp'

  const CompDefine = {
    style: {
      onColor: {
        label: 'ON-色',
        type: 'Color'
      },
      onStroke: {
        label: 'ON-边框',
        type: 'Color'
      },
      offColor: {
        label: 'OFF-色',
        type: 'Color'
      },
      offStroke: {
        label: 'OFF-边框',
        type: 'Color'
      },
    },
    param: {

    },
    binding: {
      val: {
        label: '状态显示'
      },
    }
  }

  export default {
    extends: BaseComp,
    name: 'ScadaStates',
    define: CompDefine,
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: 0
          }
        }
      },
      defaultOptions: {
        type: Object,
        default: function () {
          return {
            style: {
              onStroke: '#204000',
              offStroke: '#42000b',
              onColor: '#76d504',
              offColor: '#CE001C',
              strokeWidth: 2,
              cornerRadius: 0
            }
          }
        }
      }
    },
    computed: {
      strokeColor() {
        return this.values.val ? this.options.style.onStroke : this.options.style.offStroke
      },
      fillColor() {
        return this.values.val ? this.options.style.onColor : this.options.style.offColor
      }
    }
  }
</script>