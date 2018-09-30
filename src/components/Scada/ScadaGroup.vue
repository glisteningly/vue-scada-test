<template>
  <g>
    <component v-for="childrenComp in comp.children"
               :key="childrenComp.name"
               :is="childrenComp.type"
               :comp="childrenComp"
               />
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    name: 'ScadaGroup',
    // props: {
    //   options: Object
    // },
    extends: BaseComp,
  }
</script>

<style scoped>

</style>