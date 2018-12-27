import _ from 'lodash'

export default {
  methods: {
    compsMoveTop() {
      this.curSelComps.forEach((selComp) => {
        const i = _.findIndex(this.comps, selComp)
        if (i >= 0) {
          this.comps.splice(i, 1)
          this.comps.push(selComp)
        }
      })
    },
    compsMoveBottom() {
      this.curSelComps.forEach((selComp) => {
        const i = _.findIndex(this.comps, selComp)
        if (i >= 0) {
          this.comps.splice(i, 1)
          this.comps.unshift(selComp)
        }
      })
    }
  }
}