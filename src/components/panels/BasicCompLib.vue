<template>
  <div class="basic_comp_panel">
    <ul class="comps-list">
      <li v-for="comp in basicComps" :key="comp.type" class="comps-item"
          draggable="true"
          @dragstart="drag($event, comp)">
        <img :src="getImagePath(comp.type)">
      </li>
      <li class="comps-item"
          :class="{using: isPathUsing}"
          draggable="true"
          @click="onCompClick(tubeComp.type)"
          @dragstart="drag($event, tubeComp)">
        <img :src="getImagePath(tubeComp.type)">
      </li>
    </ul>
  </div>
</template>

<script>
  import basicCompDefs from '../../const/basicCompDefs'
  import pathCompDefs from '../../const/pathCompDefs'
  import { ScadaCompsLibrary } from '../Scada/index'
  import { TOOL_STATE } from '../../const'

  import StateStore from '../../mixin/StateStore'

  export default {
    name: 'BasicCompLib',
    mixins: [StateStore],
    data() {
      return {
        basicComps: basicCompDefs,
        tubeComp: pathCompDefs[0]
      }
    },
    methods: {
      drag(e, comp) {
        // console.log(e)
        comp.bindingValue = this.getCompDefaultOptions(comp.type)
        e.dataTransfer.setData('data', JSON.stringify(comp))
        // e.data = { aaa: 111 }
        // console.log(e)
      },
      getImagePath(type) {
        return `/images/ic-basic-comp/${type}.png`
      },
      getCompDefaultOptions(compType) {
        if (ScadaCompsLibrary[compType]) {
          if (_.has(ScadaCompsLibrary[compType], ['props', 'defaultValue'])) {
            return ScadaCompsLibrary[compType].props.defaultValue.default() || {}
          }
        }
        return null
      },
      onCompClick(type) {
        switch (type) {
          case 'ScadaTube':
            this.toolState = TOOL_STATE.addPathPoint
            break
        }
      }
    },
    computed: {
      isPathUsing() {
        return this.toolState === TOOL_STATE.addPathPoint
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
      &.using {
        border: 1px solid #20a0ff;
        background-color: rgba(32, 160, 255, 0.15);
      }
    }

  }
</style>