<template>
  <div id="main_frame">
    <section id="scada_editor">
      <header>
        <div class="toolbar" style="">
          <!--<button @click="btnClicked">add</button>-->
          <!--<button @click="btnZoomInClicked">zoom+</button>-->
          <!--<button @click="btnZoomOutClicked">zoom-</button>-->
          <!--<button @click="btnClicked1">log</button>-->
          <el-button @click="addLabel">label</el-button>
          <el-button @click="addRect">rect</el-button>
          <el-button @click="addPath">path</el-button>
          <!--<el-button @click="addIcon">twitter</el-button>-->
          <!--<el-button @click="addIcon2">google</el-button>-->
          <el-button @click="addAll">add all</el-button>
          <el-button @click="addCompGroup">add group</el-button>
          <el-button @click="toolPathPoint" :type="isToolStatePath">add point</el-button>
          <!--<el-button @click="unGroupToComps">ungroup</el-button>-->
          <!--<el-button @click="jointCompsToGroup">to group</el-button>-->
          <span style="display: inline-block; width: 20px"/>
          <el-button @click="showNodeZIndex">z index</el-button>
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
                  <ImgButton :icon="'ic-align-left'" @click="getCompsCRectL"/>
                  <ImgButton :icon="'ic-align-h-center'" @click="getCompsCRectHC"/>
                  <ImgButton :icon="'ic-align-right'" @click="getCompsCRectR"/>
                </div>
              </div>
              <div class="align-panel-direct">
                <label>垂直对齐:</label>
                <div class="img-btn-group">
                  <ImgButton :icon="'ic-align-top'" @click="getCompsCRectT"/>
                  <ImgButton :icon="'ic-align-v-center'" @click="getCompsCRectVC"/>
                  <ImgButton :icon="'ic-align-bottom'" @click="getCompsCRectB"/>
                </div>
              </div>
            </div>
            <ImgButton title="对齐" slot="reference" :icon="'ic-align'" :disabled="!multiCompsSelected"/>
          </el-popover>
          <span class="toolbar-gutter-h"/>
          <el-button @click="compsDelete">delete</el-button>
          <span style="display: inline-block; width: 20px"/>
          <el-button @click="testImport">import</el-button>
          <el-button @click="doTest">test</el-button>
          <el-button @click="loadLocal">load</el-button>
          <span style="display: inline-block; width: 40px; color: #EEE; text-align: center; font-size: 12px">{{ curZoomScale | numPercent }}</span>
          <el-button @click="zoomOut"><i class="el-icon-zoom-out"></i></el-button>
          <el-button @click="zoom100">100%</el-button>
          <el-button @click="zoomIn"><i class="el-icon-zoom-in"></i></el-button>
          <el-button @click="initKonvaWorkArea" type="primary"><i class="el-icon-refresh"></i></el-button>
          <el-button @click="canvasRedraw"><i class="el-icon-refresh"></i></el-button>
        </div>
      </header>
      <main>
        <div id="left_sidebar"></div>
        <div id="work_area">
          <div id="work_frame">
            <SvgScadaView :comps="comps" :canvasLayout="canvasLayout"></SvgScadaView>
            <div id="work_canvas" @contextmenu.prevent="$refs.ctxMenu.open" ref="workCanvas"></div>
          </div>
        </div>
        <div id="right_sidebar">
          <div id="layout_panel" v-if="curSelComp && curSelComps.length === 1">
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
              </div>
            </div>
          </div>
          <StylePanel v-if="curSelCompStyleOptions" :styleOptions="curSelCompStyleOptions"
                      @compStyleOptionsChanged="compStyleOptionsChanged"/>
        </div>
      </main>
      <!--<footer>-->
      <!--</footer>-->
    </section>
    <context-menu id="context-menu" ref="ctxMenu">
      <li>
        <button @click="zoomIn">放大</button>
      </li>
      <li>
        <button @click="zoomOut">缩小</button>
      </li>
      <li>
        <button @click="zoom100">原始尺寸</button>
      </li>
      <hr>
      <li v-if="canDoSelCompAction">
        <button @click="compsMoveTop">置于顶层</button>
      </li>
      <li v-if="canDoSelCompAction">
        <button @click="compsMoveBottom">置于底层</button>
      </li>
      <li v-if="multiCompsSelected">
        <button @click="jointCompsToGroup">编组</button>
      </li>
      <li v-if="canUnGroupComps">
        <button @click="unGroupToComps">取消编组</button>
      </li>
    </context-menu>
  </div>
</template>

<script>
  // for test
  import CompConfig from '../temp/compConfig1'
  import CompGroup1 from '../temp/compGroup2'
  import CompGroup3 from '../temp/compGroup3'

  import Konva from 'konva'
  import _ from 'lodash'
  import hotkeys from 'hotkeys-js'

  import ContextMenu from 'vue-context-menu'
  import { ScadaCompsLibrary } from '../components/Scada'

  import utils from '../utils'
  import styleDefs from '../utils/styleDefs'

  import CompCtrl from '../class/CompCtrl'
  import ComputeLayout from '../mixin/ComputeLayout'
  import Keyboard from '../mixin/Keyboard'
  import InitKonva from '../mixin/InitKonva'

  import StylePanel from '../components/StylePanel'
  import ImgButton from '../components/ImgButton'
  import SvgScadaView from '../components/SvgScadaView'

  import { TOOL_STATE } from '../utils/CONST'

  const ZoomScaleSettings = [0.25, 0.33, 0.5, 0.667, 1, 1.5, 2, 3, 4]

  export default {
    components: { ContextMenu, StylePanel, ImgButton, SvgScadaView },
    mixins: [InitKonva, ComputeLayout, Keyboard],
    name: 'MainEditor',
    data() {
      return {
        toolState: '',
        inited: false,
        comps: [],
        canvasLayout: {
          width: 0,
          height: 0,
          x: 30,
          y: 30,
          scale: 1,
        },
        konvaObjs: {
          stage: null,
          layers: [],
          transformer: null,
          groupTransformer: null,
          selCompsGroup: null,
          selCompsRect: null,
          paperRect: null,
          pathAuxLine: null,
        },
        curSelComps: [],
        groupLastPos: { x: 0, y: 0 },
        isDragSelecting: false,
        testData: 2,
        curSelCompStyleOptions: {},
        zoomScaleIndex: 4,
        curFixedPathPoint: null
      }
    },
    mounted() {
      this.initKonvaWorkArea()
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
          console.log('dragstart')
          if (!this.isInSelGroup(compCtrl)) {
            this.unGroupSelAll()
            this.curSelComps.push(compCtrl)
          }
        })
      },

      addComp(compCtrl) {
        this.addCompEvent(compCtrl)
        this.comps.push(compCtrl)
      },
      addLabel() {
        this.addCompToCanvas({
          type: 'ScadaLabel',
          layout: {
            x: 400,
            y: 400,
            width: 200,
            height: 68
          },
          options: {
            style: {
              fontSize: 20
            }
          },
        })
      },
      addRect() {
        this.addCompToCanvas({
          type: 'ScadaRect',
          layout: {
            x: 0,
            y: 0,
            width: 100,
            height: 100
          },
          options: {
            style: {
              stroke: '#b90006',
              strokeWidth: 4,
              cornerRadius: 5
            }
          }
        })
      },
      addPath() {
        this.addCompToCanvas({
          type: 'ScadaTube',
          layout: {
            x: 100,
            y: 200,
            rotation: 0,
            points: [0, 0, 100, 0, 100, 100, 180, 100, 180, 30, 240, 30]
            // points: [-10, -20, 200, 100]
          },
          options: {
            style: {
              fill: 'rgba(0,0,0,0.5)',
              stroke: '#CCC',
              strokeWidth: 10,
              cornerRadius: 10
            }
          }
        })
      },
      addIcon() {
        this.addCompToCanvas({
          type: 'ScadaImage',
          layout: {
            x: 100,
            y: 100,
            width: 100,
            height: 100
          },
          options: {
            url: '/images/twitter.svg'
          }
        })
      },
      addIcon2() {
        this.addCompToCanvas({
          type: 'ScadaImage',
          layout: {
            x: 300,
            y: 300,
            width: 200,
            height: 68
          },
          options: {
            url: '/images/google.png'
          }
        })
      },
      addAll() {
        this.addLabel()
        this.addIcon()
        this.addRect()
        this.addIcon2()
      },
      addCompGroup() {
        this.addCompToCanvas(CompGroup3)
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
          options: {
            style: {
              fill: 'rgba(0,0,0,0.5)',
              stroke: '#CCC',
              strokeWidth: 10,
              cornerRadius: 10
            }
          }
        })
        const newSels = []
        newSels.push(newComp)
        this.detchCompTransformer()
        this.unGroupSelAll()
        this.curSelComps = newSels
      },
      toolPathPoint() {
        // if (this.curSelComp && this.curSelComp.points) {
        this.toolState = (this.toolState) ? '' : TOOL_STATE.addPathPoint
        // }
      },
      unGroupToComps() {
        if (this.curSelComp && this.curSelComp.type === 'ScadaGroup') {
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
            type: 'ScadaGroup',
            layout: {
              x: groupRect.x + 1,
              y: groupRect.y + 1,
              width: groupRect.width - 2,
              height: groupRect.height - 2,
              // x: groupRect.x + 1 - this.konvaObjs.stage.x() * this.konvaObjs.stage.scaleX(),
              // y: groupRect.y + 1 - this.konvaObjs.stage.y() * this.konvaObjs.stage.scaleY(),
              // width: groupRect.width / this.konvaObjs.stage.scaleX() - 2,
              // height: groupRect.height / this.konvaObjs.stage.scaleY() - 2,
              // scaleX: 1 / this.konvaObjs.stage.scaleX(),
              // scaleY: 1 / this.konvaObjs.stage.scaleY(),
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
      isRectContain(r1, r2) {
        // const r1 = rect
        // console.log(r1)
        // const r2 = node.getClientRect()
        // console.log(r2)
        return (r1.x <= r2.x &&
          r1.x + r1.width >= r2.x + r2.width &&
          r1.y <= r2.y &&
          r1.y + r1.height >= r2.y + r2.height
        )
      },
      syncKonvaZIndex() {
        this.comps.forEach((comp, index) => {
          comp.konvaCtrl().setZIndex(index)
        })
        this.konvaObjs.layers[0].draw()
      },
      compsMoveTop() {
        this.curSelComps.forEach((selComp) => {
          const i = _.findIndex(this.comps, selComp)
          if (i >= 0) {
            this.comps.splice(i, 1)
            this.comps.push(selComp)
          }
        })
      },
      compsMoveBottom() {
        this.curSelComps.forEach((selComp) => {
          const i = _.findIndex(this.comps, selComp)
          if (i >= 0) {
            this.comps.splice(i, 1)
            this.comps.unshift(selComp)
          }
        })
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
        const c = new CompCtrl(comp)
        this.addComp(c)
        return c
      },
      testImport() {
        CompConfig.comps.forEach((comp) => {
          this.addCompToCanvas(comp)
        })
      },
      doTest() {
        // console.log(JSON.stringify(this.curSelComp.toConfig()))
        // this.addCompToCanvas(this.curSelComp.toConfig())
        const compConfig = []
        this.comps.forEach((comp) => {
          compConfig.push(comp.toConfig())
        })
        localStorage.setItem('comps', JSON.stringify(compConfig))

        const a = {
          options: {
            style: {
              fontSize: 10,
              stroke: '#ddd',
              fill: '#red'
            },
            param: {
              text: "123"
            },
            bind: {
              type: "sadasd"
            }
          }
        }

        const b = {
          options: {
            style: {
              fontSize: 16,
              fill: '#red',
            }
          }
        }

        // const o = ScadaCompsLibrary.ScadaRect.props.defaultOptions.default()
        // const o = utils.diff(a, b)
        // const o = _.merge({}, a, b)

        // console.log(o)
        // console.log('state x: ' + this.konvaObjs.stage.x())
        // console.log('comp x: ' + this.curSelComp.konvaRect().x())
      },
      loadLocal() {
        const compConfig = JSON.parse(localStorage.getItem('comps'))
        compConfig.forEach((comp => {
          this.addCompToCanvas(comp)
        }))
      },
      getRoundNum(num) {
        return _.round(num, 2)
      },
      getCompDefaultOptions() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            if (ScadaCompsLibrary[compType].props) {
              return ScadaCompsLibrary[compType].props.defaultOptions.default()
            }
          }
        }
        return null
      },
      getCompOptions(comp) {
        if (comp) {
          return _.merge({}, this.getCompDefaultOptions(), comp.options)
        }
        return null
      },
      getCompStyleOptions() {
        if (this.getCompOptions(this.curSelComp)) {
          const compStyles = Object.assign({}, this.getCompOptions(this.curSelComp).style)
          // console.log(compStyles)
          const styleCtrls = {}
          for (const key in compStyles) {
            styleCtrls[key] = {
              value: compStyles[key],
              label: styleDefs[key].label,
              type: styleDefs[key].type
            }
          }
          return styleCtrls
        } else {
          return null
        }
      },
      initCompCtrlPanel() {
        this.curSelCompStyleOptions = this.getCompStyleOptions()
      },
      initMulitCompCtrlPanel() {
        //TODO: 多选组件面板

        this.curSelCompStyleOptions = this.getCompStyleOptions()
      },
      compStyleOptionsChanged() {
        const newVal = {}
        for (const key in this.curSelCompStyleOptions) {
          newVal[key] = this.curSelCompStyleOptions[key].value
        }
        // console.log(newVal)
        if (this.curSelComp) {
          const compStyles = this.getCompDefaultOptions().style
          // console.log(newVal)
          // console.log(compStyles)
          // console.log(utils.diff(newVal, compStyles))
          const newStyle = utils.diff(newVal, compStyles)
          // this.curSelComp.options.style = utils.diff(newVal, compStyles)
          this.curSelComps.forEach((comp) => {
            comp.options.style = newStyle
          })
        }
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
        if (this.zoomScaleIndex !== 4) {
          this.zoomScaleIndex = 4
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
        // console.log(container)
        // this.konvaObjs.stage.container(container)

        const width = container.clientWidth
        const height = container.clientHeight

        this.canvasLayout.width = width
        this.canvasLayout.height = height

        this.konvaObjs.stage.width(width)
        this.konvaObjs.stage.height(height)
        this.konvaObjs.stage.batchDraw()
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
      getCompsCRectHC() {
        const destX = this.curSelComps[0].x
        this.curSelComps.forEach((comp) => {
          comp.x = destX
          comp.syncKonva()
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
      },
      getCompsCRectVC() {
        const destY = this.curSelComps[0].y
        this.curSelComps.forEach((comp) => {
          comp.y = destY
          comp.syncKonva()
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
      },
      getCompsCRectL() {
        const destX = this.curSelComps[0].x - this.curSelComps[0].offsetX * this.curSelComps[0].scaleX
        this.curSelComps.forEach((comp) => {
          comp.x = destX + comp.offsetX * comp.scaleX
          comp.syncKonva()
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
      },
      getCompsCRectR() {
        const destX = this.curSelComps[0].x + this.curSelComps[0].offsetX * this.curSelComps[0].scaleX
        this.curSelComps.forEach((comp) => {
          comp.x = destX - comp.offsetX * comp.scaleX
          comp.syncKonva()
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
      },
      getCompsCRectT() {
        const destY = this.curSelComps[0].y - this.curSelComps[0].offsetY * this.curSelComps[0].scaleY
        this.curSelComps.forEach((comp) => {
          comp.y = destY + comp.offsetY * comp.scaleY
          comp.syncKonva()
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
      },
      getCompsCRectB() {
        const destY = this.curSelComps[0].y + this.curSelComps[0].offsetY * this.curSelComps[0].scaleY
        this.curSelComps.forEach((comp) => {
          comp.y = destY - comp.offsetY * comp.scaleY
          comp.syncKonva()
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
      }
    },
    computed: {
      // svgViewbox() {
      //   const x = (-this.canvasLayout.x / this.canvasLayout.scale).toFixed(2)
      //   const y = (-this.canvasLayout.y / this.canvasLayout.scale).toFixed(2)
      //   const w = (this.canvasLayout.width / this.canvasLayout.scale).toFixed(2)
      //   const h = (this.canvasLayout.height / this.canvasLayout.scale).toFixed(2)
      //   return `${x} ${y} ${w} ${h}`
      // },
      curSelComp() {
        if (this.curSelComps.length >= 1) {
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
        return (this.curSelComps.length === 1 && this.curSelComps[0].type === 'ScadaGroup')
      },
      canvasZoom() {
        return this.canvasLayout.scale
      },
      curZoomScale() {
        return ZoomScaleSettings[this.zoomScaleIndex]
      },
      isToolStatePath() {
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
      }
    },
    filters: {
      numPercent(value) {
        if (!value) return ''
        return _.round(value * 100) + '%'
      }
    },
    watch: {
      curSelComps() {
        console.log('curSelComps:' + this.curSelComps.length)
        if (this.curSelComps.length > 0) {
          if (this.curSelComps.length === 1) {
            this.initCompCtrlPanel()
            this.curSelComps[0].addTransformer()
            this.cancelSelGroup()
          } else {
            this.initMulitCompCtrlPanel()
            this.addToGroup()
          }
        } else {
          this.detchCompTransformer()
          this.cancelSelGroup()
          this.curSelCompStyleOptions = null
        }
        this.syncKonvaZIndex()
      },
      curSelCompLayout: {
        handler: function () {
          if (this.curSelComps.length === 1) {
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
      isKeySpacepressing() {

        console.log(this.isKeySpacepressing)
        if (this.isKeySpacepressing) {
          this.comps.forEach((comp) => {
            comp.konvaCtrl().draggable(false)
          })
          this.konvaObjs.stage.draggable(true)
          this.konvaObjs.stage.container().style.cursor = '-webkit-grabbing'
        } else {
          this.comps.forEach((comp) => {
            // TODO: 判断组件是否锁定
            comp.konvaCtrl().draggable(true)
          })
          this.curSelComps.forEach((comp) => {
            comp.konvaCtrl().draggable(false)
          })
          this.konvaObjs.stage.draggable(false)
          this.konvaObjs.stage.container().style.cursor = this.canvasCursorStyle
        }
      },
      toolState() {
        this.konvaObjs.stage.container().style.cursor = this.canvasCursorStyle

        switch (this.toolState) {
          case TOOL_STATE.addPathPoint : {
            this.konvaObjs.layers[0].add(this.konvaObjs.pathAuxLine)
            this.konvaObjs.stage.draw()
            return 'crosshair'
          }
          default: {
            this.konvaObjs.pathAuxLine.remove()
            this.konvaObjs.pathAuxLine.points([0, 0])
            this.konvaObjs.stage.draw()
            return 'default'
          }
        }
      }
    }
  }

</script>
<style lang="scss">
  /*@import "styles/index";*/

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
        flex: 0 0 100px;
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
          background: #2B2B2B;
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
          border-bottom: 1.5px solid #2B2B2B;
          padding: 12px 12px 6px 12px;
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
            margin-bottom: 8px;
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
      display: flex;
      align-items: center;
      padding: 10px;
      white-space: nowrap;
      .toolbar-gutter-h {
        display: inline-block;
        width: 20px;
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
          padding: 4px 10px;
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
          }
        }
        hr {
          /*background-color: #DDD;*/
          border: 1px solid #CCC;
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

</style>