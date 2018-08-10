<template>
  <div style="height: 100vh; user-select: none">
    <svg style="width: 100%;height: 100%; position: fixed; left: 0;top: 0;">
      <rect v-for="item in list"
            :key="item.id"
            :x="item.x - item.offsetX * item.scaleX"
            :y="item.y - item.offsetY * item.scaleY"
            :fill="item.svgColor"
            :width="item.width * item.scaleX"
            :height="item.height * item.scaleY"
            :transform="`rotate(${item.rotation} ${item.x - item.offsetX * item.scaleX + (item.width * item.scaleX)/2} ${item.y - item.offsetY * item.scaleY + (item.height * item.scaleY)/2})`"
      ></rect>
    </svg>
    <v-stage ref="stage"
             :config="configKonva"
             @click="stateClick">
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
    <button style="position: fixed;top: 0;left: 0;" @click="btnClicked">add</button>
    <button style="position: fixed;top: 0;left: 200px;" @click="btnClicked1">button1</button>
  </div>
</template>

<script>
  const width = window.innerWidth
  const height = window.innerHeight
  let vm = {}

  export default {
    name: 'Editor',
    data() {
      return {
        list: [],
        configKonva: {
          width: width,
          height: height
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
        // console.log(shape.attrs.x)
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
          strokeWidth: 1,
          draggable: true,
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

      }
    },
    mounted() {
      vm = this

      vm.list.push({
        name: 'rect',
        x: 300,
        y: 300,
        width: 200,
        height: 200,
        strokeWidth: 1,
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
<style>
  body {
    margin: 0;
    padding: 0;
  }
</style>