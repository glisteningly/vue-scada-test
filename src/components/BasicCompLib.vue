<template>
  <div class="comps-list">
    <Drag class="comps-item"
          :transferData="{ aaa:123 }">
      <img src="/cdn/scada/ic-basic-comp/ScadaLabel.png">
    </Drag>
    <div class="comps-item"><img src="/cdn/scada/ic-basic-comp/ScadaLabel.png" alt=""></div>
    <div class="comps-item"><img src="/cdn/scada/ic-basic-comp/ScadaLabel.png" alt=""></div>
  </div>
</template>

<script>
  import { Drag } from 'vue-drag-drop'

  export default {
    name: 'BasicCompLib',
    components: { Drag }
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