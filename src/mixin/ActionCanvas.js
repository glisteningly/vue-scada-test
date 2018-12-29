import _ from 'lodash'

import { ZOOM_SCALE_SETTING } from '../const'

export default {
  methods: {
    zoomIn() {
      if (_.indexOf(ZOOM_SCALE_SETTING, this.canvasLayout.scale) === -1) {
        const scale = _.round(this.canvasLayout.scale, 1)
        this.zoomScaleIndex = _.indexOf(ZOOM_SCALE_SETTING, scale)
      }

      if (this.zoomScaleIndex < ZOOM_SCALE_SETTING.length - 1) {
        this.zoomScaleIndex += 1
        this.canvasLayout.scale = this.curZoomScale
      }
    },
    zoomOut() {
      if (_.indexOf(ZOOM_SCALE_SETTING, this.canvasLayout.scale) === -1) {
        const scale = _.round(this.canvasLayout.scale, 1)
        this.zoomScaleIndex = _.indexOf(ZOOM_SCALE_SETTING, scale)
      }

      if (this.zoomScaleIndex > 0) {
        this.zoomScaleIndex -= 1
        this.canvasLayout.scale = this.curZoomScale
      }
    },
    zoom100() {
      // if (this.zoomScaleIndex !== 8) {
      this.zoomScaleIndex = 8
      this.canvasLayout.scale = this.curZoomScale
      // }
    },
    zoomFit() {
      if (!this.$refs['workCanvas']) return

      const width = this.$refs['workCanvas'].clientWidth
      // const height = this.$refs['workCanvas'].clientHeight

      const scale = (width - 40) / this.docSettings.width
      // console.log(scale)

      this.zoomPointPos = null
      this.setCanvasPos({ x: 20, y: 20 })
      this.canvasLayout.scale = scale
      this.setCanvasZoom({ scale: scale })
      // console.log(scale)
    },
    setCanvasPos(pos = { x: 0, y: 0 }) {
      this.konvaObjs.stage.position(pos)
      this.canvasLayout.x = this.konvaObjs.stage.x()
      this.canvasLayout.y = this.konvaObjs.stage.y()
      this.canvasRedraw()
    },
    setCanvasZoom(zoomParam = { scale: 1, px: 0, py: 0 }) {
      // console.log(zoomParam)
      this.konvaObjs.stage.scaleX(zoomParam.scale)
      this.konvaObjs.stage.scaleY(zoomParam.scale)

      if (zoomParam.px && zoomParam.py && this.konvaObjs.stage.getPointerPosition()) {
        const newPos = {
          x: -(zoomParam.px - this.konvaObjs.stage.getPointerPosition().x / zoomParam.scale) * zoomParam.scale,
          y: -(zoomParam.py - this.konvaObjs.stage.getPointerPosition().y / zoomParam.scale) * zoomParam.scale
        }
        this.setCanvasPos(newPos)
      }

      if (this.curSelComp) {
        this.konvaObjs.transformer.forceUpdate()
      }
      if (this.multiCompsSelected) {
        this.konvaObjs.groupTransformer.forceUpdate()
      }
      this.konvaObjs.selCompsRect.strokeWidth(1 / zoomParam.scale)
      this.konvaObjs.paperRect.strokeWidth(1 / zoomParam.scale)
      this.canvasRedraw()
    },
    onCanvasPosNav(pos) {
      const container = this.$refs['workCanvas']
      // const width = container.clientWidth
      // const height = container.clientHeight

      const centerPos = {
        x: container.clientWidth / 2,
        y: container.clientHeight / 2
      }
      const hitPos = {
        x: this.docSettings.width * this.canvasLayout.scale * pos.x,
        y: this.docSettings.height * this.canvasLayout.scale * pos.y,
      }
      const offsetPos = {
        x: centerPos.x - hitPos.x,
        y: centerPos.y - hitPos.y,
      }
      // console.log(pos)
      this.setCanvasPos(offsetPos)
      // this.canvasRedraw()
    },
    canvasRedraw() {
      const container = this.$refs['workCanvas']

      const width = container.clientWidth
      const height = container.clientHeight

      this.canvasLayout.width = width
      this.canvasLayout.height = height

      this.konvaObjs.stage.width(width)
      this.konvaObjs.stage.height(height)
      this.konvaObjs.stage.batchDraw()
    },
  },
  computed: {
    canvasZoom() {
      return this.canvasLayout.scale
    },
    curZoomScale() {
      return ZOOM_SCALE_SETTING[this.zoomScaleIndex]
    },
  },
  watch: {
    canvasZoom() {
      const param = {
        scale: this.canvasLayout.scale

      }

      if (this.zoomPointPos) {
        Object.assign(param, {
          px: this.zoomPointPos.x,
          py: this.zoomPointPos.y
        })
      }

      this.setCanvasZoom(param)
    },
  }
}