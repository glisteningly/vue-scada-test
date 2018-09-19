import Guid from '../utils/guid'
import Konva from 'konva'

class CompCtrl {
  constructor(options) {
    const guid = Guid()
    // this.id = guid
    this.name = guid
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
    this.scaleX = 1
    this.scaleY = 1
    this.offsetX = options.offsetX
    this.offsetY = options.offsetY
    this.rotation = 0
    this.strokeWidth = 1
    // this.stroke= '#F00'
    // this.draggable = true
    this.konvaRect = new Konva.Rect(options)
    this.tempTr = null
    this.comp = options.comp
    this.konvaRect.draggable(true)

    this.konvaContext = options.konvaContext

    this.initKonva()
  }

  initKonva() {
    // 拖拽移动时即时变化
    // this.konvaRect.on('dragmove', () => {
    //   this.updateLayout()
    // })

    this.konvaRect.on('dragstart', () => {
      this.konvaContext.transformer.rotateEnabled(false)
      this.konvaContext.transformer.resizeEnabled(false)
      this.konvaRect.getLayer().draw()
    })

    this.konvaRect.on('dragend transformend', () => {
      this.updateLayout()
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

  updateLayout() {
    this.x = this.konvaRect.getAbsolutePosition().x
    this.y = this.konvaRect.getAbsolutePosition().y
    this.scaleX = this.konvaRect.getAbsoluteScale().x
    this.scaleY = this.konvaRect.getAbsoluteScale().y
    this.rotation = this.konvaRect.rotation()
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
    this.konvaRect.getLayer().draw()
  }

  isInSelGroup() {
    return this.konvaRect.getParent().getType() !== 'Group'
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }
}

export default CompCtrl