import Guid from '../utils/guid'
import Konva from 'konva'
import hotkeys from 'hotkeys-js'
import _ from 'lodash'

const _konvaRect = new WeakMap()
const _konvaPath = new WeakMap()

class CompCtrl {
  constructor(options, isInitKonva = true) {
    const guid = Guid()
    // this.id = guid
    // this.stroke = 'green'
    // this.strokeWidtg = 0.5

    this.type = options.type
    this.options = options.options

    this.name = guid

    this.width = options.layout.width || 0
    this.height = options.layout.height || 0

    this.offsetX = options.layout.offsetX || (this.width / 2)
    this.offsetY = options.layout.offsetY || (this.height / 2)
    // this.offsetX = 0
    // this.offsetY = 0


    this.scaleX = options.layout.scaleX || 1
    this.scaleY = options.layout.scaleY || 1
    this.x = options.layout.x + this.offsetX * this.scaleX || 0
    this.y = options.layout.y + this.offsetY * this.scaleY || 0

    this.rotation = options.layout.rotation || 0

    this.isPathCtrl = false

    if (options.layout.points) {
      this.points = options.layout.points || []
      this.isPathCtrl = true
      this.ctrlAnchors = []
    }

    this.initBaseLayout()

    if (options.children && options.children.length > 0) {
      const children = []
      options.children.forEach((comp) => {
        children.push(new CompCtrl(comp, false))
      })

      // Object.assign(CompGroup1, { konvaContext: this.konvaObjs })
      // const c = new CompCtrl(CompGroup1)
      this.children = children
      // this.syncChildrenCompLayout()
    }

    if (isInitKonva) {
      // this.konvaContext = options.konvaContext
      this.initKonva()
    }
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
  // getRoundNum(num) {
  //   return Math.round(num * 100) / 100
  // }

  // getRoundNum(num, precision = 12) {
  //   return +parseFloat(num.toPrecision(precision));
  // }

  initBaseLayout() {
    this.initLayout = this.layout()
  }

  initKonva() {
    this.draggable = true

    if (this.isPathCtrl) {
      this.initKonvaPath()
    } else {
      this.initKonvaRect()
    }
    _konvaRect.set(this, new Konva.Rect(this))
    this.tempTr = null

    // 拖拽移动时即时变化
    // this.konvaRect().on('dragmove', () => {
    //   this.updateLayout()
    // })

    this._dragstartPos = { x: 0, y: 0 }
    this._hMove = true

    this.konvaCtrl().on('mousedown', () => {
      this._dragstartPos = this.konvaCtrl().getAbsolutePosition()
    })

    this.konvaCtrl().on('dragmove', () => {
      this._hMove = Math.abs(this.konvaCtrl().getAbsolutePosition().x - this._dragstartPos.x) >= Math.abs(this.konvaCtrl().getAbsolutePosition().y - this._dragstartPos.y)
    })

    this.konvaCtrl().on('dragstart', () => {
      CompCtrl.konvaContext.transformer.rotateEnabled(false)
      CompCtrl.konvaContext.transformer.resizeEnabled(false)
      this.konvaCtrl().getLayer().draw()
    })

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
      this.konvaCtrl().getLayer().draw()
    })

    CompCtrl.konvaContext.layers[0].add(this.konvaCtrl())
    this.konvaCtrl().getLayer().draw()

    if (this.children && this.children.length > 0) {
      this.syncChildrenCompLayout()
    }
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
    this.removeAnchors()

    const anchorPts = this.getPathAbsPoints()
    console.log(anchorPts)

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

      circle.on('dragmove', () => {
        const tf = this.konvaCtrl().getTransform()
        const it = tf.copy().invert()

        const anchorAbsPt = { x: circle.x(), y: circle.y() }
        const relativePt = it.point(anchorAbsPt)

        this.points[index * 2] = relativePt.x
        this.points[index * 2 + 1] = relativePt.y
      })

      circle.on('dragend', () => {
        const pts = _.clone(this.points)
        this.points = pts
        this.konvaCtrl().points(this.points)
        CompCtrl.konvaContext.transformer.forceUpdate()
        this.reDraw()
      })

      circle.on('mouseover', () => {
        document.body.style.cursor = 'pointer';
        circle.setStrokeWidth(2);
        this.reDraw()
      })
      circle.on('mouseout', () => {
        document.body.style.cursor = 'default';
        circle.setStrokeWidth(1);
        this.reDraw()
      })

//   pathGroup.add(circle)
      this.konvaCtrl().getLayer().add(circle)
      this.reDraw()
    })
  }

  getPathAbsPoints() {
    const pathPts = []
    const transform = this.konvaCtrl().getTransform()

    let tempPt = { x: 0, y: 0 }

    this.konvaCtrl().points().forEach((pt, index) => {
      if ((index + 1) % 2 === 0) {
        tempPt.y = pt
        const absPos = transform.point(tempPt)
//     console.log(tempPt)
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
    // console.log(rect)

    // console.log(pathPts)
    // console.log(_.minBy(pathPts, 'x').x)
    // console.log(_.minBy(pathPts, 'y').y)
    // console.log(_.maxBy(pathPts, 'x').x)
    // console.log(_.maxBy(pathPts, 'y').y)
    // console.log(this.konvaCtrl().getPoints())
  }

  initKonvaRect() {
    _konvaRect.set(this, new Konva.Rect(this))
    this.tempTr = null
  }

  initKonvaPath() {
    // this.stroke = '#00D2FF'
    this.stroke = 'rgba(0,210,255,0.1)'
    this.strokeWidth = 10
    this.draggable = true
    this.lineJoin = 'round'
    this.strokeScaleEnabled = false
    _konvaPath.set(this, new Konva.Line(this))
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
    // this.x = this.konvaRect().getAbsolutePosition().x
    // this.y = this.konvaRect().getAbsolutePosition().y
    this.x = this.konvaCtrl().getAbsolutePosition(CompCtrl.konvaContext.stage).x
    this.y = this.konvaCtrl().getAbsolutePosition(CompCtrl.konvaContext.stage).y
    // TODO:

    this.scaleX = this.konvaCtrl().getAbsoluteScale().x / CompCtrl.konvaContext.stage.scaleX()
    this.scaleY = this.konvaCtrl().getAbsoluteScale().y / CompCtrl.konvaContext.stage.scaleY()
    // this.scaleX = this.konvaRect().getAbsoluteScale().x
    // this.scaleY = this.konvaRect().getAbsoluteScale().y
    this.rotation = this.konvaCtrl().rotation() + CompCtrl.konvaContext.selCompsGroup.rotation()
    this.syncChildrenCompLayout()
  }

  syncChildrenCompLayout() {
    // console.log(this.children)
    if (this.children && this.children.length > 0) {
      this.children.forEach((comp) => {
        const x = (comp.initLayout.x - this.offsetX) * this.scaleX + this.x
        const y = (comp.initLayout.y - this.offsetY) * this.scaleY + this.y
        comp.x = (x - this.x) * Math.cos(this.rotation * Math.PI / 180) - (y - this.y) * Math.sin(this.rotation * Math.PI / 180) + this.x
        comp.y = (x - this.x) * Math.sin(this.rotation * Math.PI / 180) + (y - this.y) * Math.cos(this.rotation * Math.PI / 180) + this.y

        // if (this.isPathCtrl) {
        // } else {
        // console.log(comp.initLayout)
        comp.scaleX = comp.initLayout.scaleX * this.scaleX
        comp.scaleY = comp.initLayout.scaleY * this.scaleY
        comp.rotation = comp.initLayout.rotation + this.rotation
        comp.syncChildrenCompLayout()
        // }
      })
    }
  }

  syncKonva() {
    // this.konvaRect().setAbsolutePosition({
    //   x: this.x,
    //   y: this.y
    // })
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
  }

  removeTempTransformer() {
    if (this.tempTr) {
      this.tempTr.destroy()
      this.tempTr = null
    }
  }

  removeCompfromGroupSel() {
    this.removeTempTransformer()

    if (this.konvaCtrl()) {
      const compPosition = this.konvaCtrl().getAbsolutePosition()
      this.konvaCtrl().moveTo(this.konvaCtrl().getLayer())
      this.konvaCtrl().setAbsolutePosition(compPosition)
      // TODO:
      this.konvaCtrl().scale({
        x: this.konvaCtrl().getAbsoluteScale().x / CompCtrl.konvaContext.stage.scaleX(),
        y: this.konvaCtrl().getAbsoluteScale().y / CompCtrl.konvaContext.stage.scaleY()
      })
      this.konvaCtrl().rotation(this.konvaCtrl().rotation() + CompCtrl.konvaContext.selCompsGroup.rotation())
      this.konvaCtrl().draggable(true)
    }
  }

  delete() {
    this.removeAnchors()
    this.removeTempTransformer()
    this.konvaCtrl().destroy()
    // this.konvaRect() = null
  }

  addTransformer() {
    //TODO:
    // if (this.isPathCtrl) {
    //   CompCtrl.konvaContext.transformer.padding(-3)
    // } else {
    //   CompCtrl.konvaContext.transformer.padding(0)
    // }
    this.removeCompfromGroupSel()
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
    this.setDragBound(true)

    if (this.isPathCtrl) {
      this.addAnchors()
    }

    this.konvaCtrl().getLayer().draw()
  }

  toString() {
    return '()'
  }

  _roundNum(num) {
    return _.round(num, 3)
  }

  getCompLayout() {
    const layout = {
      x: this._roundNum(this.x - this.offsetX * this.scaleX),
      y: this._roundNum(this.y - this.offsetY * this.scaleY),
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

  toConfig() {
    const compConfig = {
      layout: this.getCompLayout(),
      type: this.type,
      options: this.options
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

  setDragBound(flag) {
    if (flag) {
      this.konvaCtrl().dragBoundFunc((pos) => {
        let p = {
          x: pos.x,
          y: pos.y
        }
        if (hotkeys.shift) {
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
        return p
      })
    } else {
      this.konvaCtrl().dragBoundFunc(null)
    }

  }
}

export default CompCtrl