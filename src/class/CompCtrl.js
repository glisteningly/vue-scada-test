import Guid from '../utils/guid'
import Konva from 'konva'

class CompCtrl {
  constructor(options) {
    this.id = Guid()
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
    // stroke= '#F00'
    this.name = Guid()
    this.draggable = true
    this.konvaRect = new Konva.Rect(options)
    this.tempTr = null
    this.comp = options.comp
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }

  // getCompOptions(options) {
  //   return {
  //     id: Guid(),
  //     x: options.x,
  //     y: options.y,
  //     width: options.width,
  //     height: options.height,
  //     scaleX: 1,
  //     scaleY: 1,
  //     offsetX: options.offsetX,
  //     offsetY: options.offsetY,
  //     rotation: 0,
  //     strokeWidth: 1,
  //     // stroke: '#F00',
  //     name: Guid(),
  //     draggable: true,
  //     konvaRect: null,
  //     comp: options.comp
  //   }
  // }
}

export default CompCtrl