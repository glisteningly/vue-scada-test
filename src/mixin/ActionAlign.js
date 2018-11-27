export default {
  methods: {
    compsAlignHC() {
      const destX = this.curSelComps[0].x
      this.curSelComps.forEach((comp) => {
        comp.x = destX
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    compsAlignVC() {
      const destY = this.curSelComps[0].y
      this.curSelComps.forEach((comp) => {
        comp.y = destY
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    compsAlignL() {
      const destX = this.curSelComps[0].x - this.curSelComps[0].offsetX * this.curSelComps[0].scaleX
      this.curSelComps.forEach((comp) => {
        comp.x = destX + comp.offsetX * comp.scaleX
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    compsAlignR() {
      const destX = this.curSelComps[0].x + this.curSelComps[0].offsetX * this.curSelComps[0].scaleX
      this.curSelComps.forEach((comp) => {
        comp.x = destX - comp.offsetX * comp.scaleX
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    compsAlignT() {
      const destY = this.curSelComps[0].y - this.curSelComps[0].offsetY * this.curSelComps[0].scaleY
      this.curSelComps.forEach((comp) => {
        comp.y = destY + comp.offsetY * comp.scaleY
        comp.syncKonva()
        this.syncGroupSel()
        this.konvaObjs.groupTransformer.forceUpdate()
        this.konvaObjs.layers[0].draw()
      })
    },
    compsAlignB() {
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