import _ from 'lodash'

export default {
  data() {
    return {
      groupChildCompSelRect: null
    }
  },
  computed: {
    groupChildCompSelStyle() {
      if (this.groupChildCompSelRect) {
        return {
          left: this.groupChildCompSelRect.x - 2 + 'px',
          top: this.groupChildCompSelRect.y - 2 + 'px',
          width: this.groupChildCompSelRect.width + 3 + 'px',
          height: this.groupChildCompSelRect.height + 3 + 'px'
        }
      } else {
        return {
          display: 'none'
        }
      }
    }
  },
  methods: {
    onLayerCompClick(comp) {
      // console.log(data)
      this.unGroupSelAll()
      this.$nextTick(() => {
        const compCtrl = _.find(this.comps, { name: comp.name })
        // console.log(compCtrl)
        if (compCtrl) {
          this.addCompToSelection(compCtrl)
          this.groupChildCompSelRect = null
        } else {
          this.addCompToSelection(comp)
          const rect = document.getElementById(comp.name).getBoundingClientRect()
          if (rect) {
            this.groupChildCompSelRect = rect
          }
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