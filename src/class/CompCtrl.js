import Guid from '../utils/guid'
import Konva from 'konva'
import hotkeys from 'hotkeys-js'
import _ from 'lodash'

class CompCtrl {
  constructor(options) {
    const guid = Guid()
    // this.id = guid


    this.type = options.type
    this.options = options.options

    this.name = guid

    this.offsetX = options.layout.offsetX || (options.layout.width / 2)
    this.offsetY = options.layout.offsetY || (options.layout.height / 2)
    // this.offsetX = 0
    // this.offsetY = 0


    this.width = options.layout.width
    this.height = options.layout.height
    this.scaleX = options.layout.scaleX || 1
    this.scaleY = options.layout.scaleY || 1
    this.x = options.layout.x + this.offsetX * this.scaleX || 0
    this.y = options.layout.y + this.offsetY * this.scaleY || 0

    this.rotation = options.layout.rotation || 0

    // this.initLayout = {
    //   x: this.x,
    //   y: this.y,
    //   scaleX: this.scaleX,
    //   scaleY: this.scaleY,
    //   offsetX: this.offsetX,
    //   offsetY: this.offsetY,
    //   rotation: this.rotation
    // }

    this.initBaseLayout()

    if (options.children && options.children.length > 0) {
      const children = []
      options.children.forEach((comp) => {
        children.push(new CompCtrl(comp))
      })

      // Object.assign(CompGroup1, { konvaContext: this.konvaObjs })
      // const c = new CompCtrl(CompGroup1)
      this.children = children
      // this.syncChildrenCompLayout()
    }

    if (options.konvaContext) {
      this.konvaContext = options.konvaContext
      this.initKonva()
    }
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
    this.konvaRect = new Konva.Rect(this)
    this.tempTr = null

    // this.konvaContext = options.konvaContext
    // 拖拽移动时即时变化
    // this.konvaRect.on('dragmove', () => {
    //   this.updateLayout()
    // })

    this._dragstartPos = { x: 0, y: 0 }
    this._hMove = true

    this.konvaRect.on('mousedown', () => {
      this._dragstartPos = this.konvaRect.getAbsolutePosition()
    })

    this.konvaRect.on('dragmove', () => {
      this._hMove = Math.abs(this.konvaRect.getAbsolutePosition().x - this._dragstartPos.x) >= Math.abs(this.konvaRect.getAbsolutePosition().y - this._dragstartPos.y)
    })

    this.konvaRect.on('dragstart', () => {
      this.konvaContext.transformer.rotateEnabled(false)
      this.konvaContext.transformer.resizeEnabled(false)
      this.konvaRect.getLayer().draw()
    })

    this.konvaRect.on('dragend transformend', () => {
      // console.log(this.children)
      this.syncCompLayout()
      this.konvaContext.transformer.rotateEnabled(true)
      this.konvaContext.transformer.resizeEnabled(true)
      this.konvaContext.transformer.forceUpdate()
      this.konvaRect.getLayer().draw()
    })

    this.konvaContext.layers[0].add(this.konvaRect)
    this.konvaRect.getLayer().draw()

    if (this.children && this.children.length > 0) {
      this.syncChildrenCompLayout()
    }
  }

  setContext(konvaContext) {
    this.konvaContext = konvaContext
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
    this.x = this.konvaRect.getAbsolutePosition().x
    this.y = this.konvaRect.getAbsolutePosition().y
    this.scaleX = this.konvaRect.getAbsoluteScale().x
    this.scaleY = this.konvaRect.getAbsoluteScale().y
    this.rotation = this.konvaRect.rotation() + this.konvaContext.selCompsGroup.rotation()
    this.syncChildrenCompLayout()
  }

  // syncCompLayout() {
  //   this.x = this.getRoundNum(this.konvaRect.getAbsolutePosition().x)
  //   this.y = this.getRoundNum(this.konvaRect.getAbsolutePosition().y)
  //   this.scaleX = this.getRoundNum(this.konvaRect.getAbsoluteScale().x)
  //   this.scaleY = this.getRoundNum(this.konvaRect.getAbsoluteScale().y)
  //   this.rotation = this.getRoundNum(this.konvaRect.rotation() + this.konvaContext.selCompsGroup.rotation())
  //   this.syncChildrenCompLayout()
  // }

  syncChildrenCompLayout() {
    // console.log(this.children)
    if (this.children && this.children.length > 0) {
      this.children.forEach((comp) => {
        // console.log(comp.initLayout)
        comp.scaleX = comp.initLayout.scaleX * this.scaleX
        comp.scaleY = comp.initLayout.scaleY * this.scaleY
        const x = (comp.initLayout.x - this.offsetX) * this.scaleX + this.x
        const y = (comp.initLayout.y - this.offsetY) * this.scaleY + this.y
        comp.x = (x - this.x) * Math.cos(this.rotation * Math.PI / 180) - (y - this.y) * Math.sin(this.rotation * Math.PI / 180) + this.x
        comp.y = (x - this.x) * Math.sin(this.rotation * Math.PI / 180) + (y - this.y) * Math.cos(this.rotation * Math.PI / 180) + this.y
        comp.rotation = comp.initLayout.rotation + this.rotation
        comp.syncChildrenCompLayout()
      })
    }
  }

  syncKonva() {
    this.konvaRect.setAbsolutePosition({
      x: this.x,
      y: this.y
    })
    this.konvaRect.scale({
      x: this.scaleX,
      y: this.scaleY
    })
    this.konvaRect.rotation(this.rotation)
    this.konvaRect.getLayer().draw()
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

    if (this.konvaRect) {
      const compPosition = this.konvaRect.getAbsolutePosition()
      this.konvaRect.moveTo(this.konvaRect.getLayer())
      this.konvaRect.setAbsolutePosition(compPosition)
      this.konvaRect.scale({
        x: this.konvaRect.getAbsoluteScale().x,
        y: this.konvaRect.getAbsoluteScale().y
      })
      this.konvaRect.rotation(this.konvaRect.rotation() + this.konvaContext.selCompsGroup.rotation())
      this.konvaRect.draggable(true)
    }
  }

  delete() {
    this.removeTempTransformer()
    this.konvaRect.destroy()
    this.konvaRect = null
  }

  addTransformer() {
    this.removeCompfromGroupSel()
    this.konvaRect.getLayer().add(this.konvaContext.transformer)
    //判断是否是添加到组上
    if (this.type === 'ScadaGroup') {
      // this.konvaContext.transformer.rotateEnabled(false)
      this.konvaContext.transformer.keepRatio(true)
      this.konvaContext.transformer.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
    } else {
      // this.konvaContext.transformer.rotateEnabled(true)
      this.konvaContext.transformer.keepRatio(false)
      this.konvaContext.transformer.enabledAnchors(['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right'])
    }

    this.konvaContext.transformer.attachTo(this.konvaRect)
    this.setDragBound(true)
    this.konvaRect.getLayer().draw()
  }

  toString() {
    return '()'
  }

  _roundNum(num) {
    return _.round(num, 3)
  }

  getCompLayout() {
    return {
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
  }

  getChildLayout(comp) {
    const x1 = comp.x
    const y1 = comp.y
    const rx0 = this.x
    const ry0 = this.y
    const x = (x1 - rx0) * Math.cos(-this.rotation * Math.PI / 180) - (y1 - ry0) * Math.sin(-this.rotation * Math.PI / 180) + rx0
    const y = (x1 - rx0) * Math.sin(-this.rotation * Math.PI / 180) + (y1 - ry0) * Math.cos(-this.rotation * Math.PI / 180) + ry0
    return {
      x: this._roundNum((x - this.x) / this.scaleX + this.offsetX - comp.offsetX * comp.scaleX / this.scaleX),
      y: this._roundNum((y - this.y) / this.scaleY + this.offsetY - comp.offsetY * comp.scaleY / this.scaleY),
      width: this._roundNum(comp.width),
      height: this._roundNum(comp.height),
      scaleX: this._roundNum(comp.scaleX / this.scaleX),
      scaleY: this._roundNum(comp.scaleY / this.scaleY),
      rotation: this._roundNum(comp.rotation - this.rotation)
    }
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
      this.konvaRect.dragBoundFunc((pos) => {
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
      this.konvaRect.dragBoundFunc(null)
    }

  }
}

export default CompCtrl