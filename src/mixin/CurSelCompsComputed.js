// import _ from 'lodash'

export default {
  methods: {
    getCompIndex(compCtrl) {
      if (compCtrl) {
        return _.findIndex(this.comps, { name: compCtrl.name })
      } else {
        return -1
      }
    }
  },
  computed: {
    curSelComp() {
      if (this.curSelComps.length >= 1) {
        return this.curSelComps[0]
      } else {
        return null
      }
    },
    curSelCompUid() {
      if (this.curSelComp) {
        return this.curSelComp.name
      } else {
        return null
      }
    },
    curSelCompIndex() {
      return this.getCompIndex(this.curSelComp)
    },
    curSingleSelComp() {
      if (this.curSelComps.length === 1) {
        return this.curSelComps[0]
      } else {
        return null
      }
    },
    multiCompsSelected() {
      return this.curSelComps.length > 1
    },
    canDoSelCompAction() {
      return this.curSelComps.length > 0
    },
    canUnGroupComps() {
      return (this.curSelComps.length === 1 && this.curSelComps[0].type === 'ScadaGroupWrap')
    },
    curSelCompsType() {
      if (this.curSelComps.length >= 1) {
        const compType = this.curSelComps[0].type
        let _isSameType = true
        this.curSelComps.forEach(comp => {
          _isSameType = (comp.type === compType)
        })
        if (_isSameType) {
          return compType
        }
      }
      return null
    },
  },
}