import _ from 'lodash'

export default {
  methods: {
    getRoundNum(num) {
      return _.round(num, 2)
    },
  }
}