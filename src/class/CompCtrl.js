import Guid from '../utils/guid'
import Konva from 'konva'
import hotkeys from 'hotkeys-js'
import _ from 'lodash'
import utils from '../utils'

const _konvaRect = new WeakMap()
const _konvaPath = new WeakMap()

class CompCtrl {
  constructor(options, isInitKonva = true) {
    // console.log(options)
    const guid = Guid()
    this.type = options.type
    this.name = guid

    this.width = options.layout.width || 0
    this.height = options.layout.height || 0

    this.isPathCtrl = false
    if (options.layout.points) {
      this.points = options.layout.points || []
      this.isPathCtrl = true
      this.ctrlAnchors = []
      this.width = utils.getPathRect(this.points).width
      this.height = utils.getPathRect(this.points).height
    }

    this.offsetX = (options.layout.offsetX || (this.width / 2)) || 0
    this.offsetY = (options.layout.offsetY || (this.height / 2)) || 0

    this.scaleX = options.layout.scaleX || 1
    this.scaleY = options.layout.scaleY || 1
    this.x = options.layout.x + this.offsetX * this.scaleX || 0
    this.y = options.layout.y + this.offsetY * this.scaleY || 0

    this.rotation = options.layout.rotation || 0

    this._locked = options.locked || false

    this.initBaseLayout()

    if (options.children && options.children.length > 0) {
      const children = []
      options.children.forEach((comp) => {
        children.push(new CompCtrl(comp, false))
      })
      this.children = children
    }

    if (isInitKonva) {
      this.initKonva()
    }

    this.bid = options.bid || ''
    this.bindingValue = options.bindingValue || {}
    this.binding = options.binding || {}
    this.eventMsg = options.eventMsg || ''
    this.options = options.options || {}
    if (!_.has(options, 'options.style')) {
      this.options.style = {}
    }
    if (!_.has(options, 'options.param')) {
      this.options.param = {}
    }

    this.isChild = false

    this._dragstartPos = null
  }

  set locked(val) {
    this._locked = val
    if (this.konvaCtrl()) {
      this.konvaCtrl().draggable(!val)
      this.konvaCtrl().listening(!val)
      this.reDraw()
      // CompCtrl.konvaContext.transformer.resizeEnabled(!val)
      // CompCtrl.konvaContext.transformer.rotateEnabled(!val)
    }
  }

  get locked() {
    return this._locked
  }

  reDraw() {
    this.konvaCtrl().getLayer().draw()
  }

  konvaRect() {
    return _konvaRect.get(this)
  }

  konvaPath() {
    return _konvaPath.get(this)
  }

  konvaCtrl() {
    return this.isPathCtrl ? this.konvaPath() : this.konvaRect()
  }

  // get x() {
  //   return this._x
  // }
  //
  // set x(value) {
  //   this.x = value
  //   console.log('setter: ' + value)
  // }

  initBaseLayout() {
    this.initLayout = this.layout()
  }

  setShapeDragConstraint(konvaShape) {
    // this._dragstartPos = konvaShape.getAbsolutePosition()
    this._hMove = true

    konvaShape.on('dragstart, dragend', () => {
      this._dragstartPos = konvaShape.getAbsolutePosition()
    })

    konvaShape.on('dragmove', () => {
      if (!this._dragstartPos) {
        this._dragstartPos = konvaShape.getAbsolutePosition()
      }

      this._hMove = Math.abs(konvaShape.getAbsolutePosition().x - this._dragstartPos.x) >= Math.abs(konvaShape.getAbsolutePosition().y - this._dragstartPos.y)
    })

    konvaShape.dragBoundFunc((pos) => {
      let p = {
        x: pos.x,
        y: pos.y
      }
      // console.log(p)
      // console.log(this._dragstartPos)
      if (hotkeys.shift && this._dragstartPos) {
        if (this._hMove) {
          p = {
            x: pos.x,
            y: this._dragstartPos.y
          }
        } else {
          p = {
            x: this._dragstartPos.x,
            y: pos.y
          }
        }
      }
      // console.log(p)
      return p
    })
  }

  initKonva() {
    this.isChild = false

    this.draggable = !this.locked
    this.listening = !this.locked

    if (this.isPathCtrl) {
      this.initKonvaPath()
    } else {
      this.initKonvaRect()
    }
    this.tempTr = null

    // 按住shift拖动时水平垂直方向约束
    this.setShapeDragConstraint(this.konvaCtrl())

    this.konvaCtrl().on('dragstart transformstart', () => {
      this.showPathCtrl(true)
    })

    this.konvaCtrl().on('dragstart', () => {
      CompCtrl.konvaContext.transformer.rotateEnabled(false)
      CompCtrl.konvaContext.transformer.resizeEnabled(false)
      this.reDraw()
    })
    //
    // this.konvaCtrl().on('dragmove transform', () => {
    //   if (this.isPathCtrl) {
    //     this.addAnchors()
    //   }
    //   // if (this.type === 'ScadaLabel') {
    //   this.syncCompLayout()
    //   // }
    // })

    this.konvaCtrl().on('dragend transformend', () => {
      // console.log(this.children)
      // this.doLog()
      if (this.isPathCtrl) {
        this.addAnchors()
      }
      this.syncCompLayout()
      CompCtrl.konvaContext.transformer.rotateEnabled(true)
      CompCtrl.konvaContext.transformer.resizeEnabled(true)
      CompCtrl.konvaContext.transformer.forceUpdate()
      this.showPathCtrl(false)
      this.reDraw()
    })

    CompCtrl.konvaContext.layers[0].add(this.konvaCtrl())
    this.konvaCtrl().getLayer().draw()

    if (this.children && this.children.length > 0) {
      this.syncChildrenCompLayout()
    }
  }

  showPathCtrl(show) {
    const color = show ? 'rgba(0,210,255,0.1)' : 'rgba(0,0,0,0)'
    if (this.isPathCtrl) {
      this.konvaCtrl().stroke(color)
    }
    this.reDraw()
  }

  removeAnchors() {
    if (this.ctrlAnchors) {
      this.ctrlAnchors.forEach(circle => {
        circle.destroy()
      })
      this.ctrlAnchors = []
    }
  }

  addAnchors() {
    if (this.ctrlAnchors) {
      this.removeAnchors()

      const anchorPts = this.getPathAbsPoints()
      // console.log(anchorPts)

      this._anchorPosDragstartPos = { x: 0, y: 0 }

      anchorPts.forEach((pt, index) => {
        const circle = new Konva.Circle({
          x: pt.x,
          y: pt.y,
          radius: 5,
          fill: '#ea5f50',
          stroke: 'white',
          strokeWidth: 1,
          draggable: true
        })

        this.ctrlAnchors.push(circle)

        circle.on('mousedown', () => {
          this._anchorPosDragstartPos = []
          this.ctrlAnchors.forEach(anchor => {
            this._anchorPosDragstartPos.push({ x: anchor.x(), y: anchor.y() })
          })
        })

        circle.on('dragstart', () => {
          this.showPathCtrl(true)
        })

        circle.on('dragmove', () => {
          const tf = this.konvaCtrl().getTransform()
          const it = tf.copy().invert()

          const getRelativePt = (anchor) => {
            const anchorAbsPt = { x: anchor.x(), y: anchor.y() }
            return it.point(anchorAbsPt)
          }

          this.points[index * 2] = getRelativePt(circle).x
          this.points[index * 2 + 1] = getRelativePt(circle).y

          if (hotkeys.ctrl) {
            // console.log(this._anchorPosDragstartPos)
            const dragDeltaX = this._anchorPosDragstartPos[index].x - circle.x()
            const dragDeltaY = this._anchorPosDragstartPos[index].y - circle.y()
            for (let i = index + 1; i < this.ctrlAnchors.length; i++) {
              this.ctrlAnchors[i].x(this._anchorPosDragstartPos[i].x - dragDeltaX)
              this.ctrlAnchors[i].y(this._anchorPosDragstartPos[i].y - dragDeltaY)

              this.points[i * 2] = getRelativePt(this.ctrlAnchors[i]).x
              this.points[i * 2 + 1] = getRelativePt(this.ctrlAnchors[i]).y
            }
          }
        })

        circle.on('dragend', () => {
          this.reCalcPathPoints()
          this.points = _.clone(this.points)
          this.konvaCtrl().points(this.points)
          CompCtrl.konvaContext.transformer.forceUpdate()
          this.showPathCtrl(false)
          this.reDraw()
        })

        circle.on('mouseenter', () => {
          // console.log(hotkeys.alt)
          if (hotkeys.alt) {
            circle.setStroke('#740800')
          }
          circle.setStrokeWidth(2)
          this.reDraw()
        })
        circle.on('mouseout', () => {
          circle.setStrokeWidth(1)
          circle.setStroke('white')
          this.reDraw()
        })
        circle.on('click', () => {
          if (hotkeys.alt) {
            this.removeAnchor(index)
          }
        })

        // 按住shift拖动时水平垂直方向约束
        this.setShapeDragConstraint(circle)

        this.konvaCtrl().getLayer().add(circle)
        this.reDraw()
      })
    }
  }

  addNewAnchor(newPt) {
    if (!this.isPathCtrl) {
      return
    }

    const tf = this.konvaCtrl().getTransform().copy().invert()
    const getRelativePt = (anchor) => {
      const anchorAbsPt = { x: anchor.x, y: anchor.y }
      return tf.point(anchorAbsPt)
    }
    const pt = [getRelativePt(newPt).x, getRelativePt(newPt).y]

    this.points = this.points.concat(pt)
    this.reCalcPathPoints()
    this.rePathPoints()
  }

  removeAnchor(index) {
    if (!this.isPathCtrl || this.points.length <= 2) {
      return
    }

    this.points.splice(index * 2, 2)
    this.reCalcPathPoints()
    this.rePathPoints()
  }

  reCalcPathPoints() {
    if (!this.isPathCtrl) {
      return
    }

    this.konvaCtrl().points(this.points)
    const pathRect = utils.getPathRect(this.konvaCtrl().points())

    const offsetX = pathRect.x
    const offsetY = pathRect.y
    const tf = this.konvaCtrl().getTransform()
    const stageTf = CompCtrl.konvaContext.stage.getTransform()
    const originPt = { x: offsetX + pathRect.width / 2, y: offsetY + pathRect.height / 2 }
    const relativePt = stageTf.point(tf.point(originPt))

    this.konvaCtrl().setAbsolutePosition({
      x: relativePt.x,
      y: relativePt.y
    })

    this.syncCompLayout()

    for (let i = 0; i < this.points.length - 1; i += 2) {
      this.points[i] -= offsetX
      this.points[i + 1] -= offsetY
    }
  }

  rePathPoints() {
    this.konvaCtrl().points(this.points)
    // this.reCalcPathSize()
    // this.syncCompLayout()
    CompCtrl.konvaContext.transformer.forceUpdate()
    this.addAnchors()
  }

  getPathAbsPoints() {
    const pathPts = []
    const transform = this.konvaCtrl().getTransform()

    let tempPt = { x: 0, y: 0 }

    this.konvaCtrl().points().forEach((pt, index) => {
      if ((index + 1) % 2 === 0) {
        tempPt.y = pt
        const absPos = transform.point(tempPt)
        pathPts.push(Object.assign({}, absPos))
      } else {
        tempPt.x = pt
      }
    })
    return pathPts
  }

  doLog() {
    if (!this.isPathCtrl) {
      return
    } else {
      // this.syncPathPoints()
    }

    const rect = this.konvaCtrl().getClientRect({ relativeTo: CompCtrl.konvaContext.stage })
    rect.x += 3
    rect.y -= 3
    rect.width -= 6
    rect.height -= 6
  }

  initKonvaRect() {
    _konvaRect.set(this, new Konva.Rect(this))
  }

  initKonvaPath() {
    // this.stroke = '#00D2FF'
    // this.stroke = 'rgba(0,210,255,0.1)'
    this.stroke = 'rgba(0,0,0,0)'
    this.strokeWidth = 10
    this.lineJoin = 'round'
    this.strokeScaleEnabled = false
    _konvaPath.set(this, new Konva.Line(this))
    // this.reCalcPathSize()
  }

  setContext(konvaContext) {
    CompCtrl.konvaContext = konvaContext
  }

  layout() {
    return {
      x: this.x,
      y: this.y,

      width: this.width,
      height: this.height,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation,
    }
  }

  syncCompLayout() {
    this.x = this.konvaCtrl().getAbsolutePosition(CompCtrl.konvaContext.stage).x
    this.y = this.konvaCtrl().getAbsolutePosition(CompCtrl.konvaContext.stage).y
    // TODO:

    this.scaleX = this.konvaCtrl().getAbsoluteScale().x / CompCtrl.konvaContext.stage.scaleX()
    this.scaleY = this.konvaCtrl().getAbsoluteScale().y / CompCtrl.konvaContext.stage.scaleY()
    this.rotation = this.konvaCtrl().rotation() + CompCtrl.konvaContext.selCompsGroup.rotation()

    this.width = this.konvaCtrl().width()
    this.height = this.konvaCtrl().height()
    this.offsetX = this.width / 2
    this.offsetY = this.height / 2
    this.konvaCtrl().offsetX(this.konvaCtrl().width() / 2)
    this.konvaCtrl().offsetY(this.konvaCtrl().height() / 2)

    this.syncChildrenCompLayout()
  }

  syncChildrenCompLayout() {
    if (this.children && this.children.length > 0) {
      this.children.forEach((comp) => {
        const x = (comp.initLayout.x - this.offsetX) * this.scaleX + this.x
        const y = (comp.initLayout.y - this.offsetY) * this.scaleY + this.y
        comp.x = (x - this.x) * Math.cos(this.rotation * Math.PI / 180) - (y - this.y) * Math.sin(this.rotation * Math.PI / 180) + this.x
        comp.y = (x - this.x) * Math.sin(this.rotation * Math.PI / 180) + (y - this.y) * Math.cos(this.rotation * Math.PI / 180) + this.y
        comp.scaleX = comp.initLayout.scaleX * this.scaleX
        comp.scaleY = comp.initLayout.scaleY * this.scaleY
        comp.rotation = comp.initLayout.rotation + this.rotation
        comp.syncChildrenCompLayout()

        comp.isChild = true
      })
    }
  }

  syncKonva() {
    // this.konvaRect().setAbsolutePosition({
    //   x: this.x,
    //   y: this.y
    // })
    if (this.konvaCtrl() && !this.isChild) {
      this.konvaCtrl().position({
        x: this.x,
        y: this.y
      })
      this.konvaCtrl().scale({
        x: this.scaleX,
        y: this.scaleY
      })
      this.konvaCtrl().rotation(this.rotation)
      this.konvaCtrl().getLayer().draw()
      this.syncChildrenCompLayout()
      this.addAnchors()
    }
  }

  removeTempTransformer() {
    if (this.tempTr) {
      this.tempTr.destroy()
      this.tempTr = null
    }
  }

  removeCompfromGroupSel() {
    this.removeTempTransformer()

    if (this.konvaCtrl() && !this.isChild) {
      const compPosition = this.konvaCtrl().getAbsolutePosition()
      this.konvaCtrl().moveTo(this.konvaCtrl().getLayer())
      this.konvaCtrl().setAbsolutePosition(compPosition)
      // TODO:
      this.konvaCtrl().scale({
        x: this.konvaCtrl().getAbsoluteScale().x / CompCtrl.konvaContext.stage.scaleX(),
        y: this.konvaCtrl().getAbsoluteScale().y / CompCtrl.konvaContext.stage.scaleY()
      })
      this.konvaCtrl().rotation(this.konvaCtrl().rotation() + CompCtrl.konvaContext.selCompsGroup.rotation())
      if (!this.locked) {
        this.konvaCtrl().draggable(true)
      }
    }
  }

  delete() {
    this.removeAnchors()
    this.removeTempTransformer()
    this.konvaCtrl().destroy()
    // this.konvaRect() = null
  }

  addTransformer() {
    this.removeCompfromGroupSel()
    if (this.konvaCtrl() && !this.isChild) {
      this.konvaCtrl().getLayer().add(CompCtrl.konvaContext.transformer)
      //判断是否是添加到组上
      if (this.type === 'ScadaGroup') {
        // CompCtrl.konvaContext.transformer.rotateEnabled(false)
        CompCtrl.konvaContext.transformer.keepRatio(true)
        CompCtrl.konvaContext.transformer.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
      } else {
        // CompCtrl.konvaContext.transformer.rotateEnabled(true)
        CompCtrl.konvaContext.transformer.keepRatio(false)
        CompCtrl.konvaContext.transformer.enabledAnchors(['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'])
      }

      CompCtrl.konvaContext.transformer.attachTo(this.konvaCtrl())
      // TODO: lock state
      // CompCtrl.konvaContext.transformer.resizeEnabled(!this.locked)
      // CompCtrl.konvaContext.transformer.rotateEnabled(!this.locked)
      // this.setDragBound(true)

      if (this.isPathCtrl) {
        this.addAnchors()
      }

      this.konvaCtrl().getLayer().draw()
    }

  }

  toString() {
    return '()'
  }

  _roundNum(num) {
    return _.round(num, 3)
  }

  getCompLayout(isAbs = false) {
    const layout = {
      x: isAbs ? this._roundNum(this.x) : this._roundNum(this.x - this.offsetX * this.scaleX),
      y: isAbs ? this._roundNum(this.y) : this._roundNum(this.y - this.offsetY * this.scaleY),
      width: this._roundNum(this.width),
      height: this._roundNum(this.height),
      scaleX: this._roundNum(this.scaleX),
      scaleY: this._roundNum(this.scaleY),
      offsetX: this._roundNum(this.offsetX),
      offsetY: this._roundNum(this.offsetY),
      rotation: this._roundNum(this.rotation)
    }

    if (this.points) {
      Object.assign(layout, { points: this.points })
    }

    return layout
  }

  getChildLayout(comp) {
    const x1 = comp.x
    const y1 = comp.y
    const rx0 = this.x
    const ry0 = this.y
    const x = (x1 - rx0) * Math.cos(-this.rotation * Math.PI / 180) - (y1 - ry0) * Math.sin(-this.rotation * Math.PI / 180) + rx0
    const y = (x1 - rx0) * Math.sin(-this.rotation * Math.PI / 180) + (y1 - ry0) * Math.cos(-this.rotation * Math.PI / 180) + ry0
    const layout = {
      x: this._roundNum((x - this.x) / this.scaleX + this.offsetX - comp.offsetX * comp.scaleX / this.scaleX),
      y: this._roundNum((y - this.y) / this.scaleY + this.offsetY - comp.offsetY * comp.scaleY / this.scaleY),
      width: this._roundNum(comp.width),
      height: this._roundNum(comp.height),
      scaleX: this._roundNum(comp.scaleX / this.scaleX),
      scaleY: this._roundNum(comp.scaleY / this.scaleY),
      rotation: this._roundNum(comp.rotation - this.rotation)
    }

    if (comp.points) {
      Object.assign(layout, { points: comp.points })
    }

    return layout
  }

  setGroupBinding(binding) {
    utils.setGroupBinding(this, binding)
  }

  // setGroupBinding(binding) {
  //   if (!_.isEmpty(binding) && (this.type === 'ScadaGroupWrap') && this.children && this.children.length > 0) {
  //     this.children.forEach(childrenComp => {
  //       if (!_.isEmpty(childrenComp.binding)) {
  //         const newUid = binding.uid
  //         if (newUid) {
  //           const keys = _.keys(childrenComp.binding)
  //           if (keys.length > 0) {
  //             keys.forEach(key => {
  //               if (!_.isEmpty(childrenComp.binding[key])) {
  //                 // console.log('compCur')
  //                 // console.log(JSON.stringify(childrenComp.binding))
  //                 // console.log('newBindingUid')
  //                 // console.log(binding.uid)
  //                 childrenComp.binding[key].uid = newUid
  //               }
  //             })
  //           }
  //         }
  //       }
  //       childrenComp.setGroupBinding(binding)
  //     })
  //   }
  // }

  toConfig() {
    const compConfig = {
      layout: this.getCompLayout(),
      bid: this.bid,
      eventMsg: this.eventMsg,
      type: this.type,
      options: this.options,
      binding: this.binding,
      bindingValue: this.bindingValue,
      locked: this.locked
    }
    if (this.children && this.children.length > 0) {
      const children = []
      this.children.forEach((comp) => {
        const childConfig = comp.toConfig()
        childConfig.layout = this.getChildLayout(comp)
        children.push(childConfig)
      })
      compConfig.children = children
    }
    return compConfig
  }

  toVueTpl() {
    const compTpl = {
      bid: this.bid,
      eventMsg: this.eventMsg,
      type: (this.type === 'ScadaGroupWrap') ? 'ScadaGroup' : this.type,
      options: this.options,
      binding: this.binding,
    }
    Object.assign(compTpl, this.getCompLayout(true))
    return compTpl
  }
}

export default CompCtrl