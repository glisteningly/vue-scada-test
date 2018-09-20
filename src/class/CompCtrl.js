import Guid from '../utils/guid'
import Konva from 'konva'
import hotkeys from 'hotkeys-js'

class CompCtrl {
  constructor(options) {
    const guid = Guid()
    // this.id = guid

    this.type = options.type
    this.options = options.options

    this.name = guid
    this.x = options.layout.x || 0
    this.y = options.layout.y || 0
    this.width = options.layout.width
    this.height = options.layout.height
    this.scaleX = options.layout.scaleX || 1
    this.scaleY = options.layout.scaleY || 1
    // this.offsetX = options.layout.offsetX || -(options.layout.width / 2)
    // this.offsetY = options.layout.offsetY || -(options.layout.height / 2)
    this.offsetX = 0
    this.offsetY = 0
    this.rotation = options.layout.rotation || 0
    // this.strokeWidth = 1
    // this.stroke= '#F00'
    this.draggable = true


    this.konvaRect = new Konva.Rect(this)
    this.tempTr = null

    this.konvaContext = options.konvaContext

    this.initKonva()
  }

  // get x() {
  //   return this._x
  // }
  //
  // set x(value) {
  //   this.x = value
  //   console.log('setter: ' + value)
  // }

  initKonva() {
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
      this.syncCompLayout()
      this.konvaContext.transformer.rotateEnabled(true)
      this.konvaContext.transformer.resizeEnabled(true)
      this.konvaContext.transformer.forceUpdate()
      this.konvaRect.getLayer().draw()
    })

    this.konvaContext.layers[0].add(this.konvaRect)
    this.konvaRect.getLayer().draw()
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
    this.rotation = this.konvaRect.rotation()
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
  }

  removeTempTransformer() {
    if (this.tempTr) {
      this.tempTr.destroy()
      this.tempTr = null
    }
  }

  removeCompfromGroupSel() {
    this.removeTempTransformer()

    const compPosition = this.konvaRect.getAbsolutePosition()
    this.konvaRect.moveTo(this.konvaRect.getLayer())
    this.konvaRect.setAbsolutePosition(compPosition)
    this.konvaRect.scale({
      x: this.konvaRect.getAbsoluteScale().x,
      y: this.konvaRect.getAbsoluteScale().y
    })
    this.konvaRect.draggable(true)
  }

  delete() {
    this.removeTempTransformer()
    this.konvaRect.destroy()
  }

  addTransformer() {
    this.removeCompfromGroupSel()
    this.konvaRect.getLayer().add(this.konvaContext.transformer)
    this.konvaContext.transformer.attachTo(this.konvaRect)
    this.setDragBound(true)
    this.konvaRect.getLayer().draw()
  }

  toString() {
    return '()'
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