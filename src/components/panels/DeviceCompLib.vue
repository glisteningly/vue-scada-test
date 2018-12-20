<template>
  <div id="device_comp_panel">
    <ul class="comps-list">
      <li class="comps-item"
          :draggable="!imageError"
          @dragstart="drag($event)"
          @click="onCompClick()">
        <img :src="defaultImageUrl" @error="onImageLoadFailed" ref="defImg">
      </li>
      <!--<li v-for="comp in basicComps" :key="comp.type" class="comps-item"-->
      <!--draggable="true"-->
      <!--@dragstart="drag($event, comp)">-->
      <!--<img :src="getImagePath(comp.type)">-->
      <!--</li>-->
    </ul>
    <DeviceTypeList class="device-type-list"
                    @change="changeType"
                    :type="type"
                    :treedata="deviceTypeTree"
                    :showTypeName="false"/>
  </div>
</template>

<script>
  import basicCompDefs from '../../const/basicCompDefs'
  import { ScadaCompsLibrary } from '../Scada/index'
  import _ from 'lodash'
  import DeviceTypeList from '../DeviceSelector/DeviceTypeList'
  import StateStore from '../../mixin/StateStore'

  const holderImagePath = './images/holder.png'

  export default {
    name: 'DeviceCompLib',
    mixins: [StateStore],
    components: { DeviceTypeList },
    data() {
      return {
        basicComps: basicCompDefs,
        type: '',
        typeInfo: null,
        imageError: true,
        defaultImageLoading: false
      }
    },
    methods: {
      drag(e) {
        const img = this.$refs['defImg']

        if (!img) {
          return
        }

        const size = {
          width: img.naturalWidth / 4,
          height: img.naturalHeight / 4
        }

        const comp = {
          type: 'ScadaImage',
          layout: size,
          options: {
            param: {
              imgUrl: this.defaultImageUrl
            }
          }
        }
        comp.bindingValue = this.getCompDefaultOptions(comp.type)
        e.dataTransfer.setData('data', JSON.stringify(comp))
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

      },
      changeType(data) {
        this.typeInfo = data
        this.imageError = false
      },
      onImageLoadFailed() {
        // console.log('error')
        this.imageError = true
      }
    },
    computed: {
      defaultImageUrl() {
        if (_.has(this.typeInfo, 'label')) {
          return this.imageError ? holderImagePath : `/cdn/scada/device_tpl/${this.typeInfo.label}.png`
        } else {
          return holderImagePath
        }
      }
    }
  }
</script>

<style lang="scss">
  #device_comp_panel {
    height: 100%;
    display: flex;
    flex-direction: column;
    .comps-list {
      width: 180px;
      display: grid;
      grid-gap: 4px;
      grid-template-columns: repeat(3, 1fr);
      padding: 6px;

      .comps-item {
        display: flex;
        width: 58px;
        background-color: #DDD;
        height: 58px;
        border: 1px solid #222;
        img {
          max-width: 90%;
          max-height: 90%;
          padding: 5%;
          margin: auto auto;
          /*object-fit: contain;*/
          /*justify-content: center;*/
          /*align-content: center;*/
        }
        &.using {
          border: 1px solid #20a0ff;
          background-color: rgba(32, 160, 255, 0.15);
        }
      }
    }

    .device-type-list-root {
      border: none;
      border-top: 1px solid #222;
      .header {
        div.title {
          display: none;
        }
      }
      .device-type-tree.el-tree {
        margin: 0 6px 6px 6px;
        border: 1px solid #222;
      }
    }
  }

</style>