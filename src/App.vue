<template>
  <section>
    <svg style="position: absolute; left: 0;top: 0;"
         :width="canvasLayout.width"
         :height="canvasLayout.height"
         :viewBox="svgViewbox">
      <rect v-for="item in shapes"
            :key="item.id"
            :x="item.x - item.offsetX * item.scaleX"
            :y="item.y - item.offsetY * item.scaleY"
            fill="#DDD"
            :width="item.width * item.scaleX"
            :height="item.height * item.scaleY"
            :transform="`rotate(${item.rotation} ${item.x - item.offsetX * item.scaleX + (item.width * item.scaleX)/2} ${item.y - item.offsetY * item.scaleY + (item.height * item.scaleY)/2})`"
      />
    </svg>
    <div id="workarea" style="height: 100vh; user-select: none"></div>
  </section>

</template>

<script>

  import Konva from 'konva'

  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  export default {
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
          height: 90,
          scaleX: 1,
          scaleY: 1,
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
          strokeWidth: 1,
          stroke: '#F00',
          name: 'rect',
          draggable: true
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
      var width = window.innerWidth;
      var height = window.innerHeight;

      var stage = new Konva.Stage({
        container: 'workarea',
        width: width,
        height: height
      });

      var layer = new Konva.Layer();
      stage.add(layer);

      var rect1 = new Konva.Rect(this.shapes[0]);

      layer.add(rect1);

      // rect1.on('transformend', function () {
      //   console.log('transform end');
      // });

      layer.on('dragmove', (e) => {
        // get the shape that was clicked on
        // var shape = e.target;
        // console.log(`"${shape.getName()}" dragmove`);
        console.log(e.target.x())
        this.shapes[0].x = e.target.x()
        this.shapes[0].y = e.target.y()
      });

      layer.on('transformend', function (evt) {
        // get the shape that was clicked on
        var shape = evt.target;
        console.log(`"${shape.getName()}" transformend`);
      });


      layer.draw();

      stage.on('click', function (e) {
        // if click on empty area - remove all transformers
        if (e.target === stage) {
          stage.find('Transformer').destroy();
          layer.draw();
          return;
        }
        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName('rect')) {
          return;
        }
        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        stage.find('Transformer').destroy();

        // create new transformer
        var tr = new Konva.Transformer();

        tr.on('transformend', function () {
          console.log('transform end');
        });

        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
      })
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