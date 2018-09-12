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
        stage: null,
        layers: [],
        canvasLayout: {
          width: WIDTH,
          height: HEIGHT,
          x: 0,
          y: 0,
          scale: 1,
        },
        shapes: [{
          id: 0,
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          offsetX: -50,
          offsetY: -40,
          rotation: 0,
          strokeWidth: 1,
          // stroke: '#F00',
          name: 'rect',
          draggable: true,
          KonvaRect: null,
          comp: {
            type: 'ScadaImage'
          },
        }, {
          id: 1,
          x: 200,
          y: 200,
          width: 80,
          height: 60,
          scaleX: 1,
          scaleY: 1,
          offsetX: -40,
          offsetY: -30,
          rotation: 0,
          strokeWidth: 1,
          // stroke: '#F00',
          name: 'rect',
          draggable: true,
          KonvaRect: null,
          comp: {
            type: 'ScadaRect'
          },
        }]
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

      this.stage = new Konva.Stage({
        container: 'workarea',
        width: width,
        height: height
      });

      const layer = new Konva.Layer()
      this.layers.push(layer)
      this.stage.add(this.layers[0])

      // const rect1 = new Konva.Rect(this.shapes[0]);

      // function updateLayout(shape) {
      //   shape.x = shape.KonvaRect.x()
      //   shape.y = shape.KonvaRect.y()
      //   shape.scaleX = shape.KonvaRect.scaleX()
      //   shape.scaleY = shape.KonvaRect.scaleY()
      //   shape.rotation = shape.KonvaRect.rotation()
      // }

      // this.shapes[0].KonvaRect = new Konva.Rect(this.shapes[0]);
      // this.shapes[0].KonvaRect.on('dragmove', () => {
      //   updateLayout(this.shapes[0])
      // })
      // // this.shapes[0].KonvaRect.on('transform', () => {
      // //   updateLayout(this.shapes[0])
      // // })
      // this.shapes[0].KonvaRect.on('transformend', () => {
      //   updateLayout(this.shapes[0])
      // })
      //
      // layer.add(this.shapes[0].KonvaRect);

      // this.shapes.forEach((shape) => {
      //   shape.KonvaRect = new Konva.Rect(shape);
      //   // shape.KonvaRect.on('dragmove', () => {
      //   //   updateLayout(shape)
      //   // })
      //   shape.KonvaRect.on('dragend transformend', () => {
      //     this.updateLayout(shape)
      //   })
      //   // shape.KonvaRect.on('transform', () => {
      //   //   updateLayout(shape)
      //   // })
      //   // shape.KonvaRect.on('transformend', () => {
      //   //   updateLayout(shape)
      //   // })
      //
      //   this.layers[0].add(shape.KonvaRect)
      // })

      this.layers[0].draw()

      this.stage.on('click dragstart', (e) => {
        // if click on empty area - remove all transformers
        if (e.target === this.stage) {
          // stage.find('Transformer').destroy();
          this.layers[0].draw()
          return
        }
        this.addTransformer(e.target)
      })
    },
    methods: {
      addComp(comp) {
        this.comps.unshift(comp)
        comp.KonvaRect = new Konva.Rect(comp);
        // comp.KonvaRect.on('dragmove', () => {
        //   updateLayout(comp)
        // })
        comp.KonvaRect.on('dragend transformend', () => {
          this.updateLayout(comp)
        })
        // comp.KonvaRect.on('transform', () => {
        //   updateLayout(comp)
        // })
        // comp.KonvaRect.on('transformend', () => {
        //   updateLayout(comp)
        // })
        this.layers[0].add(comp.KonvaRect)
      },
      addRect() {
        this.addComp({
          id: Guid(),
          x: 200,
          y: 200,
          width: 80,
          height: 60,
          scaleX: 1,
          scaleY: 1,
          offsetX: -40,
          offsetY: -30,
          rotation: 0,
          strokeWidth: 1,
          // stroke: '#F00',
          name: Guid(),
          draggable: true,
          KonvaRect: null,
          comp: {
            type: 'ScadaRect'
          },
        })
      },
      updateLayout(comp) {
        comp.x = comp.KonvaRect.x()
        comp.y = comp.KonvaRect.y()
        comp.scaleX = comp.KonvaRect.scaleX()
        comp.scaleY = comp.KonvaRect.scaleY()
        comp.rotation = comp.KonvaRect.rotation()
      },
      addTransformer(node) {
        // if (!node.hasName('rect')) {
        //   return;
        // }
        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        this.stage.find('Transformer').destroy()

        // create new transformer
        const tr = new Konva.Transformer({
          keepRatio: false,
          anchorSize: 8,
          rotationSnaps: [0, 90, 180, 270]
        })
        this.layers[0].add(tr)
        tr.attachTo(node)
        this.layers[0].draw()
      },
      btnUnGroup() {
      },
      btnGroup() {
        const group = new Konva.Group({
          draggable: true,
          // dragBoundFunc: function (pos) {
          //   return {
          //     x: pos.x,
          //     y: this.getAbsolutePosition().y
          //   }
          // }
        })

        this.shapes.forEach((shape) => {
          // group.add(shape.KonvaRect)
          shape.KonvaRect.moveTo(group)
        })
        layer.add(group)

        let lastX = 0
        let lastY = 0

        group.on('mousedown', () => {
          lastX = group.x()
          lastY = group.y()
        })

        // dragend

        group.on('dragend transformend', () => {
          this.shapes.forEach((shape) => {
            // shape.KonvaRect.mo
            // shape.KonvaRect.moveTo(layer)
            console.log('gx: ' + group.x())
            console.log('gy: ' + group.y())
            console.log('gsx: ' + group.scaleX())
            console.log('gsy: ' + group.scaleY())
            // console.log(lastX)
            // console.log(lastY)
            shape.KonvaRect.x(shape.KonvaRect.x() + (group.x() - lastX) * group.scaleX())
            shape.KonvaRect.y(shape.KonvaRect.y() + (group.y() - lastY) * group.scaleY())
            updateLayout(shape)
          })
          group.x(0)
          group.y(0)
          layer.draw()
          lastX = group.x()
          lastY = group.y()
          // group.destroy()
        })

        const tr = new Konva.Transformer({
          keepRatio: false,
          anchorSize: 8,
          rotationSnaps: [0, 90, 180, 270],
          enabledAnchors: [],
          rotateEnabled: false
        })
        layer.add(tr)
        tr.attachTo(group)
      },
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