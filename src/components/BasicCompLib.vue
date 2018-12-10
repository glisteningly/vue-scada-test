<template>
  <div class="comps-list">
    <div class="comps-item"
         draggable="true"
         @dragstart="drag($event)">
      <img src="/cdn/scada/ic-basic-comp/ScadaLabel.png">
    </div>
    <!--<drag class="comps-item"-->
    <!--:transferData="{aaa:111 }">-->
    <!--<img src="/cdn/scada/ic-basic-comp/ScadaLabel.png">-->
    <!--</drag>-->
    <div class="comps-item"><img src="/cdn/scada/ic-basic-comp/ScadaLabel.png" alt=""></div>
    <div class="comps-item"><img src="/cdn/scada/ic-basic-comp/ScadaLabel.png" alt=""></div>
  </div>
</template>

<script>
  import { Drag } from 'vue-drag-drop'

  export default {
    name: 'BasicCompLib',
    components: { Drag },
    methods: {
      drag(e) {
        // console.log(e)
        e.dataTransfer.setData('data', JSON.stringify({ type: 'ScadaLabel' }))
        // e.data = { aaa: 111 }
        // console.log(e)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .comps-list {
    width: 180px;
    display: grid;
    grid-gap: 4px;
    grid-template-columns: repeat(3, 1fr);
    padding: 6px;

    .comps-item {
      width: 58px;
      background-color: #333;
      height: 58px;
      border: 1px solid #222;
      img {
        width: 100%;
      }
    }

  }
</style>