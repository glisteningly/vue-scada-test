import hotkeys from 'hotkeys-js'
import Konva from 'konva'
import utils from '../utils'
// import _ from 'lodash'
import CompCtrl from '../class/CompCtrl'

// const CanvasDefaultSettings = {
//   width: 1000,
//   height: 400
// }

import { TOOL_STATE } from '../const'

export default {
  methods: {
    isRectContain(r1, r2) {
      return (r1.x <= r2.x &&
        r1.x + r1.width >= r2.x + r2.width &&
        r1.y <= r2.y &&
        r1.y + r1.height >= r2.y + r2.height
      )
    },
    //移除组件的tr
    detchCompTransformer() {
      this.konvaObjs.transformer.detach()
      this.comps.forEach(comp => {
        if (comp.isPathCtrl) {
          comp.removeAnchors()
        }
      })
    },
    initKonvaWorkArea() {
      this.curSelComps = []
      const width = this.$refs['workCanvas'].clientWidth
      const height = this.$refs['workCanvas'].clientHeight

      this.canvasLayout.width = width
      this.canvasLayout.height = height

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
        scaleX: this.canvasLayout.scale,
        scaleY: this.canvasLayout.scale,
        // draggable: true
      })

      const layerPaper = new Konva.Layer()
      this.konvaObjs.paperRect = new Konva.Rect({
        width: this.docSettings.width,
        height: this.docSettings.height,
        stroke: '#888',
        strokeWidth: 1 / this.canvasLayout.scale,
        listening: false
      })
      layerPaper.add(this.konvaObjs.paperRect)
      this.konvaObjs.stage.add(layerPaper)


      this.konvaObjs.layers = []
      const layer = new Konva.Layer()
      this.konvaObjs.layers.push(layer)
      this.konvaObjs.stage.add(this.konvaObjs.layers[0])

      this.konvaObjs.dragLayer = new Konva.Layer()
      this.konvaObjs.stage.add(this.konvaObjs.dragLayer)

      this.konvaObjs.transformer = new Konva.Transformer({
        keepRatio: false,
        anchorSize: 8,
        anchorFill: '#006bd6',
        anchorStroke: '#FFF',
        anchorStrokeWidth: 1.5,
        // anchorCornerRadius: 4,
        rotationSnaps: [0, 90, 180, 270],
        rotateAnchorOffset: 30
      })

      this.konvaObjs.transformer.boundBoxFunc((oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox
        }
        return newBox
      })


      this.konvaObjs.groupTransformer = new Konva.Transformer({
        keepRatio: true,
        anchorSize: 8,
        anchorFill: '#006bd6',
        anchorStroke: '#FFF',
        anchorStrokeWidth: 1.5,
        // anchorCornerRadius: 4,
        // resizeEnabled: false,
        // rotateEnabled: false,
        rotationSnaps: [0, 90, 180, 270],
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        rotateAnchorOffset: 30
      })

      this.konvaObjs.groupTransformer.boundBoxFunc((oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox
        }
        return newBox
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

      this.konvaObjs.groupTransformer.on('transformend', () => {
        // console.log('transformend ')
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

      this.konvaObjs.selCompsRect = new Konva.Rect({
        draggable: false,
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        strokeWidth: 1,
        fill: 'rgba(60,151,224,0.06)',
        stroke: '#3c97e0',
        // dash: [3, 1]
      })

      this.konvaObjs.pathAuxLine = new Konva.Line({
        points: [],
        stroke: '#3c97e0',
        strokeWidth: 4,
        lineJoin: 'round',
        dash: [6, 4]
      })

      // 多选组 组件
      this.konvaObjs.selCompsGroup = new Konva.Group({
        draggable: true,
      })

      this.konvaObjs.selCompsGroup.on('dragstart ', () => {
        this.konvaObjs.groupTransformer.resizeEnabled(false)
        this.konvaObjs.groupTransformer.rotateEnabled(false)
        // this.konvaObjs.groupTransformer.borderEnabled(false)
        this.konvaObjs.layers[0].draw()
      })

      this.konvaObjs.selCompsGroup.on('dragend ', (e) => {
        // console.log('dragend ')
        this.konvaObjs.groupTransformer.resizeEnabled(true)
        this.konvaObjs.groupTransformer.rotateEnabled(true)
        // this.konvaObjs.groupTransformer.borderEnabled(true)
        this.konvaObjs.layers[0].draw()
        this.syncGroupSel()
        this.curSelComps.forEach((comp) => {
          comp.syncCompLayout()
        })

        //alt 拖拽复制
        if (e.evt.altKey && this.curSelCompsCopied.length > 0) {
          this.addCompsFromConfig(this.curSelCompsCopied)
        }
        //更新选中的comps config记录
        this.curSelCompsCopied = this.getCompsConfig(this.curSelComps)
      })

      // 多选组件变换记录到历史纪录
      this.konvaObjs.selCompsGroup.on('dragend transformend', () => {
        this.recordToHistoryDebounce()
      })

      //click
      this.konvaObjs.stage.on('mousedown', (e) => {
        if (this.isKeySpacepressing) {
          // this.konvaObjs.stage.draggable(true)
          return
        }
        // console.log(hotkeys.isPressed("space"))

        if (this.toolState) {
          return
        }

        if (e.target === this.konvaObjs.stage && e.evt.button === 0) {
          // console.log(e)
          // console.log('stage mousedown')

          this.isDragSelecting = true
          const mousePos = this.konvaObjs.stage.getPointerPosition()
          // const x = mousePos.x
          // const y = mousePos.y
          // console.log('x: ' + x + ', y: ' + y)
          this.konvaObjs.selCompsRect.width(0)
          this.konvaObjs.selCompsRect.height(0)
          // this.konvaObjs.selCompsRect.moveTo(this.konvaObjs.layers[0])
          this.konvaObjs.selCompsRect.moveTo(this.konvaObjs.dragLayer)
          this.konvaObjs.selCompsRect.setAbsolutePosition(mousePos)
          // this.konvaObjs.selCompsRect.strokeWidth(1 / this.canvasLayout.scale)
        }
      })

      this.konvaObjs.stage.on('mousemove', () => {
        // console.log('mousemove')
        if (this.toolState) {
          if (this.curSelComp && this.curSelComp.points) {

            // path最后节点位置
            const pathTf = this.curSelComp.konvaCtrl().getTransform()
            const pathLastPointPos = { x: this.pathLastPoint[0], y: this.pathLastPoint[1] }
            const _pathLastPt_Stage = pathTf.point(pathLastPointPos)

            // 当前鼠标位置
            const mousePos = this.konvaObjs.stage.getPointerPosition()
            const stageTf = this.konvaObjs.stage.getTransform().copy().invert()
            const _pathMousePt_Stage = stageTf.point(mousePos)

            const _fixedPt_Stage = (hotkeys.shift) ? _pathMousePt_Stage : utils.getHVPos(_pathLastPt_Stage, _pathMousePt_Stage)
            this.curFixedPathPoint = _fixedPt_Stage

            this.konvaObjs.pathAuxLine.points([_pathLastPt_Stage.x, _pathLastPt_Stage.y, _fixedPt_Stage.x, _fixedPt_Stage.y])
            this.konvaObjs.layers[0].draw()
          }
        }

        if (this.isDragSelecting) {
          const mousePos = this.konvaObjs.stage.getPointerPosition()
          const x = (mousePos.x - this.konvaObjs.stage.x()) / this.konvaObjs.stage.scaleX()
          const y = (mousePos.y - this.konvaObjs.stage.y()) / this.konvaObjs.stage.scaleY()
          this.konvaObjs.selCompsRect.width(x - this.konvaObjs.selCompsRect.x())
          this.konvaObjs.selCompsRect.height(y - this.konvaObjs.selCompsRect.y())
          // this.konvaObjs.layers[0].draw()
          this.konvaObjs.dragLayer.draw()
          // this.konvaObjs.stage.draw()
        }
      })

      this.konvaObjs.stage.on('mouseup', (e) => {
        // console.log(this.konvaObjs.stage.getPointerPosition())

        if (this.isKeySpacepressing) {
          // this.konvaObjs.stage.draggable(true)
          return
        }

        if (e.evt.button === 0) {
          // console.log('state mouseup')
          if (this.toolState === TOOL_STATE.addPathPoint) {
            const mousePos = this.konvaObjs.stage.getPointerPosition()
            const x = mousePos.x
            const y = mousePos.y
            if (this.curSelComp && this.curSelComp.points) {
              // this.curSelComp.addNewAnchor({ x, y })
              this.curSelComp.addNewAnchor(this.curFixedPathPoint)
              this.recordToHistoryDebounce()
            } else {
              this.addPathStartPoint({ x, y })
            }
            return
          }

          if (this.isDragSelecting) {
            const newSels = []
            for (const comp of this.comps) {
              // if (this.isRectContain(l, comp.konvaRect())) {
              if (this.isRectContain(this.konvaObjs.selCompsRect.getClientRect(), comp.konvaCtrl().getClientRect())) {
                newSels.push(comp)
              }
            }

            this.detchCompTransformer()
            this.unGroupSelAll()
            if (newSels.length > 0) {
              // this.unGroupSelAll()
              this.curSelComps = newSels
            } else {
              this.konvaObjs.layers[0].draw()
            }
          }
        } else {
          this.toolState = ''
        }

        this.konvaObjs.selCompsRect.remove()
        this.konvaObjs.selCompsRect.width(0)
        this.konvaObjs.selCompsRect.height(0)
        // this.konvaObjs.layers[0].draw()
        // this.konvaObjs.stage.draw()
        this.konvaObjs.dragLayer.draw()
        this.isDragSelecting = false
      })

      this.konvaObjs.stage.on('dragmove', () => {
        this.canvasLayout.x = this.konvaObjs.stage.x()
        this.canvasLayout.y = this.konvaObjs.stage.y()
      })

      CompCtrl.konvaContext = this.konvaObjs

      this.comps.forEach((comp) => {
        // comp.konvaContext = this.konvaObjs
        comp.initKonva()
        this.addCompEvent(comp)
      })

      this.canvasRedraw()
    },
  },
}