<template>
  <div id="device_comp_panel">
    <ul class="comps-list">
      <li title="默认模板"
          class="comps-item"
          :style="defaultTplStyle"
          draggable="false"
          @dragstart="dragDefault($event)">
        <img :src="defaultImageUrl" @error="onImageLoadFailed" ref="defImg">
      </li>
      <li v-for="(tpl,index) in curTypeTpls" :key="index" class="comps-item"
          draggable="true"
          @dragstart="dragTypeTpl($event, tpl)">
        <div class="tpl-preview">
          <svg class="tpl-preview-svg" :viewBox="getViewBox(tpl.config)">
            <component :is="tpl.preview.type"
                       :comp="tpl.preview"/>
          </svg>
          <div class="tpl-preview-cover"></div>
        </div>
      </li>
      <li title="添加为模板"
          class="add-tpl">
        <button class="add-tpl-btn"
                :disabled="!canAddToTpl || !typeInfo || isShowInsList"
                @click="onAddTplClick">
          <img :src="addTplImagePath">
        </button>
      </li>
    </ul>
    <div class="device-list-ctrl">
      <el-button :disabled="!typeInfo"
                 v-if="!isShowInsList"
                 size="mini"
                 @click="isShowInsList=true">
        查看实例 ( {{curTypeInsCount}} )
      </el-button>
      <el-button v-else size="mini" @click="isShowInsList=false" icon="el-icon-arrow-left">返回类型列表</el-button>
    </div>
    <DeviceTypeList v-show="!isShowInsList"
                    class="device-type-list"
                    @change="changeType"
                    :treedata="deviceTypeTree"
                    :showTypeName="false"/>
    <DeviceInsList v-show="isShowInsList"
                   class="device-ins-list"
                   @change="changeIns"
                   @instanceCountChange="onInstanceCountChange"
                   :type="curSeltype"/>
  </div>
</template>

<script>
  import basicCompDefs from '../../const/basicCompDefs'
  import { ScadaCompsLibrary } from '../Scada/index'
  import _ from 'lodash'
  import DeviceTypeList from '../DeviceSelector/DeviceTypeList'
  import DeviceInsList from '../DeviceSelector/DeviceInsList'
  import StateStore from '../../mixin/StateStore'

  const holderImagePath = './images/icons/ic-comp-no-preview.png'
  const addTplImagePath = './images/icons/ic-comp-add-tpl.png'

  import CompCtrl from '../../class/CompCtrl'
  import utils from '../../utils'


  export default {
    name: 'DeviceCompLib',
    mixins: [StateStore],
    components: { DeviceTypeList, DeviceInsList },
    props: {
      canAddToTpl: {
        type: Boolean,
        default: false
      },
      curSelComp: {
        type: Object
      }
    },
    data() {
      return {
        basicComps: basicCompDefs,
        curSeltype: '',
        curSelInstanceUid: '',
        typeInfo: null,
        imageError: true,
        defaultImageLoading: false,
        addTplImagePath: addTplImagePath,
        curTypeTpls: [],
        isShowInsList: false,
        curTypeInsCount: 0,
      }
    },
    methods: {
      dragDefault(e) {
        const img = this.$refs['defImg']

        if (!img || this.imageError) {
          return
        }

        const scale = (img.naturalWidth / 4 < 20 || img.naturalHeight / 4 < 20) ? 2 : 4

        const size = {
          width: img.naturalWidth / scale,
          height: img.naturalHeight / scale
        }

        const config = {
          type: 'ScadaImage',
          layout: size,
          options: {
            param: {
              imgUrl: this.defaultImageUrl
            }
          }
        }
        config.bindingValue = this.getCompDefaultOptions(config.type)
        e.dataTransfer.setData('data', JSON.stringify(config))
      },
      dragTypeTpl(e, tpl) {
        const config = _.cloneDeep(tpl.config)
        config.bindingValue = this.getCompDefaultOptions(config.type)

        if (this.curSelInstanceUid && (config.type === "ScadaGroupWrap")) {
          utils.setGroupBinding(config, { uid: this.curSelInstanceUid })
        }

        e.dataTransfer.setData('data', JSON.stringify(config))
      },
      getCompDefaultOptions(compType) {
        if (ScadaCompsLibrary[compType]) {
          if (_.has(ScadaCompsLibrary[compType], ['props', 'defaultValue'])) {
            return ScadaCompsLibrary[compType].props.defaultValue.default() || {}
          }
        }
        return null
      },
      changeType(typeInfo) {
        this.typeInfo = typeInfo
        this.imageError = false
        this.curSeltype = typeInfo.name
        this.curSelInstanceUid = ''
      },
      changeIns(insInfo) {
        // console.log(insInfo)
        this.curSelInstanceUid = insInfo.uid
      },
      onInstanceCountChange(count) {
        this.curTypeInsCount = count
      },
      onImageLoadFailed() {
        // console.log('error')
        this.imageError = true
      },
      onAddTplClick() {
        if (this.typeInfo && this.curSelComp) {
          // this.$emit('addTplBtnClick', this.typeInfo)
          const tplConfig = this.curSelComp.toConfig()
          tplConfig.layout.x = 0
          tplConfig.layout.y = 0
          // console.log(tplConfig)

          const newTpl = {
            config: tplConfig,
            type: this.typeInfo.name,
            preview: new CompCtrl(tplConfig, false)
          }

          this.curTypeTpls.push(newTpl)
        }
      },
      getViewBox(config) {
        return `0 0 ${config.layout.width * config.layout.scaleX} ${config.layout.height * config.layout.scaleY}`
      }
    },
    computed: {
      defaultImageUrl() {
        if (_.has(this.typeInfo, 'label')) {
          return this.imageError ? holderImagePath : `/cdn/scada/device_tpl/${this.typeInfo.label}.png`
        } else {
          return holderImagePath
        }
      },
      defaultTplStyle() {
        if (this.imageError) {
          return {
            cursor: 'not-allowed'
          }
        } else {
          return null
        }
      }
    },
    watch: {
      isShowInsList(val) {
        if (!val) {
          this.curSelInstanceUid = ''
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
        background-color: #333;
        height: 58px;
        border: 1px solid #222;
        user-select: none;
        img {
          max-width: 90%;
          max-height: 90%;
          padding: 5%;
          margin: auto auto;
        }
        .tpl-preview {
          position: relative;
          width: 100%;
          height: 100%;
          .tpl-preview-svg {
            position: absolute;
            margin: 5%;
            width: 90%;
            height: 90%;
          }
          .tpl-preview-cover {
            width: 100%;
            height: 100%;
            position: absolute;
          }
        }
      }
      .add-tpl {
        padding: 1px;
        width: 58px;
        height: 58px;
        button.add-tpl-btn {
          outline: none;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          background: none;
          border: none;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
          &:disabled {
            img {
              filter: grayscale(100%) opacity(30%);
            }
            &:hover {
              cursor: not-allowed;
            }
          }
        }
      }
    }

    .device-list-ctrl {
      padding: 0 6px;
      margin-bottom: 4px;
      .el-button {
        font-weight: normal;
        font-size: 13px;
        width: 100%;
        letter-spacing: 0.5px;
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

    .device-type-list {

    }

    .device-instance-list-root {
      border: none;
      border-top: 1px solid #222;
      background-color: #3C3F41;
      font-size: 13px;
      .header {
        div.title {
          display: none;
        }
      }
      .list-container {
        margin: 0 6px 6px 6px;
        border: 1px solid #222;
        background-color: #333;
      }
      .device-instance-item {
        border-bottom: 1px solid #222;
        &.header {
          display: none;
        }
        flex-direction: column;
        .ins-label {
          font-size: 13px;
        }
        .ins-location {
          margin-top: 2px;
          margin-left: 15px;
          color: #888;
          font-size: 12px;
        }
      }
    }
  }

</style>