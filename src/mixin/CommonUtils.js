import _ from 'lodash'

export default {
  methods: {
    getRoundNum(num) {
      return _.round(num, 2)
    },
    getCompDefaultOptions(comp, library) {
      // console.log(comp)
      // console.log(library)
      if (comp) {
        const compType = comp.type
        if (library[compType]) {
          if (library[compType].props) {
            return library[compType].props.defaultOptions.default()
          }
        }
      }
      return null
    },
  },
  filters: {
    numPercent(value) {
      if (!value) return ''
      return _.round(value * 100) + '%'
    }
  },
}