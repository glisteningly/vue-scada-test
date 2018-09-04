<template>
  <div id="workarea" style="height: 100vh; user-select: none">

  </div>
</template>

<script>

  import Konva from 'konva'

  export default {
    name: 'Editor',
    data() {
      return {
        shapes: [{
          x: 60,
          y: 60,
          width: 100,
          height: 90,
          strokeWidth: 1,
          stroke: '#F00',
          name: 'rect',
          draggable: true
        }]
      }
    },
    computed: {},
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

  .toolbar {
    padding: 5px;
    button {
      margin-right: 5px;
    }
  }
</style>