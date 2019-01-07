import _ from 'lodash'

export default {
  methods: {
    compsMoveUp() {
      this.curSelComps.forEach((selComp) => {
        const i = _.findIndex(this.comps, selComp)
        if (i >= 0 && i < this.comps.length) {
          this.comps.splice(i, 1)
          this.comps.splice(i + 1, 0, selComp)
        }
      })
    },
    compsMoveDown() {
      this.curSelComps.forEach((selComp) => {
        const i = _.findIndex(this.comps, selComp)
        if (i > 0) {
          this.comps.splice(i, 1)
          this.comps.splice(i - 1, 0, selComp)
        }
      })
    },
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