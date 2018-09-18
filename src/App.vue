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

      <component v-for="item in comps"
                 :key="item.id"
                 :is="item.comp.type"
                 :options="item.comp.options"
                 :layout="{
                  x: item.x,
                  y: item.y,
                  width: item.width,
                  height: item.height,
                  scaleX: item.scaleX,
                  scaleY: item.scaleY,
                  offsetX: item.offsetX,
                  offsetY: item.offsetY,
                  rotation: item.rotation,
                 }"/>
    </svg>
    <div id="workarea" style="height: 100vh; user-select: none"></div>
    <div class="toolbar" style="position: fixed;top: 0;left: 0;">
      <!--<button @click="btnClicked">add</button>-->
      <!--<button @click="btnZoomInClicked">zoom+</button>-->
      <!--<button @click="btnZoomOutClicked">zoom-</button>-->
      <!--<button @click="btnClicked1">log</button>-->
      <button @click="addRect">addRect</button>
      <button @click="addIcon">add tw</button>
      <button @click="addIcon2">add gg</button>
      <button @click="btnGroup">group</button>
      <button @click="unGroupSelAll">ungroup</button>
    </div>
  </section>

</template>

<script>
  import Guid from './utils/guid'
  import Konva from 'konva'
  import ScadaImage from './components/image'
  import ScadaRect from './components/rect'
  import _ from 'lodash'

  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  import hotkeys from 'hotkeys-js'

  export default {
    components: { ScadaImage, ScadaRect },
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
        isRectSelecting: false
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
        anchorSize: 8,
        rotationSnaps: [0, 90, 180, 270]
      })

      this.konvaObjs.groupTransformer = new Konva.Transformer({
        keepRatio: true,
        // resizeEnabled: false,
        rotateEnabled: false,
        // rotationSnaps: [],
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
      })

      this.konvaObjs.groupTransformer.on('transformend', () => {
        console.log('transformend ')
        this.refreashGroupSel()
        this.curSelComps.forEach((comp) => {
          // console.log(compScale)
          this.updateLayout(comp)
          // if (comp.tempTr) {
          //   comp.tempTr.forceUpdate()
          // }
        })
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })

      this.konvaObjs.groupTransformer.on('transform', () => {
        // console.log('transform')
        this.curSelComps.forEach((comp) => {
          // console.log(compScale)
          this.updateLayout(comp)
          if (comp.tempTr) {
            comp.tempTr.forceUpdate()
          }
        })
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })

      this.konvaObjs.selCompsGroup = new Konva.Group({
        draggable: true,
        // dragBoundFunc: function (pos) {
        //   return {
        //     x: pos.x,
        //     y: this.getAbsolutePosition().y
        //   }
        // }
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

      this.konvaObjs.selCompsGroup.on('dragend ', () => {
        console.log('dragend ')
        this.refreashGroupSel()
        this.curSelComps.forEach((comp) => {
          // const compPosition = comp.konvaRect.getAbsolutePosition()
          // console.log(compPosition)
          this.updateLayout(comp)
        })
      })

      //click
      this.konvaObjs.stage.on('mousedown', (e) => {
        console.log('mousedown')
        // if click on empty area - remove all transformers
        if (e.target === this.konvaObjs.stage) {
          // this.konvaObjs.stage.find('Transformer').detach()
          this.konvaObjs.transformer.detach()
          // if (this.curSelComps.length > 0) {
          this.unGroupSelAll()
          // }
          this.konvaObjs.layers[0].draw()

          this.isRectSelecting = true
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
        if (this.isRectSelecting) {
          const mousePos = this.konvaObjs.stage.getPointerPosition()
          const x = mousePos.x
          const y = mousePos.y
          this.konvaObjs.selCompsRect.width(x - this.konvaObjs.selCompsRect.x())
          this.konvaObjs.selCompsRect.height(y - this.konvaObjs.selCompsRect.y())
          this.konvaObjs.layers[0].draw()
        }
      })

      this.konvaObjs.stage.on('mouseup', (e) => {
        console.log('mouseup')
        // console.log(this.konvaObjs.selCompsRect.getAbsolutePosition())
        console.log(this.konvaObjs.selCompsRect.x())
        console.log(this.konvaObjs.selCompsRect.width())
        if (this.isRectSelecting) {
          // const mousePos = this.konvaObjs.stage.getPointerPosition()
          // const x = mousePos.x
          // const y = mousePos.y
          this.konvaObjs.selCompsRect.remove()
          this.konvaObjs.layers[0].draw()
        }
      })


      this.konvaObjs.layers[0].draw()
    },
    methods: {
      getCompOptions(options) {
        return {
          id: Guid(),
          x: options.x,
          y: options.y,
          width: options.width,
          height: options.height,
          scaleX: 1,
          scaleY: 1,
          offsetX: options.offsetX,
          offsetY: options.offsetY,
          rotation: 0,
          strokeWidth: 1,
          // stroke: '#F00',
          name: Guid(),
          draggable: true,
          konvaRect: null,
          comp: options.comp
        }
      },
      addComp(comp) {
        this.comps.push(comp)
        comp.konvaRect = new Konva.Rect(comp)

        comp.konvaRect.on('click', () => {
          if (comp.konvaRect.getParent().getType() !== 'Group') {
            // 不在多选组内
            if (!hotkeys.shift) {
              this.curSelComps = []
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
                this.removeCompfromGroupSel(comp)
                this.curSelComps.splice(_.findIndex(this.curSelComps, comp), 1)
              }
            }
          }
        })

        comp.konvaRect.on('dragstart', () => {
          if (comp.konvaRect.getParent().getType() !== 'Group') {
            this.curSelComps = []
            this.curSelComps.push(comp)
          }
        })

        // comp.konvaRect.on('dragmove', () => {
        //   this.updateLayout(comp)
        // })


        comp.konvaRect.on('dragend transformend', () => {
          this.updateLayout(comp)
          this.konvaObjs.transformer.rotateEnabled(true)
          this.konvaObjs.transformer.resizeEnabled(true)
          this.konvaObjs.transformer.forceUpdate()
          this.konvaObjs.layers[0].draw()
        })
        // comp.konvaRect.on('transform', () => {
        //   this.updateLayout(comp)
        // })
        // comp.konvaRect.on('transformend', () => {
        //   updateLayout(comp)
        // })
        comp.konvaRect.on('dragstart', () => {
          this.konvaObjs.transformer.rotateEnabled(false)
          this.konvaObjs.transformer.resizeEnabled(false)
          this.konvaObjs.layers[0].draw()
        })

        this.konvaObjs.layers[0].add(comp.konvaRect)
        this.konvaObjs.layers[0].draw()
      },
      addRect() {
        this.addComp(this.getCompOptions({
          x: 200,
          y: 200,
          width: 120,
          height: 100,
          offsetX: -60,
          offsetY: -50,
          comp: {
            type: 'ScadaRect'
          }
        }))
      },
      addIcon() {
        this.addComp(this.getCompOptions({
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          offsetX: -50,
          offsetY: -50,
          comp: {
            type: 'ScadaImage',
            options: {
              url: '/images/twitter.svg'
            }
          },
        }))
      },
      addIcon2() {
        this.addComp(this.getCompOptions({
          x: 300,
          y: 300,
          width: 200,
          height: 68,
          offsetX: -100,
          offsetY: -34,
          comp: {
            type: 'ScadaImage',
            options: {
              url: '/images/google.png'
            }
          },
        }))
      },
      updateLayout(comp) {
        comp.x = comp.konvaRect.getAbsolutePosition().x
        comp.y = comp.konvaRect.getAbsolutePosition().y
        comp.scaleX = comp.konvaRect.getAbsoluteScale().x
        comp.scaleY = comp.konvaRect.getAbsoluteScale().y
        comp.rotation = comp.konvaRect.rotation()
      },
      addTransformer(node) {
        // if (!node.hasName('rect')) {
        //   return;
        // }
        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        // this.konvaObjs.stage.find('Transformer').destroy()
        //
        // // create new transformer
        // const tr = new Konva.Transformer({
        //   keepRatio: false,
        //   anchorSize: 8,
        //   rotationSnaps: [0, 90, 180, 270]
        // })
        this.konvaObjs.layers[0].add(this.konvaObjs.transformer)
        this.konvaObjs.transformer.attachTo(node)
        this.konvaObjs.layers[0].draw()
      },
      // unGroupSelAll() {
      //   this.curSelComps.forEach((comp) => {
      //     comp.konvaRect.moveTo(this.konvaObjs.layers[0])
      //     comp.konvaRect.draggable(true)
      //   })
      //   this.konvaObjs.groupTransformer.detach()
      //   this.konvaObjs.layers[0].draw()
      //   this.curSelComps = []
      // },
      removeCompfromGroupSel(comp) {
        if (comp.tempTr) {
          comp.tempTr.destroy()
          comp.tempTr = null
        }
        const compPosition = comp.konvaRect.getAbsolutePosition()
        comp.konvaRect.moveTo(this.konvaObjs.layers[0])
        comp.konvaRect.setAbsolutePosition(compPosition)
        comp.konvaRect.scale({
          x: comp.konvaRect.getAbsoluteScale().x,
          y: comp.konvaRect.getAbsoluteScale().y
        })
        comp.konvaRect.draggable(true)
      },
      unGroupSelAll() {
        this.curSelComps.forEach((comp) => {
          this.removeCompfromGroupSel(comp)
        })
        this.curSelComps = []
      },
      btnGroup() {
        this.curSelComps = []
        this.konvaObjs.transformer.detach()
        this.curSelComps.push(this.comps[0])
        this.curSelComps.push(this.comps[1])

        this.curSelComps.forEach((comp) => {
          this.konvaObjs.selCompsGroup.add(comp.konvaRect)

          // comp.konvaRect.moveTo(this.konvaObjs.selCompsGroup)
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

          // console.log(tr)
        })
        this.konvaObjs.layers[0].add(this.konvaObjs.selCompsGroup)
        this.konvaObjs.layers[0].add(this.konvaObjs.groupTransformer)
        this.konvaObjs.groupTransformer.attachTo(this.konvaObjs.selCompsGroup)
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      },
      addToGroup() {
        this.konvaObjs.transformer.detach()
        // this.konvaObjs.selCompsGroup.removeChildren()
        this.curSelComps.forEach((comp) => {
          this.konvaObjs.selCompsGroup.add(comp.konvaRect)

          // comp.konvaRect.moveTo(this.konvaObjs.selCompsGroup)
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
        hotkeys('*', (e) => {
        })
      },
      isInSelGroup(comp) {
        return _.findIndex(this.curSelComps, comp) >= 0
      },
      refreashGroupSel() {
        this.curSelComps.forEach((comp) => {
          this.removeCompfromGroupSel(comp)
        })
        this.cancelSelGroup()
        this.addToGroup()
      }
    },
    computed: {
      // curSelComps() {
      //
      // },
      svgViewbox() {
        const x = (-this.canvasLayout.x / this.canvasLayout.scale).toFixed(2)
        const y = (-this.canvasLayout.y / this.canvasLayout.scale).toFixed(2)
        const w = (this.canvasLayout.width / this.canvasLayout.scale).toFixed(2)
        const h = (this.canvasLayout.height / this.canvasLayout.scale).toFixed(2)
        return `${x} ${y} ${w} ${h}`
      }
    },
    watch: {
      curSelComps() {
        console.log('curSelComps:' + this.curSelComps.length)
        if (this.curSelComps.length > 0) {
          if (this.curSelComps.length === 1) {
            this.removeCompfromGroupSel(this.curSelComps[0])
            this.addTransformer(this.curSelComps[0].konvaRect)
            this.cancelSelGroup()
          } else {
            this.addToGroup()
          }
        } else {
          // console.log('ungroup')
          this.cancelSelGroup()
        }
      }
    }
  }

</script>
<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    background: #2B2B2B;
  }

  #workarea {
    height: 100vh;
    user-select: none;
  }

  .toolbar {
    padding: 5px;
    button {
      margin-right: 5px;
    }
  }
</style>