<template>
  <section>
    <svg style="position: absolute; left: 0;top: 0;"
         :width="canvasLayout.width"
         :height="canvasLayout.height"
         :viewBox="svgViewbox">
      <g v-for="item in shapes"
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
  </section>

</template>

<script>

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
          stroke: '#F00',
          name: 'rect',
          // draggable: true,
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
          stroke: '#F00',
          name: 'rect',
          // draggable: true,
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
      const width = window.innerWidth;
      const height = window.innerHeight;

      const stage = new Konva.Stage({
        container: 'workarea',
        width: width,
        height: height
      });

      const layer = new Konva.Layer();
      stage.add(layer);

      // const rect1 = new Konva.Rect(this.shapes[0]);

      function updateLayout(shape) {
        shape.x = shape.KonvaRect.x()
        shape.y = shape.KonvaRect.y()
        shape.scaleX = shape.KonvaRect.scaleX()
        shape.scaleY = shape.KonvaRect.scaleY()
        shape.rotation = shape.KonvaRect.rotation()
      }

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

      this.shapes.forEach((shape) => {
        shape.KonvaRect = new Konva.Rect(shape);
        // shape.KonvaRect.on('dragmove', () => {
        //   updateLayout(shape)
        // })
        shape.KonvaRect.on('dragend transformend', () => {
          updateLayout(shape)
        })
        // shape.KonvaRect.on('transform', () => {
        //   updateLayout(shape)
        // })
        // shape.KonvaRect.on('transformend', () => {
        //   updateLayout(shape)
        // })

        layer.add(shape.KonvaRect)
      })

      const group = new Konva.Group({
        x: 0,
        y: 0,
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

      group.on('dragend', () => {
        this.shapes.forEach((shape) => {
          // shape.KonvaRect.mo
          // shape.KonvaRect.moveTo(layer)
          shape.KonvaRect.x(shape.KonvaRect.x() + group.x() - lastX)
          shape.KonvaRect.y(shape.KonvaRect.y() + group.y() - lastY)
          updateLayout(shape)
        })
        group.x(0)
        group.y(0)
        layer.draw()
        // group.destroy()
      })

      layer.on('transformend', function (evt) {
        // get the shape that was clicked on
        const shape = evt.target
        console.log(`"${shape.getName()}" transformend`)
      });


      layer.draw()

      function addTransformer(node) {
        if (!node.hasName('rect')) {
          return;
        }
        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        stage.find('Transformer').destroy()

        // create new transformer
        const tr = new Konva.Transformer({
          keepRatio: false,
          anchorSize: 8,
          rotationSnaps: [0, 90, 180, 270]
        })
        layer.add(tr)
        tr.attachTo(node)
        layer.draw()
      }

      stage.on('click dragstart', function (e) {
        // if click on empty area - remove all transformers
        if (e.target === stage) {
          stage.find('Transformer').destroy();
          layer.draw()
          return
        }
        // addTransformer(e.target)
      })

      // stage.on('dragstart', function (e) {
      //   // if click on empty area - remove all transformers
      //   if (e.target === stage) {
      //     stage.find('Transformer').destroy();
      //     layer.draw();
      //     return;
      //   }
      //   addTransformer(e.target)
      // })
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