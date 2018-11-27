export default {
  methods: {
    alignCompsHC() {
      const destX = this.curSelComps[0].x
      this.curSelComps.forEach((comp) => {
        comp.x = destX
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    alignCompsVC() {
      const destY = this.curSelComps[0].y
      this.curSelComps.forEach((comp) => {
        comp.y = destY
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    alignCompsL() {
      const destX = this.curSelComps[0].x - this.curSelComps[0].offsetX * this.curSelComps[0].scaleX
      this.curSelComps.forEach((comp) => {
        comp.x = destX + comp.offsetX * comp.scaleX
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    alignCompsR() {
      const destX = this.curSelComps[0].x + this.curSelComps[0].offsetX * this.curSelComps[0].scaleX
      this.curSelComps.forEach((comp) => {
        comp.x = destX - comp.offsetX * comp.scaleX
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    alignCompsT() {
      const destY = this.curSelComps[0].y - this.curSelComps[0].offsetY * this.curSelComps[0].scaleY
      this.curSelComps.forEach((comp) => {
        comp.y = destY + comp.offsetY * comp.scaleY
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    alignCompsB() {
      const destY = this.curSelComps[0].y + this.curSelComps[0].offsetY * this.curSelComps[0].scaleY
      this.curSelComps.forEach((comp) => {
        comp.y = destY - comp.offsetY * comp.scaleY
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    }
  }
}