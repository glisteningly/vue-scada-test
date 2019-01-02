import _ from 'lodash'

export default {
  methods: {
    onLayerCompClick(comp) {
      // console.log(data)
      this.unGroupSelAll()
      this.$nextTick(() => {
        const compCtrl = _.find(this.comps, { name: comp.name })
        // console.log(compCtrl)
        if (compCtrl) {
          // const unGroupCueSel = true
          this.addCompToSelection(compCtrl)
        } else {
          // const unGroupCueSel = true
          this.addCompToSelection(comp)
        }
      })
    },
    onLayerCompDroped(dropInfo) {
      const dragIndex = _.findIndex(this.comps, dropInfo.draggingComp)
      const dropIndex = _.findIndex(this.comps, dropInfo.dropComp)
      // console.log(dragIndex)
      // console.log(dropIndex)
      // console.log(dropInfo.dropType)
      if (dragIndex > -1 && dropIndex > -1) {
        console.log(dropInfo.dropType)
        this.comps.splice(dragIndex, 1)
        let newIndex = _.findIndex(this.comps, dropInfo.dropComp)
        if (dropInfo.dropType !== 'after') {
          this.comps.splice(newIndex + 1, 0, dropInfo.draggingComp)
        } else {
          this.comps.splice(newIndex, 0, dropInfo.draggingComp)
        }
        this.onLayerCompClick(dropInfo.draggingComp)
      }
    }
  }
}