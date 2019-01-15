<template>
  <div id="basic_comp_panel">
    <label class="comp-cate-title">基本组件</label>
    <ul class="comps-list">
      <li class="comps-item"
          :title="comp.label"
          v-for="comp in basicComps"
          :key="comp.type"
          draggable="true"
          @dragstart="drag($event, comp)">
        <img :src="getImagePath(comp.type)">
      </li>
      <li class="comps-item"
          title="tube 管道 [P]"
          :class="{using: isPathUsing}"
          draggable="true"
          @click="onCompClick(tubeComp.type)"
          @dragstart="drag($event, tubeComp)">
        <img :src="getImagePath(tubeComp.type)">
      </li>
    </ul>
    <label class="comp-cate-title">组合模板</label>
    <ul class="comps-list">
      <li v-for="(tpl) in curTypeTpls" :key="tpl.id" class="comps-item">
        <div :title="tpl.name" class="tpl-wrap" draggable="true" @dragstart="dragTypeTpl($event, tpl)">
          <el-popover placement="bottom">
            <div>
              <el-button style="padding: 6px; font-size: 16px;"
                         :disabled="!canAddToTpl"
                         @click="updateTplConfirm(tpl.id)"
                         icon="el-icon-refresh"></el-button>
              <el-button type="danger"
                         style="padding: 6px; font-size: 16px;"
                         @click="deleteTplConfirm(tpl.id)"
                         icon="el-icon-delete"></el-button>
            </div>
            <TplSvgPreview :config="tpl.config" slot="reference"/>
          </el-popover>
        </div>
      </li>
      <li :title="addTplBtnHint" class="add-tpl-wrap">
        <button class="add-tpl-btn"
                :disabled="!canAddToTpl"
                @click="onAddTplClick">
          <img :src="addTplImagePath">
        </button>
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
  import TplService from '../../mixin/TplService'

  import TplSvgPreview from '../TplSvgPreview'

  export default {
    name: 'BasicCompLib',
    mixins: [StateStore, TplService],
    components: { TplSvgPreview },
    data() {
      return {
        basicComps: basicCompDefs,
        tubeComp: pathCompDefs[0],
        typeInfo: {
          name: 'user_custom',
          label: '自定义组件'
        },
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
        return `./images/ic-basic-comp/${type}.png`
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
      },
      onAddTplClick() {
        if (this.typeInfo && this.curSelComp) {
          this.publishTplConfirm()
        }
      }
    },
    computed: {
      isPathUsing() {
        return this.toolState === TOOL_STATE.addPathPoint
      },
      addTplBtnHint() {
        return (this.canAddToTpl) ? '添加为模板' : '选择成组组件或图像组件保存为模板'
      }
    },
    mounted() {
      this.getCurTypeTplList(this.typeInfo.name)
    }
  }
</script>

<style lang="scss" scoped>
  .comp-cate-title {
    display: inline-block;
    width: 100%;
    background-color: #2B2B2B;
    font-size: 13px;
    color: #DDD;
    padding: 3px 6px;
    letter-spacing: 0.5px;
    border-top: 1px solid #555;
    /*border-bottom: 1px solid #222;*/
  }

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