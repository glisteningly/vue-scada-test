<template>
  <div id="main_frame">
    <section id="scada_editor">
      <header>
        <div class="toolbar">
          <img class="app-logo" :src="'./images/icons/ic-main-logo.png'"/>
          <span class="toolbar-gutter-h"/>
          <ImgButton title="文档设置" :icon="'ic-action-settings'" @click="isShowSettingsDialog=true"/>
          <span class="toolbar-gutter-h"/>
          <div class="img-btn-group">
            <ImgButton title="暂存" :icon="'ic-action-save-local'" @click="onActionSaveDocLocal"/>
            <ImgButton title="读取暂存" :icon="'ic-action-load-local'" @click="onActionLoadDocLocal"/>
          </div>
          <span class="toolbar-gutter-h"/>
          <ImgButton title="帮助" :icon="'ic-action-help'"/>
          <!--<el-button @click="addRect">rect</el-button>-->
          <!--<el-button @click="addPath">path</el-button>-->
          <!--<el-button @click="addIcon2">google</el-button>-->
          <!--<el-button @click="addAll">add all</el-button>-->
          <!--<el-button @click="addCompGroup">add group</el-button>-->
          <!--<el-button @click="toolPathPoint" :type="isToolStatePath">add point</el-button>-->
          <!--<el-button @click="unGroupToComps">ungroup</el-button>-->
          <!--<el-button @click="showNodeZIndex">z index</el-button>-->
          <span class="toolbar-gutter-h"/>
          <label class="zoom-label">{{ curZoomScale | numPercent }}</label>
          <el-button @click="zoomOut" class="zoom-btn"><i class="el-icon-minus"></i></el-button>
          <el-button @click="zoom100" class="zoom-btn" style="margin-left: 0">100%</el-button>
          <el-button @click="zoomIn" class="zoom-btn" style="margin-left: 0"><i class="el-icon-plus"></i></el-button>

          <span class="toolbar-gutter-h"/>
          <ImgButton title="刷新" :icon="'ic-action-refresh'" @click="initKonvaWorkArea"/>

          <div class="toolbar-center">

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
            <!--<label class="ctrl-canvas-bg-label">背景色</label>-->
            <!--<el-color-picker class="ctrl-canvas-bg" v-model="docSettings.bgColor"></el-color-picker>-->
            <!--<span class="toolbar-gutter-h"/>-->
            <!--<el-button @click="setDocSize(1200,600)">size</el-button>-->
            <!--<el-button @click="doLockComp">lock</el-button>-->
            <!--<el-button @click="initKonvaWorkArea"><i class="el-icon-refresh"></i></el-button>-->
            <!--<el-button @click="canvasRedraw"><i class="el-icon-refresh"></i></el-button>-->
            <span class="toolbar-gutter-h"/>
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
              <BasicCompLib/>
            </el-tab-pane>
            <el-tab-pane label="设备" name="deviceComp">
              <DeviceCompLib/>
            </el-tab-pane>
            <el-tab-pane label="图层" name="layer"></el-tab-pane>
          </el-tabs>
        </div>
        <div id="work_area">
          <div id="work_frame" :style="workFrameBgColor">
            <SvgScadaView :comps="comps" :canvasLayout="canvasLayout" :dataBinding="dataBinding"></SvgScadaView>
            <div id="work_canvas" @contextmenu.prevent="$refs.ctxMenu.open" ref="workCanvas"
                 v-show="!debug_hideCanvas" @dragover.prevent @drop="handleCompDrop($event)"></div>
          </div>
        </div>
        <div id="right_sidebar">
          <el-tabs v-model="activeRightTab" type="card">
            <el-tab-pane label="变换" name="transform">
              <div id="layout_panel" v-show="curSelComp && curSelComps.length === 1">
                <div v-if="curSelCompLayout">
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
            </el-tab-pane>
            <el-tab-pane label="导航" name="nav">
              <CanvasNav :docSettings="docSettings"/>
            </el-tab-pane>
          </el-tabs>
          <el-tabs v-model="activeBindingTab" type="card" v-show="curSelComp">
            <el-tab-pane label="数据绑定" name="binding">
              <BindingPanel :selComps="curSelComps"
                            @compBindingChanged="onCompBindingChanged"
                            @compOptionsChanged="onCompOptionsChanged"
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
          <label>原始尺寸</label><span class="hotkey-hint">Ctrl+0</span>
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
  </div>
</template>

<script>

  import Konva from 'konva'
  import _ from 'lodash'
  import hotkeys from 'hotkeys-js'

  import ContextMenu from 'vue-context-menu'

  import CompCtrl from '../class/CompCtrl'

  import { Drop } from 'vue-drag-drop'

  import CommonUtils from '../mixin/CommonUtils'
  import ComputeLayout from '../mixin/ComputeLayout'
  import Keyboard from '../mixin/Keyboard'
  import InitKonva from '../mixin/InitKonva'
  import ActionAlign from '../mixin/ActionAlign'
  import ActionMove from '../mixin/ActionMove'
  import StateStore from '../mixin/StateStore'
  import InitConfig from '../mixin/InitConfig'
  import DocSettings from '../mixin/DocSettings'
  import ActionDocument from '../mixin/ActionDocument'


  import DataBinding from '../mixin/DataBinding'


  import BindingPanel from './panels/BindingPanel'
  import EventPanel from './panels/EventPanel'
  import OptionPanel from './panels/OptionPanel'
  import BasicCompLib from './panels/BasicCompLib'
  import DeviceCompLib from './panels/DeviceCompLib'

  import ImgButton from '../components/ImgButton'
  import SvgScadaView from '../components/SvgScadaView'
  import CanvasNav from '../components/CanvasNav'
  import SettingsDialog from '../components/SettingsDialog'

  import VisScadaAdapter from '../components/VisScadaAdapter'

  import { TOOL_STATE } from '../const'

  const ZoomScaleSettings = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.5, 2, 3, 4]

  export default {
    components: {
      Drop,
      ContextMenu,
      BindingPanel,
      EventPanel,
      OptionPanel,
      ImgButton,
      SvgScadaView,
      CanvasNav,
      VisScadaAdapter,
      BasicCompLib,
      DeviceCompLib,
      SettingsDialog
    },
    mixins: [CommonUtils, InitKonva, ComputeLayout, Keyboard, ActionDocument,
      ActionAlign, ActionMove, DataBinding, StateStore, InitConfig, DocSettings],
    name: 'MainEditor',
    data() {
      return {
        // toolState: '',
        inited: false,
        comps: [],
        canvasLayout: {
          width: 0,
          height: 0,
          x: 30,
          y: 30,
          scale: ZoomScaleSettings[5],
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
        // activeRightTab: 'nav',
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
      }
    },
    mounted() {
      this.initDocSettings()
      this.initKonvaWorkArea()
      this.initDocFromParam()
      this.initDeviceType()
    },
    methods: {
      addCompEvent(compCtrl) {
        // comp.setContext(this.konvaObjs)
        compCtrl.konvaCtrl().on('click', (e) => {
          if (e.evt.button === 0) {
            if (!this.isInSelGroup(compCtrl)) {
              // 不在多选组内
              if (!hotkeys.shift) {
                this.detchCompTransformer()
                this.unGroupSelAll()
                this.curSelComps.push(compCtrl)
              } else {
                if (!this.isInSelGroup(compCtrl)) {
                  this.curSelComps.push(compCtrl)
                }
              }
            } else {
              // 在多选组内
              if (hotkeys.shift) {
                if (this.isInSelGroup(compCtrl)) {
                  compCtrl.removeCompfromGroupSel()
                  this.curSelComps.splice(_.findIndex(this.curSelComps, compCtrl), 1)
                }
              }
            }
          }
        })

        compCtrl.konvaCtrl().on('dragstart', () => {
          // console.log('dragstart')
          if (!this.isInSelGroup(compCtrl)) {
            this.unGroupSelAll()
            this.curSelComps.push(compCtrl)
          }
        })

        compCtrl.konvaCtrl().on('dragend', (e) => {
          //alt 拖拽复制
          if (e.evt.altKey && this.curSelCompsCopied.length > 0) {
            this.addCompsFromConfig(this.curSelCompsCopied)
          }
          //更新选中的comps config记录
          this.curSelCompsCopied = this.getCompsConfig(this.curSelComps)
        })
      },
      addComp(compCtrl) {
        this.addCompEvent(compCtrl)
        this.comps.push(compCtrl)
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

      unGroupToComps() {
        if (this.curSelComp && this.curSelComp.type === 'ScadaGroupWrap') {
          const childComps = []
          if (this.curSelComp.children) {
            this.curSelComp.children.forEach((childrenComp) => {
              childrenComp.setContext(this.konvaObjs)
              childrenComp.initKonva()
              this.addComp(childrenComp)
              childComps.push(childrenComp)
            })
          }
          this.compsDelete()
          this.curSelComps = childComps
        }
      },
      jointCompsToGroup() {
        // console.log(this.konvaObjs.selCompsGroup.getAbsoluteScale())
        if (this.curSelComps.length > 1) {
          // const groupRect = this.konvaObjs.selCompsGroup.getClientRect()
          const groupRect = this.konvaObjs.selCompsGroup.getClientRect({ relativeTo: this.konvaObjs.stage })
          const g = {
            type: 'ScadaGroupWrap',
            layout: {
              x: groupRect.x + 1,
              y: groupRect.y + 1,
              width: groupRect.width - 2,
              height: groupRect.height - 2,
            },
            konvaContext: this.konvaObjs
          }
          const children = []
          this.curSelComps.forEach((comp) => {
            comp.removeTempTransformer()
            comp.x = comp.x - g.layout.x
            comp.y = comp.y - g.layout.y
            comp.initBaseLayout()
            comp.syncCompLayout()
            // comp.konvaRect().destroy()
            children.push(comp)
          })
          this.compsDelete()
          const c = new CompCtrl(g)
          c.children = children
          this.addComp(c)
          this.curSelComps.push(c)
        }
      },
      unGroupSelAll() {
        this.curSelComps.forEach((comp) => {
          comp.removeCompfromGroupSel()
        })
        this.curSelComps = []
      },
      addToGroup() {
        this.detchCompTransformer()
        this.curSelComps.forEach((comp) => {
          this.konvaObjs.selCompsGroup.add(comp.konvaCtrl())
          comp.konvaCtrl().draggable(false)
          // 每个对象加上tr，拖动变形时更直观
          // 但如果一次选中的对象数量过多，会明显影响性能，因此限制在10个
          if (this.curSelComps.length <= 10) {
            if (!comp.tempTr) {
              comp.tempTr = new Konva.Transformer({
                node: comp.konvaCtrl(),
                name: 'tempTr',
                keepRatio: true,
                resizeEnabled: false,
                rotateEnabled: false,
              })
              this.konvaObjs.selCompsGroup.add(comp.tempTr)
            }
          }
        })
        this.konvaObjs.layers[0].add(this.konvaObjs.selCompsGroup)
        this.konvaObjs.layers[0].add(this.konvaObjs.groupTransformer)
        this.konvaObjs.groupTransformer.attachTo(this.konvaObjs.selCompsGroup)
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      },
      cancelSelGroup() {
        this.konvaObjs.groupTransformer.detach()
        this.konvaObjs.selCompsGroup.remove()
        this.konvaObjs.selCompsGroup.x(0)
        this.konvaObjs.selCompsGroup.y(0)
        this.konvaObjs.selCompsGroup.scaleX(1)
        this.konvaObjs.selCompsGroup.scaleY(1)
        this.konvaObjs.selCompsGroup.rotation(0)
        this.konvaObjs.layers[0].draw()
      },
      isInSelGroup(comp) {
        return _.findIndex(this.curSelComps, comp) >= 0
      },
      syncGroupSel() {
        this.curSelComps.forEach((comp) => {
          comp.removeCompfromGroupSel()
        })
        this.cancelSelGroup()
        this.addToGroup()
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
      addCompToCanvas(comp) {
        // console.log(comp)
        const c = new CompCtrl(comp)
        this.addComp(c)
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

      addCompsFromConfig(compConfig, offset = { x: 0, y: 0 }, selAfterAdd = false) {
        offset = offset || { x: 0, y: 0 }
        const newAddComps = []
        compConfig.forEach((comp => {
          comp.layout.x += offset.x
          comp.layout.y += offset.y
          newAddComps.push(this.addCompToCanvas(comp))
        }))
        if (selAfterAdd) {
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
          this.addCompsFromConfig(compConfig, { x: 0, y: 0 }, true)
        }
      },
      onCompOptionsChanged(changedOptions) {
        // console.log(changedOptions)

        const cate = _.keys(changedOptions)[0]

        if (this.curSelComp) {
          this.curSelComps.forEach((comp) => {
            comp.options[cate] = Object.assign({}, comp.options[cate], changedOptions[cate])
          })
        }
      },
      onCompBindingChanged(changedBinding) {
        this.curSelComps.forEach((comp) => {
          _.merge(comp.binding, changedBinding)
        })
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
      zoomIn() {
        if (this.zoomScaleIndex < ZoomScaleSettings.length - 1) {
          this.zoomScaleIndex += 1
          this.canvasLayout.scale = this.curZoomScale
        }
      },
      zoomOut() {
        if (this.zoomScaleIndex > 0) {
          this.zoomScaleIndex -= 1
          this.canvasLayout.scale = this.curZoomScale
        }
      },
      zoom100() {
        if (this.zoomScaleIndex !== 8) {
          this.zoomScaleIndex = 8
          this.canvasLayout.scale = this.curZoomScale
        }
      },
      setCanvasZoom(scale) {
        this.konvaObjs.stage.scaleX(scale)
        this.konvaObjs.stage.scaleY(scale)
        if (this.curSelComp) {
          this.konvaObjs.transformer.forceUpdate()
        }
        if (this.multiCompsSelected) {
          this.konvaObjs.groupTransformer.forceUpdate()
        }
        this.konvaObjs.selCompsRect.strokeWidth(1 / scale)
        this.konvaObjs.paperRect.strokeWidth(1 / scale)
        this.canvasRedraw()
      },
      canvasRedraw() {
        const container = this.$refs['workCanvas']

        const width = container.clientWidth
        const height = container.clientHeight

        this.canvasLayout.width = width
        this.canvasLayout.height = height

        this.konvaObjs.stage.width(width)
        this.konvaObjs.stage.height(height)
        this.konvaObjs.stage.batchDraw()
      },
      doPreview() {
        // this.testExport()
        this.scadaDoc = { comps: this.comps, docSettings: this.docSettings }

        this.showPreview = true
      },
      //移除组件的tr
      detchCompTransformer() {
        this.konvaObjs.transformer.detach()
        this.comps.forEach(comp => {
          if (comp.isPathCtrl) {
            comp.removeAnchors()
          }
        })
      },
      doLockComp() {
        this.curSelComps.forEach(comp => {
          comp.locked = true
        })
      },
      doUnlockComp() {
        this.curSelComps.forEach(comp => {
          comp.locked = false
        })
      },
      doUnlockAll() {
        this.comps.forEach(comp => {
          comp.locked = false
        })
      }
    },
    computed: {
      curSelComp() {
        if (this.curSelComps.length >= 1) {
          return this.curSelComps[0]
        } else {
          return null
        }
      },
      curSingleSelComp() {
        if (this.curSelComps.length === 1) {
          return this.curSelComps[0]
        } else {
          return null
        }
      },
      multiCompsSelected() {
        return this.curSelComps.length > 1
      },
      canDoSelCompAction() {
        return this.curSelComps.length > 0
      },
      canUnGroupComps() {
        return (this.curSelComps.length === 1 && this.curSelComps[0].type === 'ScadaGroupWrap')
      },
      canvasZoom() {
        return this.canvasLayout.scale
      },
      curZoomScale() {
        return ZoomScaleSettings[this.zoomScaleIndex]
      },
      isToolStatePath() {
        // return (this.toolState === TOOL_STATE.addPathPoint) ? 'primary' : 'default'
        return (this.toolState === TOOL_STATE.addPathPoint) ? 'primary' : 'default'
      },
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
      curSelCompsType() {
        if (this.curSelComps.length >= 1) {
          const compType = this.curSelComps[0].type
          let _isSameType = true
          this.curSelComps.forEach(comp => {
            _isSameType = (comp.type === compType)
          })
          if (_isSameType) {
            return compType
          }
        }
        return null
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
            this.curSelComps[0].addTransformer()
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
      curSelCompLayout: {
        handler: function () {
          if (this.curSingleSelComp) {
            this.curSelComp.syncKonva()
          }
        },
        // deep: true
      },
      // curSelComp: {
      //   handler: function () {
      //     console.log('comp layout changed')
      //     this.curSelComps[0].syncKonva()
      //   },
      //   // deep: true
      // }
      canvasZoom() {
        this.setCanvasZoom(this.canvasLayout.scale)
      },
      isKeySpacepressing(val) {
        // console.log(this.isKeySpacepressing)
        if (val) {
          this.comps.forEach((comp) => {
            comp.konvaCtrl().draggable(false)
          })
          this.konvaObjs.stage.draggable(true)
          this.konvaObjs.stage.container().style.cursor = '-webkit-grabbing'
        } else {
          this.comps.forEach((comp) => {
            // TODO: 判断组件是否锁定
            if (!comp.locked) {
              comp.konvaCtrl().draggable(true)
            }
          })
          if (this.curSelComps.length > 1) {
            this.curSelComps.forEach((comp) => {
              comp.konvaCtrl().draggable(false)
            })
          }
          this.konvaObjs.stage.draggable(false)
          this.konvaObjs.stage.container().style.cursor = this.canvasCursorStyle
        }
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
          padding: 8px 12px 2px 12px;
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
            margin-right: 10px;
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
    z-index: 9999;
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