<template>
  <g>
    <component v-for="childrenComp in comp.children"
               :key="childrenComp.name"
               :is="childrenComp.type"
               :comp="childrenComp"
               :options="childrenComp.options"/>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  import ScadaImage from './image'
  import ScadaRect from './rect1'
  import ScadaLabel from './label'
  import ScadaGroup from './compGroup'

  export default {
    name: 'scadaGroup',
    components: { ScadaImage, ScadaRect, ScadaLabel, ScadaGroup },
    props: {
      options: Object
    },
    extends: BaseComp,
  }
</script>

<style scoped>

</style>