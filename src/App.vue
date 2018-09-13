<template>
  <section>

    <svg style="position: absolute; left: 0;top: 0;"
         :width="canvasLayout.width"
         :height="canvasLayout.height"
         :viewBox="svgViewbox">
      <g v-for="item in comps"
         :key="item.id"
         :width="item.width"
         :height="item.height"
         :transform="`translate(${item.x - item.offsetX * item.scaleX} ${item.y - item.offsetY * item.scaleY})
            rotate(${item.rotation} ${item.offsetX * item.scaleX} ${item.offsetY * item.scaleY})
            scale(${item.scaleX} ${item.scaleY})`">
        <!--<rect fill="#DDD" height="25" width="20"/>-->
        <!--<rect fill="#0F0" x="30" y="20" height="35" width="40"/>-->
        <!--<image xlink:href="./assets/twitter.svg" width="100" height="100"/>-->
        <component :is="item.comp.type"/>
      </g>

      <!--<rect v-for="item in shapes"-->
      <!--:key="item.id"-->
      <!--fill="#DDD"-->
      <!--:width="item.width"-->
      <!--:height="item.height"-->
      <!--:transform="`translate(${item.x - item.offsetX * item.scaleX} ${item.y - item.offsetY * item.scaleY})-->
      <!--rotate(${item.rotation} ${item.offsetX * item.scaleX} ${item.offsetY * item.scaleY})-->
      <!--scale(${item.scaleX} ${item.scaleY})`"-->
      <!--/>-->
    </svg>
    <div id="workarea" style="height: 100vh; user-select: none"></div>
    <div class="toolbar" style="position: fixed;top: 0;left: 0;">
      <!--<button @click="btnClicked">add</button>-->
      <!--<button @click="btnZoomInClicked">zoom+</button>-->
      <!--<button @click="btnZoomOutClicked">zoom-</button>-->
      <!--<button @click="btnClicked1">log</button>-->
      <button @click="addRect">addRect</button>
      <button @click="addIcon">addIcon</button>
      <button @click="btnGroup">group</button>
      <button @click="btnUnGroup">ungroup</button>
    </div>
  </section>

</template>

<script>
  import Guid from './utils/guid'
  import Konva from 'konva'
  import ScadaImage from './components/icon'
  import ScadaRect from './components/rect'

  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  export default {
    components: { ScadaImage, ScadaRect },
    name: 'Editor',
    data() {
      return {
        comps: [],
        // stage: null,
        // layers: [],
        // transformer: null,
        // selCompsGroup: null,
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
        },
        curSelComps: [],
        groupLastPos: { x: 0, y: 0 }
      }
    },
    computed: {
      svgViewbox() {
        const x = (-this.canvasLayout.x / this.canvasLayout.scale).toFixed(2)
        const y = (-this.canvasLayout.y / this.canvasLayout.scale).toFixed(2)
        const w = (this.canvasLayout.width / this.canvasLayout.scale).toFixed(2)
        const h = (this.canvasLayout.height / this.canvasLayout.scale).toFixed(2)
        return `${x} ${y} ${w} ${h}`
      }
    },
    mounted() {
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
        resizeEnabled: false,
        rotateEnabled: false,
        rotationSnaps: []
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

      this.konvaObjs.selCompsGroup.on('dragend ', () => {
        this.curSelComps.forEach((comp) => {
          comp.konvaRect.x(comp.konvaRect.x() + this.konvaObjs.selCompsGroup.x())
          comp.konvaRect.y(comp.konvaRect.y() + this.konvaObjs.selCompsGroup.y())
          this.updateLayout(comp)
        })
        this.konvaObjs.selCompsGroup.x(0)
        this.konvaObjs.selCompsGroup.y(0)
      })


      this.konvaObjs.layers[0].draw()

      this.konvaObjs.stage.on('click dragstart', (e) => {
        // if click on empty area - remove all transformers
        if (e.target === this.konvaObjs.stage) {
          this.konvaObjs.stage.find('Transformer').detach()
          this.konvaObjs.layers[0].draw()
        }
      })
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
          stroke: '#F00',
          name: Guid(),
          draggable: true,
          konvaRect: null,
          comp: options.comp,
        }
      },
      addComp(comp) {
        this.comps.push(comp)
        comp.konvaRect = new Konva.Rect(comp)

        comp.konvaRect.on('click dragstart', () => {
          if (comp.konvaRect.getParent().getType() !== 'Group') {
            this.addTransformer(comp.konvaRect)
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
          width: 80,
          height: 60,
          offsetX: -40,
          offsetY: -30,
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
            type: 'ScadaImage'
          },
        }))
      },
      updateLayout(comp) {
        comp.x = comp.konvaRect.x()
        comp.y = comp.konvaRect.y()
        comp.scaleX = comp.konvaRect.scaleX()
        comp.scaleY = comp.konvaRect.scaleY()
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
      btnUnGroup() {

      },
      btnGroup() {
        this.konvaObjs.transformer.detach()
        this.curSelComps.push(this.comps[0])
        this.curSelComps.push(this.comps[1])

        this.curSelComps.forEach((comp) => {
          // group.add(comp.konvaRect)
          comp.konvaRect.moveTo(this.konvaObjs.selCompsGroup)
          comp.konvaRect.draggable(false)
          // comp.konvaRect.setListening(false)
        })
        this.konvaObjs.layers[0].add(this.konvaObjs.selCompsGroup)

        // let lastX = 0
        // let lastY = 0

        // group.on('mousedown', () => {
        //   lastX = group.x()
        //   lastY = group.y()
        // })
        //
        // // dragend transformend
        //
        // group.on('dragend ', () => {
        //   this.comps.forEach((comp) => {
        //     // comp.konvaRect.mo
        //     // comp.konvaRect.moveTo(layer)
        //     console.log('gx: ' + group.x())
        //     console.log('gy: ' + group.y())
        //     console.log('gsx: ' + group.scaleX())
        //     console.log('gsy: ' + group.scaleY())
        //     // console.log(lastX)
        //     // console.log(lastY)
        //     comp.konvaRect.x(comp.konvaRect.x() + (group.x() - lastX) * group.scaleX())
        //     comp.konvaRect.y(comp.konvaRect.y() + (group.y() - lastY) * group.scaleY())
        //     updateLayout(comp)
        //   })
        //   group.x(0)
        //   group.y(0)
        //   layer.draw()
        //   lastX = group.x()
        //   lastY = group.y()
        //   // group.destroy()
        // })

        this.konvaObjs.layers[0].add(this.konvaObjs.groupTransformer)
        this.konvaObjs.groupTransformer.attachTo(this.konvaObjs.selCompsGroup)
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      }
    }
  }

</script>
<style lang="scss">
  body {
    margin: 0;
    padding: 0;
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