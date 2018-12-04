<template>
  <g>
    <component v-for="childrenComp in comp.children"
               :key="childrenComp.name"
               :is="childrenComp.type"
               :value="childrenComp.value"
               :comp="childrenComp"
    />
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    name: 'ScadaGroup',
    props: {
      value: {
        type: Object
      }
      // options: Object
    },
    extends: BaseComp,
  }
</script>

<style scoped>

</style>