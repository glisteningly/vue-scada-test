<template>
  <g @click="onCompClicked"
     @mouseover="onCompMouseOver">
    <slot></slot>
  </g>
</template>

<script>
  import BaseComp from './BaseComp'

  export default {
    name: 'ScadaGroup',
    props: {
    },
    extends: BaseComp,
  }
</script>

<style>

</style>