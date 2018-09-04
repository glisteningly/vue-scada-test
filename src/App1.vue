<template>
  <div style="height: 100vh; user-select: none">
    <svg style="position: absolute; left: 0;top: 0;"
         :width="canvasLayout.width"
         :height="canvasLayout.height"
         :viewBox="svgViewbox">
      <rect v-for="item in list"
            :key="item.id"
            :x="item.x - item.offsetX * item.scaleX"
            :y="item.y - item.offsetY * item.scaleY"
            :fill="item.svgColor"
            :width="item.width * item.scaleX"
            :height="item.height * item.scaleY"
            :transform="`rotate(${item.rotation} ${item.x - item.offsetX * item.scaleX + (item.width * item.scaleX)/2} ${item.y - item.offsetY * item.scaleY + (item.height * item.scaleY)/2})`"
      />
    </svg>
    <v-stage ref="stage"
             :config="configKonva"
             @dragmove="handleStateDragmove"
             @click="stateClick">
      <v-layer>
        <v-rect :config="artBoard"/>
        <!--<v-circle :config="{-->
        <!--x: 200,-->
        <!--y: 100,-->
        <!--radius: 70,-->
        <!--fill: 'red',-->
        <!--stroke: 'black',-->
        <!--strokeWidth: 4-->
        <!--}"/>-->
      </v-layer>
      <v-layer ref="layer">
        <v-rect
          v-for="item in list"
          :key="item.id"
          :config="item"
          @transform="handleTransform"
          @dragmove="handleDragmove"
          @dragstart="handleDragstart1"
          @dragend="handleDragend1"/>
      </v-layer>
      <v-layer ref="dragLayer"></v-layer>
    </v-stage>
    <div class="toolbar" style="position: fixed;top: 0;left: 0;">
      <button @click="btnClicked">add</button>
      <button @click="btnZoomInClicked">zoom+</button>
      <button @click="btnZoomOutClicked">zoom-</button>
      <button @click="btnClicked1">log</button>
      <button @click="btnGroup">group</button>
    </div>

  </div>
</template>

<script>
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight
  let vm = {}
  let STATE = {}
  let TempGroup = {}

  export default {
    name: 'Editor',
    data() {
      return {
        list: [],
        configKonva: {
          width: WIDTH,
          height: HEIGHT,
          // draggable: true
        },
        canvasLayout: {
          width: WIDTH,
          height: HEIGHT,
          x: 0,
          y: 0,
          scale: 1,
        },
        artBoard: {
          name: 'artboard',
          width: WIDTH - 100,
          height: HEIGHT - 100,
          x: 50,
          y: 50,
          strokeWidth: 1,
          stroke: '#666',
        },
        curShape: null,
        groupConfig: {
          x: 0,
          y: 0,
          draggable: true
        }
      }
    },
    methods: {
      handleDragstart1(vueComp, e) {
        const stage = vm.$refs.stage.getStage()
        const layer = vm.$refs.layer.getStage()
        // console.log(a.getStage())
        stage.find('Transformer').destroy()

        // create new transformer
        this.curShape = e.target
        this.addTransformer(e.target)
      },
      handleDragend1(vueComp, e) {
        console.log(e)

        const shape = vueComp.getStage()
        console.log(shape)
        // vm.list[0].x = shape.attrs.x
        // vm.list[0].y = shape.attrs.y
      },
      handleDragmove(vueComp, e) {
        const shape = vueComp.getStage()
        // console.log(shape)
        vm.list[shape.index].x = e.target.x()
        vm.list[shape.index].y = e.target.y()
      },
      stateClick(vueComp, e) {
        console.log('clicked')
        const stage = vm.$refs.stage.getStage()
        const layer = vm.$refs.layer.getStage()
        if (e.target === stage) {
          // stage.find('Transformer').destroy()
          const tr = stage.find('Transformer')
          // if (!tr.isTransforming()) {
          // tr.destroy()
          layer.draw()
          // }
          return
        }
        // do nothing if clicked NOT on our rectangles
        if (!e.target.hasName('rect')) {
          return
        }
        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        stage.find('Transformer').destroy()

        // create new transformer
        // const tr = new Konva.Transformer({ keepRatio: false })
        // layer.add(tr)
        // tr.attachTo(e.target)
        // layer.draw()
        this.curShape = e.target
        this.addTransformer(e.target)
      },
      addTransformer(target) {
        const layer = vm.$refs.layer.getStage()
        // const layer = vm.$refs.dragLayer.getStage()
        const tr = new Konva.Transformer({
          keepRatio: false,
          boundBoxFunc: function (oldBoundBox, newBoundBox) {
            if (newBoundBox.width < 50 || newBoundBox.height < 50) {
              return oldBoundBox
            }
            return newBoundBox
          },
          rotationSnaps: [0, 90, 180, 270]
        })

        layer.add(tr)
        tr.attachTo(target)
        layer.draw()
      },
      handleTransform(vueComp, e) {
        const shape = vueComp.getStage()
        // console.log(shape.attrs.x)
        vm.list[shape.index].scaleX = e.target.scaleX()
        vm.list[shape.index].scaleY = e.target.scaleY()
        vm.list[shape.index].x = e.target.x()
        vm.list[shape.index].y = e.target.y()
        vm.list[shape.index].rotation = e.target.rotation()
      },
      //-----------------
      handleDragstart(vueComp, e) {
        const shape = vueComp.getStage()
        const dragLayer = vm.$refs.dragLayer.getStage()
        const stage = vm.$refs.stage.getStage()

        // moving to another layer will improve dragging performance
        shape.moveTo(dragLayer)
        stage.draw()

        stage.find('Transformer').destroy()

        // create new transformer
        this.addTransformer(e.target)
      },
      handleDragend(vueComp, e) {
        const shape = vueComp.getStage()
        // console.log(shape)
        const layer = vm.$refs.layer.getStage()
        const stage = vm.$refs.stage.getStage()

        shape.moveTo(layer)
        stage.draw()
      },
      btnClicked() {
        // console.log('asdasd')
        vm.list.push({
          name: 'rect',
          x: 200,
          y: 200,
          width: 200,
          height: 200,
          // strokeWidth: 1,
          draggable: true,
          stroke: '#F00',
          scaleX: 1,
          scaleY: 1,
          offsetX: 100,
          offsetY: 100,
          rotation: 0,
          svgColor: Konva.Util.getRandomColor()
        })
      },
      btnClicked1() {
        const stage = vm.$refs.stage.getStage()
        const shape = stage.find('.rect')
        console.log(shape)
      },
      handleStateDragmove(vueComp, e) {
        // console.log(e.target.x() + ',' + e.target.y())
        // console.log(e.target)
        const stage = vm.$refs.stage.getStage()
        if (e.target === stage) {
          this.canvasLayout.x = e.target.x()
          this.canvasLayout.y = e.target.y()
        }
      },
      btnZoomInClicked() {
        this.scaleCanvas(1.1)
      },
      btnZoomOutClicked() {
        this.scaleCanvas(1 / 1.1)
      },
      btnGroup() {
        // const group = new Konva.Group({
        //   x: 80,
        //   y: 80,
        //   width: 400,
        //   height: 400,
        //   draggable: true
        // })
        const layer = vm.$refs.layer.getStage()
        // layer.add(group)
        const shapes = STATE.find('.rect')
        shapes.forEach(shape => {
          // TempGroup.add(shape)
          console.log(shape)
          shape.moveTo(TempGroup)
        })

        // this.addTransformer(group)
        layer.draw()
      },
      scaleCanvas(scale) {
        const oldScale = STATE.scaleX()
        const newScale = oldScale * scale
        this.canvasLayout.scale = newScale
        STATE.scale({x: newScale, y: newScale})
        STATE.batchDraw()
        if (this.curShape) {
          const tr = STATE.find('Transformer')
          tr.destroy()
          this.addTransformer(this.curShape)
        }
      },
      init() {
        TempGroup = new Konva.Group({
          x: 0,
          y: 0,
          draggable: true
        });

        var box = new Konva.Rect({
          x: 50,
          y: 50,
          width: 100,
          height: 50,
          fill: 'red',
          stroke: 'black'
        });

        var yellowCircle = new Konva.Circle({
          x: 200,
          y: 150,
          radius: 50,
          fill: 'yellow',
          stroke: 'black'
        });

        TempGroup.add(yellowCircle);
        TempGroup.add(box);
        // blueGroup.add(blueCircle);
        const layer = vm.$refs.layer.getStage()
        layer.add(TempGroup);
        STATE.add(layer);
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
      vm = this
      STATE = vm.$refs.stage.getStage()
      // TempGroup = new Konva.Group({
      //   x: 80,
      //   y: 80,
      //   width: 400,
      //   height: 400,
      //   draggable: true
      // })
      // const layer = vm.$refs.layer.getStage()
      // layer.add(TempGroup)

      // this.init()

      vm.list.push({
        name: 'rect',
        x: 300,
        y: 300,
        width: 200,
        height: 200,
        // strokeWidth: 0,
        stroke: '#F00',
        draggable: true,
        scaleX: 1,
        scaleY: 1,
        offsetX: 100,
        offsetY: 100,
        rotation: 0,
        svgColor: Konva.Util.getRandomColor()
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