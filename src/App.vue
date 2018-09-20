<template>
  <section>

    <svg style="position: absolute; left: 0;top: 0;"
         :width="canvasLayout.width"
         :height="canvasLayout.height"
         :viewBox="svgViewbox">
      <!--<g v-for="item in comps"-->
      <!--:key="item.id"-->
      <!--:width="item.width"-->
      <!--:height="item.height"-->
      <!--:transform="`translate(${item.x - item.offsetX * item.scaleX} ${item.y - item.offsetY * item.scaleY})-->
      <!--rotate(${item.rotation} ${item.offsetX * item.scaleX} ${item.offsetY * item.scaleY})-->
      <!--scale(${item.scaleX} ${item.scaleY})`">-->
      <!--&lt;!&ndash;<rect fill="#DDD" height="25" width="20"/>&ndash;&gt;-->
      <!--&lt;!&ndash;<rect fill="#0F0" x="30" y="20" height="35" width="40"/>&ndash;&gt;-->
      <!--&lt;!&ndash;<image xlink:href="./assets/twitter.svg" width="100" height="100"/>&ndash;&gt;-->
      <!--<component :is="item.comp.type"/>-->
      <!--</g>-->

      <component v-for="comp in comps"
                 :key="comp.name"
                 :is="comp.type"
                 :comp="comp"
                 :options="comp.options"/>
    </svg>
    <div id="workarea"></div>
    <div class="toolbar" style="position: fixed;top: 0;left: 0;">
      <!--<button @click="btnClicked">add</button>-->
      <!--<button @click="btnZoomInClicked">zoom+</button>-->
      <!--<button @click="btnZoomOutClicked">zoom-</button>-->
      <!--<button @click="btnClicked1">log</button>-->
      <button @click="addLabel">label</button>
      <button @click="addRect">rect</button>
      <button @click="addIcon">twitter</button>
      <button @click="addIcon2">google</button>
      <button @click="addAll">add all</button>
      <span style="display: inline-block; width: 20px"/>
      <button @click="showNodeZIndex">z index</button>
      <span style="display: inline-block; width: 20px"/>
      <button @click="compsMoveTop">to top</button>
      <button @click="compsMoveBottom">to bottom</button>
      <button @click="compsDelete">delete</button>
      <span style="display: inline-block; width: 20px"/>
      <button @click="testImport">import</button>
      <button @click="classTest">test</button>
      <span style="display: inline-block; width: 20px"/>
      <div style="display: inline-block" v-if="curSelCompLayout">
        <span>x </span><input type="number" class="layout-input" v-model.number="curSelCompLayoutX">
        <span>y </span><input type="number" class="layout-input" v-model.number="curSelCompLayoutY">
        <span>w </span><input type="number" class="layout-input" v-model.number="curSelCompLayoutW">
        <span>h </span><input type="number" class="layout-input" v-model.number="curSelCompLayoutH">
        <span>r </span><input type="number" class="layout-input" v-model.number="curSelCompLayoutR" disabled>
      </div>
      <!--<button @click="unGroupSelAll">ungroup</button>-->
    </div>
  </section>

</template>

<script>
  import CompCtrl from './class/CompCtrl'

  import Konva from 'konva'
  import _ from 'lodash'
  import hotkeys from 'hotkeys-js'

  import ScadaImage from './components/image'
  import ScadaRect from './components/rect1'
  import ScadaLabel from './components/label'


  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  import CompConfig from './temp/compConfig1'

  export default {
    components: { ScadaImage, ScadaRect, ScadaLabel },
    name: 'Editor',
    data() {
      return {
        comps: [],
        canvasLayout: {
          width: WIDTH,
          height: HEIGHT,
          x: 0,
          y: 0,
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
        testData: 2
      }
    },
    mounted() {
      this.initHotkeyBinding()
      const width = window.innerWidth
      const height = window.innerHeight

      this.konvaObjs.stage = new Konva.Stage({
        container: 'workarea',
        width: width,
        height: height
      });

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
        rotateEnabled: false,
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
        stroke: '#AAA',
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
        this.konvaObjs.groupTransformer.borderEnabled(false)
        this.konvaObjs.layers[0].draw()
      })

      this.konvaObjs.selCompsGroup.on('dragend ', () => {
        // console.log('dragend ')
        this.konvaObjs.groupTransformer.resizeEnabled(true)
        this.konvaObjs.groupTransformer.borderEnabled(true)
        this.konvaObjs.layers[0].draw()
        this.syncGroupSel()
        this.curSelComps.forEach((comp) => {
          // const compPosition = comp.konvaRect.getAbsolutePosition()
          // console.log(compPosition)
          comp.syncCompLayout()
        })
      })

      //click
      this.konvaObjs.stage.on('mousedown', (e) => {
        if (e.target === this.konvaObjs.stage) {
          console.log('stage mousedown')
          // this.konvaObjs.transformer.detach()
          // this.unGroupSelAll()
          // this.konvaObjs.layers[0].draw()

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
          const x = mousePos.x
          const y = mousePos.y
          this.konvaObjs.selCompsRect.width(x - this.konvaObjs.selCompsRect.x())
          this.konvaObjs.selCompsRect.height(y - this.konvaObjs.selCompsRect.y())
          this.konvaObjs.layers[0].draw()
        }
      })

      this.konvaObjs.stage.on('mouseup', (e) => {
        console.log('state mouseup')

        // if (e.target === this.konvaObjs.stage) {
        //   console.log('stage mouseup')
        //   this.konvaObjs.transformer.detach()
        //   this.unGroupSelAll()
        //   this.konvaObjs.layers[0].draw()
        // }

        if (this.isDragSelecting) {
          const l = this.getDragSelectingRect(this.konvaObjs.selCompsRect)
          console.log(l)

          // this.konvaObjs.layers[0].add(new Konva.Rect(Object.assign({
          //   strokeWidth: 1,
          //   stroke: '#AAA'
          // }, l)))
          // console.log(this.isRectContain(l, this.comps[0].konvaRect))

          const newSels = []
          for (const comp of this.comps) {
            if (this.isRectContain(l, comp.konvaRect)) {
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

          this.konvaObjs.selCompsRect.remove()
          this.konvaObjs.selCompsRect.width(0)
          this.konvaObjs.selCompsRect.height(0)
          this.konvaObjs.layers[0].draw()
          this.isDragSelecting = false
        }
      })

      this.konvaObjs.layers[0].draw()
    },
    methods: {
      addComp(comp) {
        // comp.setContext(this.konvaObjs)
        comp.konvaRect.on('click', () => {
          if (!this.isInSelGroup(comp)) {
            // 不在多选组内
            if (!hotkeys.shift) {
              this.unGroupSelAll()
              this.curSelComps.push(comp)
            } else {
              if (!this.isInSelGroup(comp)) {
                this.curSelComps.push(comp)
              }
            }
          } else {
            // 在多选组内
            if (hotkeys.shift) {
              if (this.isInSelGroup(comp)) {
                comp.removeCompfromGroupSel()
                this.curSelComps.splice(_.findIndex(this.curSelComps, comp), 1)
              }
            }
          }
        })

        comp.konvaRect.on('dragstart', () => {
          console.log('dragstart')
          if (!this.isInSelGroup(comp)) {
            this.unGroupSelAll()
            this.curSelComps.push(comp)
          }
        })

        this.comps.push(comp)
        // this.konvaObjs.layers[0].add(comp.konvaRect)
        // this.konvaObjs.layers[0].draw()
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
            width: 120,
            height: 100
          },
          options: {
            style: {
              strokeWidth: 2
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
      unGroupSelAll() {
        this.curSelComps.forEach((comp) => {
          comp.removeCompfromGroupSel()
        })
        this.curSelComps = []
      },
      addToGroup() {
        this.konvaObjs.transformer.detach()
        this.curSelComps.forEach((comp) => {
          this.konvaObjs.selCompsGroup.add(comp.konvaRect)
          comp.konvaRect.draggable(false)
          if (!comp.tempTr) {
            comp.tempTr = new Konva.Transformer({
              node: comp.konvaRect,
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
        this.konvaObjs.layers[0].draw()
      },
      initHotkeyBinding() {
        hotkeys('delete ', (e, handler) => {
          switch (handler.key) {
            case "delete":
              this.compsDelete()
              break;
          }
        })
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
        return {
          x: node.width() >= 0 ? node.x() : node.x() + node.width(),
          y: node.height() >= 0 ? node.y() : node.y() + node.height(),
          width: Math.abs(node.width()),
          height: Math.abs(node.height())
        }
      },
      isRectContain(r1, node) {
        // const r1 = rect
        const r2 = node.getClientRect()
        return (r1.x <= r2.x &&
          r1.x + r1.width >= r2.x + r2.width &&
          r1.y <= r2.y &&
          r1.y + r1.height >= r2.y + r2.height
        )
      },
      syncKonvaZIndex() {
        this.comps.forEach((comp, index) => {
          comp.konvaRect.setZIndex(index)
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
          console.log(`${index} : ${comp.konvaRect.name()} ${comp.konvaRect.getZIndex()}`)
        })
      },
      addCompToCanvas(comp) {
        Object.assign(comp, { konvaContext: this.konvaObjs })
        const c = new CompCtrl(comp)
        this.addComp(c)
      },
      testImport() {
        CompConfig.comps.forEach((comp) => {
          this.addCompToCanvas(comp)
        })
      },
      classTest() {
        // CompConfig.comps.forEach((comp) => {
        //   this.addCompToCanvas(comp)
        // })
        // this.comps[0].options.style.strokeWidth = 5
        // this.comps[0].x = this.comps[0].x + 10
        // this.comps[0].y = this.comps[0].y + 10
        // this.comps[0].x = this.comps[0].x / 1.1
        // this.comps[0].y = this.comps[0].y / 1.1
        this.comps[0].scaleX = this.comps[0].scaleX * 1.1
        this.comps[0].scaleY = this.comps[0].scaleY * 1.1
        // this.comps[0].scaleY = 1.5
        // this.comps[0].scaleX = 2
        // this.comps[0].rotation = 30
        // this.comps[0].syncKonva()
      },
      getRoundNum(num) {
        return Math.round(num * 100) / 100
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
      curSelCompLayoutX: {
        get() {
          if (this.curSelComp) {
            return this.getRoundNum(this.curSelComp.x - this.curSelComp.offsetX)
          } else {
            return null
          }
        },
        set(v) {
          this.curSelComp.x = v + this.curSelComp.offsetX
        }
      },
      curSelCompLayoutY: {
        get() {
          if (this.curSelComp) {
            return this.getRoundNum(this.curSelComp.y - this.curSelComp.offsetY)
          } else {
            return null
          }
        },
        set(v) {
          this.curSelComp.y = v + this.curSelComp.offsetY
        }
      },
      curSelCompLayoutW: {
        get() {
          if (this.curSelComp) {
            return this.getRoundNum(this.curSelComp.width * this.curSelComp.scaleX)
          } else {
            return null
          }
        },
        set(v) {
          this.curSelComp.scaleX = v / this.curSelComp.width
        }
      },
      curSelCompLayoutH: {
        get() {
          if (this.curSelComp) {
            return this.getRoundNum(this.curSelComp.height * this.curSelComp.scaleY)
          } else {
            return null
          }
        },
        set(v) {
          this.curSelComp.scaleY = v / this.curSelComp.height
        }
      },
      curSelCompLayoutR: {
        get() {
          if (this.curSelComp) {
            return this.getRoundNum(this.curSelComp.rotation)
          } else {
            return null
          }
        },
        set(v) {
          this.curSelComp.rotation = v
          // this.curSelComp.x = -(this.curSelComp.width * this.curSelComp.scaleX / 2) * Math.cos(v * Math.PI / 180) + (this.curSelComp.height * this.curSelComp.scaleY / 2) * Math.sin(v * Math.PI / 180) + this.curSelComp.x + this.curSelComp.width * this.curSelComp.scaleX / 2
          // this.curSelComp.y = -(this.curSelComp.width * this.curSelComp.scaleX / 2) * Math.sin(v * Math.PI / 180) - (this.curSelComp.height * this.curSelComp.scaleY / 2) * Math.cos(v * Math.PI / 180) + this.curSelComp.y + this.curSelComp.height * this.curSelComp.scaleY / 2
        }
      },
      curSelCompLayout: {
        get() {
          if (this.curSelComp) {
            return {
              x: this.getRoundNum(this.curSelComp.x),
              y: this.getRoundNum(this.curSelComp.y),
              scaleX: this.curSelComp.scaleX,
              scaleY: this.curSelComp.scaleY,
              rotation: this.getRoundNum(this.curSelComp.rotation),
              width: this.getRoundNum(this.curSelComp.width * this.curSelComp.scaleX),
              height: this.getRoundNum(this.curSelComp.height * this.curSelComp.scaleY),
            }
          } else {
            return null
          }
        },
        set(v) {
          console.log('vvv')
          if (this.curSelComp) {
            this.curSelComp.x = v.x
          }
        }
      },
      curSelComp() {
        if (this.curSelComps.length === 1) {
          return this.curSelComps[0]
        } else {
          return null
        }
      }
    },
    watch: {
      curSelComps() {
        console.log('curSelComps:' + this.curSelComps.length)
        if (this.curSelComps.length > 0) {
          if (this.curSelComps.length === 1) {
            // this.curSelComps[0].removeCompfromGroupSel()
            this.curSelComps[0].addTransformer()
            this.cancelSelGroup()
          } else {
            this.addToGroup()
          }
        } else {
          // console.log('ungroup')
          this.konvaObjs.transformer.detach()
          this.cancelSelGroup()
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
    }
  }

</script>
<style lang="scss">
  body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background: #2B2B2B;
    overflow: hidden;
  }

  #workarea {
    width: 100%;
    height: 100%;
    user-select: none;

  }

  .toolbar {
    padding: 5px;
    button {
      margin-right: 5px;
    }
    span {
      color: #DDD;
    }
    .layout-input {
      width: 60px;
      margin-right: 8px;
      text-align: right;
      padding: 0 3px;
    }
  }

</style>