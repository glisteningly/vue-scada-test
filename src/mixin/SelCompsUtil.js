// import _ from 'lodash'

export default {
  computed: {
    curSelComp() {
      if (this.selComps.length >= 1) {
        return this.selComps[0]
      } else {
        return null
      }
    },
    curSelCompsCount() {
      return this.selComps.length
    },
    curSelCompsType() {
      if (this.selComps.length > 1) {
        const compType = this.selComps[0].type
        let _isSameType = true
        for (let i = 0; i < this.selComps.length; i++) {
          _isSameType = (this.selComps[i].type === compType)
          if (!_isSameType) {
            break
          }
        }
        if (_isSameType) {
          return compType
        }
      }
      return null
    },
    curSelCompStyleOptions() {
      if (this.selComps.length >= 1) {
        if (this.selComps.length === 1) {
          return this.getCompStyleOptions()
        } else {
          return (this.curSelCompsType) ? this.getCompStyleOptions() : null
        }
      }
      return null
    },
    curSelSingleGroup() {
      return (this.selComps.length === 1 && this.selComps[0].type === 'ScadaGroupWrap')
    }
  },
}