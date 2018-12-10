<template>
  <g>
    <component v-for="childrenComp in comp.children"
               :key="childrenComp.name"
               :is="childrenComp.type"
               :bindingValue="childrenComp.bindingValue"
               :comp="childrenComp"/>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    name: 'ScadaGroupWrap',
    props: {
      defaultValue: {
        type: Object,
        default: function () {
          return {
            val: null,
          }
        }
      },
    },
    extends: BaseComp,
  }
</script>

<style>

</style>