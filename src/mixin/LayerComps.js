import _ from 'lodash'

export default {
  methods: {
    onLayerCompClick(data) {
      // console.log(data)
      const compCtrl = _.find(this.comps, { name: data.name })
      console.log(compCtrl)
      this.addCompToSelection(compCtrl)
    }
  }
}