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
          <!--<el-button @click="addIcon">twitter</el-button>-->
          <!--<el-button @click="addIcon2">google</el-button>-->
          <el-button @click="addAll">add all</el-button>
          <el-button @click="addCompGroup">add group</el-button>
          <!--<el-button @click="unGroupToComps">ungroup</el-button>-->
          <!--<el-button @click="jointCompsToGroup">to group</el-button>-->
          <span style="display: inline-block; width: 20px"/>
          <el-button @click="showNodeZIndex">z index</el-button>
          <span style="display: inline-block; width: 20px"/>
          <el-button @click="compsMoveTop">to top</el-button>
          <el-button @click="compsMoveBottom">to bottom</el-button>
          <el-button @click="compsDelete">delete</el-button>
          <span style="display: inline-block; width: 20px"/>
          <el-button @click="testImport">import</el-button>
          <el-button @click="doTest">test</el-button>
          <el-button @click="loadLocal">load</el-button>
          <el-button @click="initKonvaWorkArea" type="primary">refreash</el-button>
          <!--<button @click="unGroupSelAll">ungroup</button>-->
        </div>
      </header>
      <main>
        <div id="left_sidebar"></div>
        <div id="work_area">
          <div id="work_frame">
            <svg style="position: absolute; left: 0;top: 0;"
                 width="100%"
                 height="100%"
                 :viewBox="svgViewbox">
              <component v-for="comp in comps"
                         :key="comp.name"
                         :is="comp.type"
                         :comp="comp"
              />
            </svg>
            <div id="work_canvas" @contextmenu.prevent="$refs.ctxMenu.open" ref="workCanvas"></div>
          </div>
        </div>
        <div id="right_sidebar">
          <div id="layout_panel" v-if="curSelComp">
            <div v-if="curSelCompLayout">
              <div>
                <label>位置</label>
                <el-input type="number" class="layout-input" v-model.number="curSelCompLayoutX">
                  <template slot="prepend">X</template>
                </el-input>
                <el-input type="number" class="layout-input" v-model.number="curSelCompLayoutY">
                  <template slot="prepend">Y</template>
                </el-input>
              </div>
              <div>
                <label>尺寸</label>
                <el-input type="number" class="layout-input" v-model.number="curSelCompLayoutW">
                  <template slot="prepend">W</template>
                </el-input>
                <el-input type="number" class="layout-input" v-model.number="curSelCompLayoutH">
                  <template slot="prepend">H</template>
                </el-input>
              </div>
              <div>
                <label>旋转</label>
                <el-input type="number" class="layout-input" v-model.number="curSelCompLayoutR">
                  <template slot="prepend">R</template>
                </el-input>
              </div>
            </div>
          </div>
          <StylePanel :styleOptions="curSelCompStyleOptions" @compStyleOptionsChanged="compStyleOptionsChanged"/>
        </div>
      </main>
      <!--<footer>-->
      <!--</footer>-->
    </section>
    <context-menu id="context-menu" ref="ctxMenu">
      <li>
        <button>放大</button>
      </li>
      <li>
        <button>缩小</button>
      </li>
      <li v-if="canDoSelCompAction">
        <button @click="compsMoveTop">置于顶层</button>
      </li>
      <li v-if="canDoSelCompAction">
        <button @click="compsMoveBottom">置于底层</button>
      </li>
      <li v-if="canGroupComps">
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
  import CompConfig from './temp/compConfig1'
  import CompGroup1 from './temp/compGroup2'
  import CompGroup3 from './temp/compGroup3'

  import Konva from 'konva'
  import _ from 'lodash'
  import hotkeys from 'hotkeys-js'

  import ContextMenu from 'vue-context-menu'
  import { ScadaCompsLibrary } from './components/Scada'

  import utils from './utils'
  import styleDefs from './utils/styleDefs'

  import CompCtrl from './class/CompCtrl'
  import ComputeLayout from './mixin/ComputeLayout'
  import Keyboard from './mixin/Keyboard'

  import StylePanel from './components/StylePanel'

  export default {
    components: { ContextMenu, StylePanel },
    mixins: [ComputeLayout, Keyboard],
    name: 'Editor',
    data() {
      return {
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
        },
        curSelComps: [],
        groupLastPos: { x: 0, y: 0 },
        isDragSelecting: false,
        testData: 2,
        curSelCompStyleOptions: {},
        // isKeySpacepressing: false
      }
    },
    mounted() {
      this.initKonvaWorkArea()
    },
    methods: {
      initKonvaWorkArea() {
        this.curSelComps = []
        // const width = window.innerWidth
        // const height = window.innerHeight
        const width = this.$refs['workCanvas'].clientWidth
        const height = this.$refs['workCanvas'].clientHeight

        this.canvasLayout.width = width
        this.canvasLayout.height = height

        console.log(width)
        console.log(height)


        if (this.konvaObjs.stage) {
          this.konvaObjs.stage.destroyChildren()
          this.konvaObjs.stage.destroy()
        }

        this.konvaObjs.stage = new Konva.Stage({
          container: 'work_canvas',
          x: this.canvasLayout.x,
          y: this.canvasLayout.y,
          width: width,
          height: height,
          // draggable: true
        })

        const layerPaper = new Konva.Layer()
        layerPaper.add(new Konva.Rect({
          width: 1600,
          height: 800,
          stroke: '#666',
          strokeWidth: 1,
          listening: false
        }))
        this.konvaObjs.stage.add(layerPaper)


        this.konvaObjs.layers = []
        const layer = new Konva.Layer()
        this.konvaObjs.layers.push(layer)
        this.konvaObjs.stage.add(this.konvaObjs.layers[0])
        this.konvaObjs.transformer = new Konva.Transformer({
          keepRatio: false,
          anchorSize: 6,
          rotationSnaps: [0, 90, 180, 270]
        })


        this.konvaObjs.groupTransformer = new Konva.Transformer({
          keepRatio: true,
          anchorSize: 6,
          // resizeEnabled: false,
          // rotateEnabled: false,
          // rotationSnaps: [],
          enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
        })

        this.konvaObjs.groupTransformer.on('transformend', () => {
          console.log('transformend ')
          // this.syncGroupSel()
          this.curSelComps.forEach((comp) => {
            // console.log(compScale)
            comp.syncCompLayout()
            // if (comp.tempTr) {
            //   comp.tempTr.forceUpdate()
            // }
          })
          this.syncGroupSel()
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })

        this.konvaObjs.groupTransformer.on('transform', () => {
          // console.log('transform')
          this.curSelComps.forEach((comp) => {
            // console.log(compScale)
            // this.updateLayout(comp)
            if (comp.tempTr) {
              comp.tempTr.forceUpdate()
            }
          })
          this.konvaObjs.groupTransformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })

        this.konvaObjs.selCompsRect = new Konva.Rect({
          draggable: false,
          x: 0,
          y: 0,
          width: 50,
          height: 50,
          strokeWidth: 1,
          fill: 'rgba(60,151,224,0.06)',
          stroke: '#3c97e0',
          dash: [3, 1]
        })

        this.konvaObjs.selCompsGroup = new Konva.Group({
          draggable: true,
          // dragBoundFunc: function (pos) {
          //   if (hotkeys.shift) {
          //     return {
          //       x: pos.x,
          //       y: this.getAbsolutePosition().y
          //     }
          //   } else {
          //     return {
          //       x: pos.x,
          //       y: pos.y,
          //     }
          //   }
          // }
        })

        this.konvaObjs.selCompsGroup.on('dragstart ', () => {
          this.konvaObjs.groupTransformer.resizeEnabled(false)
          this.konvaObjs.groupTransformer.rotateEnabled(false)
          this.konvaObjs.groupTransformer.borderEnabled(false)
          this.konvaObjs.layers[0].draw()
        })

        this.konvaObjs.selCompsGroup.on('dragend ', () => {
          // console.log('dragend ')
          this.konvaObjs.groupTransformer.resizeEnabled(true)
          this.konvaObjs.groupTransformer.rotateEnabled(true)
          this.konvaObjs.groupTransformer.borderEnabled(true)
          this.konvaObjs.layers[0].draw()
          this.syncGroupSel()
          this.curSelComps.forEach((comp) => {
            comp.syncCompLayout()
          })
        })

        //click
        this.konvaObjs.stage.on('mousedown', (e) => {
          // console.log(hotkeys.isPressed("space"))
          if (this.isKeySpacepressing) {
            // this.konvaObjs.stage.draggable(true)
            return
          }

          if (e.target === this.konvaObjs.stage && e.evt.button === 0) {
            // console.log(e)
            console.log('stage mousedown')

            this.isDragSelecting = true
            const mousePos = this.konvaObjs.stage.getPointerPosition()
            const x = mousePos.x
            const y = mousePos.y
            console.log('x: ' + x + ', y: ' + y)
            this.konvaObjs.selCompsRect.width(0)
            this.konvaObjs.selCompsRect.height(0)
            this.konvaObjs.selCompsRect.moveTo(this.konvaObjs.layers[0])
            this.konvaObjs.selCompsRect.setAbsolutePosition(mousePos)
          }
        })

        this.konvaObjs.stage.on('mousemove', (e) => {
          // console.log('mousemove')
          if (this.isDragSelecting) {
            const mousePos = this.konvaObjs.stage.getPointerPosition()
            const x = mousePos.x - this.konvaObjs.stage.x()
            const y = mousePos.y - this.konvaObjs.stage.y()
            this.konvaObjs.selCompsRect.width(x - this.konvaObjs.selCompsRect.x())
            this.konvaObjs.selCompsRect.height(y - this.konvaObjs.selCompsRect.y())
            this.konvaObjs.layers[0].draw()
          }
        })

        this.konvaObjs.stage.on('mouseup', (e) => {
          if (e.evt.button === 0) {

            console.log('state mouseup')

            if (this.isDragSelecting) {
              const l = this.getDragSelectingRect(this.konvaObjs.selCompsRect)
              // console.log(l)

              const newSels = []
              for (const comp of this.comps) {
                if (this.isRectContain(l, comp.konvaRect())) {
                  newSels.push(comp)
                }
              }

              this.konvaObjs.transformer.detach()
              this.unGroupSelAll()
              if (newSels.length > 0) {
                // this.unGroupSelAll()
                this.curSelComps = newSels
              } else {
                this.konvaObjs.layers[0].draw()
              }

              // this.konvaObjs.selCompsRect.remove()
              // this.konvaObjs.selCompsRect.width(0)
              // this.konvaObjs.selCompsRect.height(0)
              // this.konvaObjs.layers[0].draw()
              // this.isDragSelecting = false
            }
          }

          this.konvaObjs.selCompsRect.remove()
          this.konvaObjs.selCompsRect.width(0)
          this.konvaObjs.selCompsRect.height(0)
          this.konvaObjs.layers[0].draw()
          this.isDragSelecting = false
        })

        this.konvaObjs.stage.on('dragmove', (e) => {
          this.canvasLayout.x = this.konvaObjs.stage.x()
          this.canvasLayout.y = this.konvaObjs.stage.y()
        })

        CompCtrl.konvaContext = this.konvaObjs


        this.comps.forEach((comp) => {
          // comp.konvaContext = this.konvaObjs
          comp.initKonva()
          this.addCompEvent(comp)
        })

        // this.konvaObjs.layers[0].draw()
        this.konvaObjs.stage.draw()
      },

      addCompEvent(compCtrl) {
        // comp.setContext(this.konvaObjs)
        compCtrl.konvaRect().on('click', (e) => {
          if (e.evt.button === 0) {
            if (!this.isInSelGroup(compCtrl)) {
              // 不在多选组内
              if (!hotkeys.shift) {
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

        compCtrl.konvaRect().on('dragstart', () => {
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
          const groupRect = this.konvaObjs.selCompsGroup.getClientRect()
          const g = {
            type: 'ScadaGroup',
            layout: {
              x: groupRect.x + 1 - this.konvaObjs.stage.x(),
              y: groupRect.y + 1 - this.konvaObjs.stage.y(),
              width: groupRect.width - 2,
              height: groupRect.height - 2
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
        this.konvaObjs.transformer.detach()
        this.curSelComps.forEach((comp) => {
          this.konvaObjs.selCompsGroup.add(comp.konvaRect())
          comp.konvaRect().draggable(false)
          if (!comp.tempTr) {
            comp.tempTr = new Konva.Transformer({
              node: comp.konvaRect(),
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
      getDragSelectingRect(node) {
        const x = node.getAbsolutePosition().x
        const y = node.getAbsolutePosition().y
        return {
          x: node.width() >= 0 ? x : x + node.width(),
          y: node.height() >= 0 ? y : y + node.height(),
          width: Math.abs(node.width()),
          height: Math.abs(node.height())
        }
      },
      isRectContain(r1, node) {
        // const r1 = rect
        console.log(r1)
        const r2 = node.getClientRect()
        console.log(r2)
        return (r1.x <= r2.x &&
          r1.x + r1.width >= r2.x + r2.width &&
          r1.y <= r2.y &&
          r1.y + r1.height >= r2.y + r2.height
        )
      },
      syncKonvaZIndex() {
        this.comps.forEach((comp, index) => {
          comp.konvaRect().setZIndex(index)
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
          console.log(`${index} : ${comp.konvaRect().name()} ${comp.konvaRect().getZIndex()}`)
        })
      },
      addCompToCanvas(comp) {
        // Object.assign(comp, { konvaContext: this.konvaObjs })
        const c = new CompCtrl(comp)
        this.addComp(c)
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
      getCompOptions() {
        if (this.curSelComp) {
          return _.merge({}, this.getCompDefaultOptions(), this.curSelComp.options)
        }
        return null
      },
      initCompCtrlPanel() {
        if (this.getCompOptions()) {
          const compStyles = Object.assign({}, this.getCompOptions().style)
          // console.log(compStyles)
          const styleCtrls = {}
          for (const key in compStyles) {
            styleCtrls[key] = {
              value: compStyles[key],
              label: styleDefs[key].label,
              type: styleDefs[key].type
            }
          }
          this.curSelCompStyleOptions = styleCtrls
        }
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
          this.curSelComp.options.style = utils.diff(newVal, compStyles)
        }
      }
    },
    computed: {
      svgViewbox() {
        const x = (-this.canvasLayout.x / this.canvasLayout.scale).toFixed(2)
        const y = (-this.canvasLayout.y / this.canvasLayout.scale).toFixed(2)
        const w = (this.canvasLayout.width / this.canvasLayout.scale).toFixed(2)
        const h = (this.canvasLayout.height / this.canvasLayout.scale).toFixed(2)
        return `${x} ${y} ${w} ${h}`
      },
      curSelComp() {
        if (this.curSelComps.length === 1) {
          return this.curSelComps[0]
        } else {
          return null
        }
      },
      canGroupComps() {
        return this.curSelComps.length > 1
      },
      canDoSelCompAction() {
        return this.curSelComps.length > 0
      },
      canUnGroupComps() {
        return (this.curSelComps.length === 1 && this.curSelComps[0].type === 'ScadaGroup')
      },
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
            this.addToGroup()
          }
        } else {
          this.konvaObjs.transformer.detach()
          this.cancelSelGroup()
          this.curSelCompStyleOptions = null
        }
        this.syncKonvaZIndex()
      },
      curSelCompLayout: {
        handler: function () {
          console.log('comp layout changed')
          if (this.curSelComp) {
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
      isKeySpacepressing() {
        console.log(this.isKeySpacepressing)
        if (this.isKeySpacepressing) {
          this.konvaObjs.stage.draggable(true)
          this.konvaObjs.stage.container().style.cursor = '-webkit-grabbing'
        } else {
          this.konvaObjs.stage.draggable(false)
          this.konvaObjs.stage.container().style.cursor = 'default'
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
      background: #3C3F41;
      flex: 0 0 54px;
      border-bottom: 1.5px solid #2B2B2B;
    }
    main {
      display: flex;
      flex: 1;
      /*flex-basis: auto;*/
      /*width: 100%;*/
      /*height: 100%;*/
      #left_sidebar {
        flex: 0 0 100px;
        background: #3C3F41;
        border-right: 1px solid #000;
        /*border-top: 1px solid #2B2B2B;*/
      }
      #work_area {
        /*flex: 1;*/
        width: 100%;
        height: 100%;
        /*overflow: scroll;*/
        #work_frame {
          width: 100%;
          height: 100%;
          position: relative;
          background: #2B2B2B;
          overflow: auto;
          #work_canvas {
            width: 100%;
            height: 100%;
            user-select: none;
          }
        }
      }
      #right_sidebar {
        /*border-top: 1px solid #2B2B2B;*/
        border-left: 1px solid #000;
        flex: 0 0 280px;
        background: #3C3F41;
        #layout_panel {
          border-bottom: 1.5px solid #2B2B2B;
          padding: 12px 16px;
          label {
            letter-spacing: 1.5px;
            display: inline-block;
            color: #DDD;
            font-size: 13px;
          }
          .layout-input {
            width: 95px;
            margin-left: 10px;
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
      margin: 7px;
      padding: 5px;
      button {
        margin-right: 5px;
      }
      span {
        /*color: #DDD;*/
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
      }
    }
  }

</style>