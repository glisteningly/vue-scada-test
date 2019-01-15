<template>
  <div id="main_frame">
    <section id="scada_editor">
      <header>
        <div class="toolbar">
          <img class="app-logo" :src="'./images/icons/ic-main-logo.png'"/>
          <span class="toolbar-gutter-h"/>
          <ImgButton title="文档设置" :icon="'ic-action-settings'" @click="isShowSettingsDialog=true"/>
          <span class="toolbar-gutter-h"/>
          <ImgButton title="帮助" :icon="'ic-action-help'" @click="isShowHelpDialog=true"/>
          <span class="toolbar-gutter-h"/>
          <div class="img-btn-group">
            <ImgButton title="暂存" :icon="'ic-action-save-local'" @click="onActionSaveDocLocal"/>
            <ImgButton title="读取暂存" :icon="'ic-action-load-local'" @click="onActionLoadDocLocal"/>
          </div>

          <!--<el-button @click="addCompGroup">add group</el-button>-->
          <!--<el-button @click="unGroupToComps">ungroup</el-button>-->
          <!--<el-button @click="showNodeZIndex">z index</el-button>-->
          <span class="toolbar-gutter-h"/>
          <label class="zoom-label">{{ canvasZoom | numPercent }}</label>
          <el-button title="画布缩小" @click="zoomOut" class="zoom-btn"><i class="el-icon-minus"></i></el-button>
          <el-button title="原始尺寸" @click="zoom100" class="zoom-btn" style="margin-left: 0">100%</el-button>
          <el-button title="画布放大" @click="zoomIn" class="zoom-btn" style="margin-left: 0"><i class="el-icon-plus"></i>
          </el-button>
          <el-button title="适合屏幕" @click="zoomFit" class="zoom-btn"><i class="el-icon-rank"></i></el-button>

          <span class="toolbar-gutter-h"/>
          <ImgButton title="刷新" :icon="'ic-action-refresh'" @click="initKonvaWorkArea"/>

          <div class="toolbar-center">
            <div class="img-btn-group">
              <ImgButton :disabled="!canUndo" title="撤销" :icon="'ic-action-undo'" @click="undo"/>
              <ImgButton :disabled="!canRedo" title="重做" :icon="'ic-action-redo'" @click="redo"/>
            </div>
            <span class="toolbar-gutter-h"/>
            <div class="img-btn-group">
              <ImgButton title="移至顶层" :icon="'ic-move-top'" @click="compsMoveTop"/>
              <ImgButton title="移至底层" :icon="'ic-move-bottom'" @click="compsMoveBottom"/>
            </div>
            <span class="toolbar-gutter-h"/>
            <el-popover>
              <div id="align_panel">
                <div class="align-panel-direct">
                  <label>水平对齐:</label>
                  <div class="img-btn-group">
                    <ImgButton :icon="'ic-align-left'" @click="compsAlignL"/>
                    <ImgButton :icon="'ic-align-h-center'" @click="compsAlignHC"/>
                    <ImgButton :icon="'ic-align-right'" @click="compsAlignR"/>
                  </div>
                </div>
                <div class="align-panel-direct">
                  <label>垂直对齐:</label>
                  <div class="img-btn-group">
                    <ImgButton :icon="'ic-align-top'" @click="compsAlignT"/>
                    <ImgButton :icon="'ic-align-v-center'" @click="compsAlignVC"/>
                    <ImgButton :icon="'ic-align-bottom'" @click="compsAlignB"/>
                  </div>
                </div>
              </div>
              <ImgButton title="对齐" slot="reference" :icon="'ic-align'" :disabled="!multiCompsSelected"/>
            </el-popover>

            <span class="toolbar-gutter-h"/>
            <ImgButton title="全部解锁" :icon="'ic-action-unlock-all'" @click="doUnlockAll"/>
            <span class="toolbar-gutter-h"/>
            <!--<el-switch v-model="isAnimationEnabled"></el-switch>-->
            <ImgButton v-show="!isAnimationEnabled" title="打开动画预览" :icon="'ic-action-anime-enable'"
                       @click="isAnimationEnabled = true"/>
            <ImgButton v-show="isAnimationEnabled" title="关闭动画预览" :icon="'ic-action-anime-disable'"
                       @click="isAnimationEnabled = false"/>
            <!--<el-switch v-model="debug_hideCanvas"></el-switch>-->
          </div>
          <div class="toolbar-right">
            <ImgButton title="预览" :icon="'ic-action-preview'" @click="doPreview"/>
            <ImgButton title="保存" :icon="'ic-action-save'" @click="onActionSaveDraft"/>
            <el-button @click="onPublishDoc" class="publish" type="primary" icon="el-icon-upload">发布</el-button>
          </div>
        </div>
      </header>
      <main>
        <div id="left_sidebar">
          <el-tabs v-model="activeLeftTab" type="card">
            <el-tab-pane label="组件" name="basicComp">
              <BasicCompLib :canAddToTpl="canAddToTpl"
                            :curSelComp="curSelComp"/>
            </el-tab-pane>
            <el-tab-pane label="设备" name="deviceComp">
              <DeviceCompLib :canAddToTpl="canAddToTpl"
                             :curSelComp="curSelComp"/>
            </el-tab-pane>
            <el-tab-pane label="图层" name="layer">
              <LayerPanel :treedata="comps"
                          :curNode="curSelCompUid"
                          @layerCompClick="onLayerCompClick"
                          @layerCompDroped="onLayerCompDroped"/>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div id="work_area" v-loading="isDocLoading"
             element-loading-text="文档加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.5)">
          <div id="work_frame" :style="workFrameBgColor">
            <SvgScadaView :comps="comps" :canvasLayout="canvasLayout" :dataBinding="dataBinding"></SvgScadaView>
            <div id="work_canvas" @contextmenu.prevent="$refs.ctxMenu.open" ref="workCanvas"
                 v-show="!debug_hideCanvas" @dragover.prevent @drop="handleCompDrop($event)"
                 @wheel="onCanvasMouseWheel"></div>
          </div>
        </div>
        <div id="right_sidebar">
          <el-tabs v-model="activeRightTab" type="card">
            <el-tab-pane label="变换" name="transform">
              <div id="layout_panel" class="ctrl-panel">
                <div v-if="curSelComp">
                  <div v-if="curSelComp.isChild && curSelComps.length === 1">
                    <span class="type-hint"><i class="el-icon-info"></i> 子组件不可直接变换</span>
                  </div>
                  <div v-if="curSelComps.length > 1">
                    <span class="type-hint"><i class="el-icon-info"></i> 多选组件不可直接变换</span>
                  </div>
                  <div v-if="curSelCompLayout && !curSelComp.isChild && curSelComps.length === 1">
                    <div>
                      <label>位置</label>
                      <span class="layout_panel_label">X:</span>
                      <el-input-number :controls=false class="layout-input" v-model.number="curSelCompLayoutX">
                      </el-input-number>
                      <span class="layout_panel_label">Y:</span>
                      <el-input-number :controls=false class="layout-input" v-model.number="curSelCompLayoutY">
                      </el-input-number>
                    </div>
                    <div>
                      <label>尺寸</label>
                      <span class="layout_panel_label">W:</span>
                      <el-input-number :controls=false class="layout-input" v-model.number="curSelCompLayoutW">
                      </el-input-number>
                      <span class="layout_panel_label">H:</span>
                      <el-input-number :controls=false class="layout-input" v-model.number="curSelCompLayoutH">
                      </el-input-number>
                    </div>
                    <div>
                      <label>旋转</label>
                      <span class="layout_panel_label">R:</span>
                      <el-input-number :controls=false class="layout-input" v-model.number="curSelCompLayoutR">
                      </el-input-number>
                      <span style="margin-left: 26px;"><el-checkbox v-model="curSelComp.locked">锁定</el-checkbox></span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <span class="type-hint"><i class="el-icon-info"></i> 未选择组件</span>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="导航" name="nav">
              <CanvasNav :docSettings="docSettings"
                         :canvasLayout="canvasLayout"
                         @canvasPosNav="onCanvasPosNav"/>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="activeBindingTab" type="card" v-show="curSelComp">
            <el-tab-pane label="数据绑定" name="binding">
              <BindingPanel :selComps="curSelComps"
                            @compBindingChanged="onCompBindingChanged"
                            @compOptionsChanged="onCompOptionsChanged"
                            @compGroupChildBinding="onCompGroupChildBinding"
                            @compValChanged="onCompValChanged"/>
            </el-tab-pane>
            <el-tab-pane label="事件绑定" name="event">
              <EventPanel :selComps="curSelComps"
                          :optionCategory="'param'"
                          @compBidChanged="onCompBidChanged"
                          @compEventMsgChanged="onCompEventMsgChanged"/>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="activeOptionsTab" type="card" v-show="curSelComp">
            <el-tab-pane label="样式" name="style">
              <OptionPanel :optionCategory="'style'" :selComps="curSelComps"
                           @compOptionsChanged="onCompOptionsChanged"/>
            </el-tab-pane>
            <el-tab-pane label="参数" name="param">
              <OptionPanel :optionCategory="'param'" :selComps="curSelComps"
                           @compOptionsChanged="onCompOptionsChanged"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </main>
      <!--<footer>-->
      <!--</footer>-->
    </section>
    <context-menu id="context-menu" ref="ctxMenu">
      <li>
        <button :disabled="!canDoSelCompAction" @click="copyCompsTolocalStorage"><label>复制</label><span
            class="hotkey-hint">Ctrl+C</span></button>
      </li>
      <li>
        <button @click="loadCompsFromlocalStorage"><label>粘贴</label><span class="hotkey-hint">Ctrl+V</span></button>
      </li>
      <li>
        <button :disabled="!canDoSelCompAction" @click="doLockComp">
          <label>锁定</label><span class="hotkey-hint">Ctrl+L</span>
        </button>
      </li>
      <li>
        <button :disabled="!canDoSelCompAction" @click="doUnlockComp">
          <label>解除锁定</label><span class="hotkey-hint">Ctrl+Shift+L</span>
        </button>
      </li>
      <hr>
      <li>
        <button @click="zoomIn">
          <label>放大</label><span class="hotkey-hint">Ctrl+=</span>
        </button>
      </li>
      <li>
        <button @click="zoomOut">
          <label>缩小</label><span class="hotkey-hint">Ctrl+-</span>
        </button>
      </li>
      <li>
        <button @click="zoom100">
          <label>原始尺寸</label><span class="hotkey-hint">Ctrl+9</span>
        </button>
      </li>
      <li>
        <button @click="zoomFit">
          <label>适合画布</label><span class="hotkey-hint">Ctrl+0</span>
        </button>
      </li>
      <hr>
      <!--<li v-if="canDoSelCompAction">-->
      <!--<button @click="compsMoveTop"><label>置于顶层</label></button>-->
      <!--</li>-->
      <li>
        <button :disabled="!canDoSelCompAction" @click="compsMoveTop">
          <label>置于顶层</label>
          <span class="hotkey-hint">Ctrl+Shift+]</span>
        </button>
      </li>
      <li>
        <button :disabled="!canDoSelCompAction" @click="compsMoveBottom">
          <label>置于底层</label>
          <span class="hotkey-hint">Ctrl+Shift+[</span>
        </button>
      </li>
      <li>
        <button :disabled="!multiCompsSelected" @click="jointCompsToGroup">
          <label>编组</label>
          <span class="hotkey-hint">Ctrl+G</span>
        </button>
      </li>
      <li>
        <button :disabled="!canUnGroupComps" @click="unGroupToComps">
          <label>取消编组</label>
          <span class="hotkey-hint">Ctrl+Shift+G</span>
        </button>
      </li>
    </context-menu>
    <!--<div id="dianji">点击查看</div>-->
    <div id="scada_preview" v-if="showPreview">
      <el-button class="close" type="danger" @click="showPreview = false"><i class="el-icon-close"></i></el-button>
      <!--<ScadaPreview :tplStr="previewTplStr"/>-->
      <VisScadaAdapter :config="scadaDoc" :isPreviewMode="true"/>
    </div>
    <SettingsDialog :isShowDialog.sync="isShowSettingsDialog"
                    @dialogClose="isShowSettingsDialog=false"
                    @settingsChanged="onSettingsChanged"
                    :config="docSettings"/>
    <HelpDialog :isShowDialog.sync="isShowHelpDialog"
                @dialogClose="isShowHelpDialog=false"/>
  </div>
</template>

<script>

  import _ from 'lodash'
  // import hotkeys from 'hotkeys-js'

  import ContextMenu from 'vue-context-menu'

  import CompCtrl from '../class/CompCtrl'

  import { Drop } from 'vue-drag-drop'

  import CommonUtils from '../mixin/CommonUtils'
  import ComputeLayout from '../mixin/ComputeLayout'
  import Keyboard from '../mixin/Keyboard'
  import InitKonva from '../mixin/InitKonva'
  import InitConfig from '../mixin/InitConfig'
  import InitCompCtrl from '../mixin/InitCompCtrl'

  import ActionAlign from '../mixin/ActionAlign'
  import ActionMove from '../mixin/ActionMove'
  import ActionCanvas from '../mixin/ActionCanvas'
  import ActionGroup from '../mixin/ActionGroup'
  import ActionDocument from '../mixin/ActionDocument'
  import ActionAnimated from '../mixin/ActionAnimated'
  import StateStore from '../mixin/StateStore'
  import DocSettings from '../mixin/DocSettings'
  import LayerComps from '../mixin/LayerComps'
  import CurSelCompsComputed from '../mixin/CurSelCompsComputed'
  import ActionCmdHistory from '../mixin/ActionCmdHistory'


  import DataBinding from '../mixin/DataBinding'


  import BindingPanel from './panels/BindingPanel'
  import EventPanel from './panels/EventPanel'
  import OptionPanel from './panels/OptionPanel'
  import BasicCompLib from './panels/BasicCompLib'
  import DeviceCompLib from './panels/DeviceCompLib'
  import LayerPanel from './panels/LayerPanel'

  import ImgButton from '../components/ImgButton'
  import SvgScadaView from '../components/SvgScadaView'
  import CanvasNav from '../components/CanvasNav'
  import SettingsDialog from '../components/SettingsDialog'
  import HelpDialog from '../components/HelpDialog'

  import VisScadaAdapter from '../components/VisScadaAdapter'

  import ScadaVueTpl from './scadaVueTpl'

  import { TOOL_STATE, ZOOM_SCALE_SETTING } from '../const'


  export default {
    components: {
      Drop,
      ContextMenu,
      BindingPanel,
      EventPanel,
      OptionPanel,
      LayerPanel,
      ImgButton,
      SvgScadaView,
      CanvasNav,
      VisScadaAdapter,
      BasicCompLib,
      DeviceCompLib,
      SettingsDialog,
      HelpDialog
    },
    mixins: [
      CommonUtils,
      CurSelCompsComputed,
      InitKonva,
      InitConfig,
      InitCompCtrl,
      ComputeLayout,
      Keyboard,
      ActionDocument,
      ActionAnimated,
      ActionAlign,
      ActionMove,
      ActionCanvas,
      ActionGroup,
      DataBinding,
      StateStore,
      DocSettings,
      LayerComps,
      InitCompCtrl,
      ActionCmdHistory
    ],
    name: 'MainEditor',
    data() {
      return {
        // toolState: '',
        inited: false,
        comps: [],
        canvasLayout: {
          width: 0,
          height: 0,
          x: 20,
          y: 20,
          scale: ZOOM_SCALE_SETTING[5],
        },
        zoomScaleIndex: 5,
        konvaObjs: {
          stage: null,
          dragLayer: null,
          layers: [],
          transformer: null,
          groupTransformer: null,
          selCompsGroup: null,
          selCompsRect: null,
          paperRect: null,
          pathAuxLine: null,
        },
        curSelComps: [],
        curSelCompsCopied: [],
        groupLastPos: { x: 0, y: 0 },
        isDragSelecting: false,
        testData: 2,
        curSelCompStyleOptions: {},
        curFixedPathPoint: null,
        activeLeftTab: 'basicComp',
        // activeLeftTab: 'layer',
        activeRightTab: 'transform',
        activeOptionsTab: 'style',
        activeBindingTab: 'binding',
        debug_hideCanvas: false,
        showPreview: false,
        previewTplStr: '',
        docSettings: {
          bgColor: 'rgb(13, 51, 73)',
          width: 1000,
          height: 600,
        },
        docInfo: {
          name: '',
          draftId: null,
          editorId: 1,
          visGroupId: 1
        },
        scadaDoc: null,
        isShowSettingsDialog: false,
        isShowHelpDialog: false,
        isDocLoading: false
      }
    },
    mounted() {
      this.initDocSettings()
      this.initKonvaWorkArea()
      this.initDocFromParam()
      this.initDeviceType()
      this.initEventHandle()
    },
    methods: {
      addComp(compCtrl, addOptions) {
        addOptions = addOptions || {}
        this.addCompEvent(compCtrl)
        if (_.has(addOptions, 'index')) {
          this.comps.splice(addOptions.index, 0, compCtrl)
        } else {
          this.comps.push(compCtrl)
        }
      },
      handleCompDrop(e) {
        const data = e.dataTransfer.getData("data")
        // console.log(data)

        if (data) {
          const newCompOptions = JSON.parse(data)
          if (!newCompOptions) {
            return
          }

          const dropPos = { x: e.offsetX, y: e.offsetY }
          const transform = this.konvaObjs.stage.getTransform().copy().invert()
          const absPos = transform.point(dropPos)

          // newCompOptions.layout.x = absPos.x - newCompOptions.layout.width / 2
          // newCompOptions.layout.y = absPos.y - newCompOptions.layout.height / 2
          newCompOptions.layout.x = absPos.x
          newCompOptions.layout.y = absPos.y

          const compCtrl = this.addCompToCanvas(newCompOptions)

          if (compCtrl) {
            this.unGroupSelAll()
            this.curSelComps.push(compCtrl)
          }

          if (compCtrl.type === 'ScadaTube') {
            this.toolState = TOOL_STATE.addPathPoint
          }
        }
      },

      addPathStartPoint(pos = { x: 300, y: 300 }) {
        const stageTf = this.konvaObjs.stage.getTransform().copy().invert()
        const relativePt = stageTf.point(pos)
        const newComp = this.addCompToCanvas({
          type: 'ScadaTube',
          layout: {
            x: relativePt.x,
            y: relativePt.y,
            points: [0, 0]
          },
          bindingValue: {
            val: 0
          }
        })
        const newSels = []
        newSels.push(newComp)
        this.detchCompTransformer()
        this.unGroupSelAll()
        this.curSelComps = newSels
      },
      syncKonvaZIndex() {
        this.comps.forEach((comp, index) => {
          comp.konvaCtrl().setZIndex(index)
        })
        this.konvaObjs.layers[0].draw()
      },
      compsDelete() {
        this.curSelComps.forEach((selComp) => {
          const i = _.findIndex(this.comps, selComp)
          if (i >= 0) {
            selComp.delete()
            this.comps.splice(i, 1)
          }
        })
        this.curSelComps = []
      },
      showNodeZIndex() {
        this.comps.forEach((comp, index) => {
          console.log(`${index} : ${comp.konvaCtrl().name()} ${comp.konvaCtrl().getZIndex()}`)
        })
      },
      addCompToCanvas(comp, addOptions) {
        // console.log(comp)
        const c = new CompCtrl(comp)
        this.addComp(c, addOptions)
        return c
      },
      getCompsConfig(comps) {
        const compConfig = []
        comps.forEach((comp) => {
          compConfig.push(comp.toConfig())
        })
        return compConfig
      },
      copyCompsTolocalStorage(storageKey = 'copiedComps') {
        const compConfig = this.getCompsConfig(this.curSelComps)
        localStorage.setItem(storageKey, JSON.stringify(compConfig))
      },

      addCompsFromConfig(compConfig, addOptions) {
        const configs = _.cloneDeep(compConfig)
        const defAddOptions = {
          offset: { x: 0, y: 0 },
          selAfterAdd: false,
          index: 0
        }
        const options = addOptions || defAddOptions
        const offset = options.offset || { x: 0, y: 0 }
        const newAddComps = []
        configs.forEach((comp => {
          comp.layout.x += offset.x
          comp.layout.y += offset.y
          newAddComps.push(this.addCompToCanvas(comp, options))
        }))
        if (options.selAfterAdd) {
          if (newAddComps.length > 0) {
            this.unGroupSelAll()
            newAddComps.forEach(compCtrl => {
              this.curSelComps.push(compCtrl)
            })
          }
        }
      },
      loadCompsFromlocalStorage(storageKey = 'copiedComps') {
        const compStr = localStorage.getItem(storageKey)
        if (compStr) {
          const compConfig = JSON.parse(compStr)
          const options = {
            selAfterAdd: false
          }
          this.addCompsFromConfig(compConfig, options)
        }
      },
      onCompOptionsChanged(changedOptions) {
        const cate = _.keys(changedOptions)[0]

        if (this.curSelComp) {
          this.curSelComps.forEach((comp) => {
            comp.options[cate] = Object.assign({}, comp.options[cate], changedOptions[cate])
          })
          console.log('optionChanged!')
          this.recordToHistoryDebounce()
        }
      },
      onCompBindingChanged(changedBinding) {
        this.curSelComps.forEach((comp) => {
          _.merge(comp.binding, changedBinding)
        })
        this.recordToHistoryDebounce()
      },
      onCompGroupChildBinding(binding) {
        this.curSelComp.setGroupBinding(binding)
        this.$message.success('子组件的uid已批量绑定')
        this.recordToHistoryDebounce()
      },
      onCompValChanged(newValue) {
        this.curSelComps.forEach((comp) => {
          _.merge(comp.bindingValue, newValue)
        })
      },
      onCompBidChanged(v) {
        this.curSelComp.bid = v.bid
      },
      onCompEventMsgChanged(v) {
        this.curSelComps.forEach((comp) => {
          comp.eventMsg = v.eventMsg
        })
      },
      doPreview() {
        const doc = { comps: this.comps, docSettings: this.docSettings }
        this.scadaDoc = {
          scadaTpl: ScadaVueTpl.getTplStr(doc, true),
          queryConfig: ScadaVueTpl.getQueryConfig(this.comps)
        }
        this.showPreview = true
      },
      doLockComp() {
        this.curSelComps.forEach(comp => {
          if (!comp.isChild) {
            comp.locked = true
          }
        })
      },
      doUnlockComp() {
        this.curSelComps.forEach(comp => {
          if (!comp.isChild) {
            comp.locked = false
          }
        })
      },
      doUnlockAll() {
        this.comps.forEach(comp => {
          comp.locked = false
        })
      }
    },
    computed: {
      canvasCursorStyle() {
        switch (this.toolState) {
          case TOOL_STATE.addPathPoint : {
            return 'crosshair'
          }
          default: {
            return 'default'
          }
        }
      },
      pathLastPoint() {
        if (this.curSelComp && this.curSelComp.points) {
          const l = this.curSelComp.points.length
          return [this.curSelComp.points[l - 2], this.curSelComp.points[l - 1]]
        } else {
          return null
        }
      },
      workFrameBgColor() {
        return {
          backgroundColor: this.docSettings.bgColor
        }
      }
    },
    watch: {
      curSelComps(val) {
        // console.log('curSelComps:' + this.curSelComps.length)
        if (this.curSelComps.length > 0) {
          if (this.curSelComps.length === 1) {
            if (this.curSelComps[0].konvaCtrl()) {
              this.curSelComps[0].addTransformer()
            }
            this.cancelSelGroup()
          } else {
            this.addToGroup()
          }
          //将选中的comps config记录
          this.curSelCompsCopied = this.getCompsConfig(this.curSelComps)
        } else {
          this.detchCompTransformer()
          this.cancelSelGroup()
          this.curSelCompStyleOptions = null
          this.curSelCompsCopied = []
        }
        this.syncKonvaZIndex()
        this.curSelComps = val
      },
      toolState() {
        this.konvaObjs.stage.container().style.cursor = this.canvasCursorStyle

        switch (this.toolState) {
          case TOOL_STATE.addPathPoint : {
            this.konvaObjs.layers[0].add(this.konvaObjs.pathAuxLine)
            this.comps.forEach((comp) => {
              comp.konvaCtrl().listening(false)
            })
            this.konvaObjs.stage.draw()
            return 'crosshair'
          }
          default: {
            this.konvaObjs.pathAuxLine.remove()
            this.konvaObjs.pathAuxLine.points([0, 0])
            this.comps.forEach((comp) => {
              if (!comp.locked) {
                comp.konvaCtrl().listening(true)
              }
            })
            this.konvaObjs.stage.draw()
            return 'default'
          }
        }
      }
    }
  }

</script>
<style lang="scss">
  @import "../styles/mixin";

  body {
    user-select: none;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    /*background: #2B2B2B;*/
    overflow: hidden;
  }

  #main_frame {
    width: 100%;
    height: 100%;
  }

  #scada_editor {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    header {
      display: flex;
      background: #3C3F41;
      flex: 0 0 54px;
      border-bottom: 1.5px solid #2B2B2B;
    }
    main {
      display: flex;
      flex: 1;
      /*flex-basis: auto;*/
      width: 100vw;
      /*height: 100%;*/
      #left_sidebar {
        @include el-tab-flex;
        flex: 0 0 200px;
        background: #3C3F41;
        border-right: 1px solid #000;
      }
      #work_area {
        flex: 1;
        /*width: 100%;*/
        /*height: 100%;*/
        /*overflow: scroll;*/
        #work_frame {
          width: 100%;
          height: 100%;
          position: relative;
          /*background: #2B2B2B;*/
          overflow: hidden;
          #work_canvas {
            width: 100%;
            height: 100%;
            user-select: none;
            overflow: hidden;
          }
        }
      }
      #right_sidebar {
        border-left: 1px solid #000;
        flex: 0 0 260px;
        background: #3C3F41;
        #layout_panel {
          padding: 8px 12px 2px 6px;
          span.layout_panel_label {
            text-align: right;
            letter-spacing: 1px;
            display: inline-block;
            width: 15px;
            color: #DDD;
            font-size: 13px;
            margin-left: 6px;
          }
          label {
            letter-spacing: 1.5px;
            display: inline-block;
            color: #DDD;
            font-size: 14px;
            margin: 0 10px 0 6px;
          }
          .layout-input {
            width: 70px;
            margin-left: 2px;
            margin-bottom: 6px;
            text-align: right;
            padding: 0 2px;
          }
        }
      }
    }
    footer {
      border-top: 1.5px solid #2B2B2B;
      background: #3C3F41;
      flex: 0 0 24px;
    }

    .toolbar {
      width: 100%;
      color: #EEE;
      font-size: 13px;
      display: flex;
      align-items: center;
      padding: 10px;
      white-space: nowrap;
      .app-logo {
        width: 36px;
        height: 36px;
        margin-right: 50px;
      }
      .toolbar-center {
        flex-grow: 2;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .toolbar-right {
        /*flex-grow: 1;*/
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        .publish {
          padding: 8px 12px;
          .el-icon-upload {
            font-size: 16px;
          }
        }
        .img-btn {
          margin-right: 8px;
        }
      }

      label {
        margin-right: 4px;
      }
      .toolbar-gutter-h {
        display: inline-block;
        width: 20px;
      }

      .ctrl-canvas-bg {
        &.el-color-picker--mini .el-color-picker__trigger {
          width: 28px;
          height: 28px;
        }
      }
      .el-button {
        padding: 9px 12px;
        font-size: 13px;
        outline: none;
      }

      .zoom-btn {
        padding: 6px;
        font-size: 12px;
      }
    }
  }

  #context-menu {
    user-select: none;
    &.ctx-menu-container {
      border: none;
      ul {
        border-radius: 0;
        background-color: #EEE;
        li {
          padding: 4px 8px;
          &:hover {
            /*background: rgba(39, 176, 255, 0.4);*/
            background: #D3D3D3;
          }
          button {
            letter-spacing: 1.5px;
            font-size: 15px;
            color: #333;
            text-align: left;
            width: 100%;
            background: none;
            border: none;
            &:disabled {
              color: #999;
            }
            label {
              display: inline-block;
              width: 80px;
            }
            .hotkey-hint {
              margin-left: 5px;
              font-size: 13px;
              /*color: #666;*/
            }
          }

        }
        hr {
          margin: 2px 0;
          border-top: 1px solid #BBB;
          height: 0;
        }
      }
    }
  }

  #align_panel {
    .align-panel-direct {
      display: flex;
      align-items: center;
      label {
        font-size: 13px;
        margin-right: 8px;
      }
      &:first-of-type {
        margin-bottom: 10px;
      }
    }
  }

  #dianji {
    position: absolute;
    top: 9999px;
    left: 9999px;
    color: #20a0ff;
    &:hover {
      cursor: pointer;
    }
  }

  #scada_preview {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 999;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: #2B2B2B;
    .close {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 3px;
    }
  }

  .zoom-label {
    width: 30px;
    text-align: right;
    margin-right: 4px;
    display: inline-block;
    background: #333;
    padding: 2px 6px 3px 4px;
    border: 1px solid #222;
    border-radius: 3px;
  }

</style>