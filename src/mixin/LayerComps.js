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

    }
  }
}