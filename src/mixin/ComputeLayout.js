import _ from 'lodash'

export default {
  computed: {
    curSelCompLayoutX: {
      get() {
        if (this.curSelComp) {
          return this.getRoundNum(this.curSelComp.x - this.curSelComp.offsetX * this.curSelComp.scaleX)
        } else {
          return null
        }
      },
      set(v) {
        if (_.isNumber(v)) {
          this.curSelComp.x = v + this.curSelComp.offsetX * this.curSelComp.scaleX
          // console.log('xchange')
          // this.recordToHistoryDebounce()
        }
      }
    },
    curSelCompLayoutY: {
      get() {
        if (this.curSelComp) {
          return this.getRoundNum(this.curSelComp.y - this.curSelComp.offsetY * this.curSelComp.scaleY)
        } else {
          return null
        }
      },
      set(v) {
        if (_.isNumber(v)) {
          this.curSelComp.y = v + this.curSelComp.offsetY * this.curSelComp.scaleY
        }
      }
    },
    curSelCompLayoutW: {
      get() {
        if (this.curSelComp) {
          return this.getRoundNum(this.curSelComp.width * this.curSelComp.scaleX)
        } else {
          return null
        }
      },
      set(v) {
        if (_.isNumber(v)) {
          if (!this.curSelComp.points) {
            this.curSelComp.x = this.curSelComp.x + (v - this.curSelComp.width * this.curSelComp.scaleX) / 2
          }
          this.curSelComp.scaleX = (v / this.curSelComp.width) || 1
        }
      }
    },
    curSelCompLayoutH: {
      get() {
        if (this.curSelComp) {
          return this.getRoundNum(this.curSelComp.height * this.curSelComp.scaleY)
        } else {
          return null
        }
      },
      set(v) {
        if (_.isNumber(v)) {
          if (!this.curSelComp.points) {
            this.curSelComp.y = this.curSelComp.y + (v - this.curSelComp.height * this.curSelComp.scaleY) / 2
          }
          this.curSelComp.scaleY = (v / this.curSelComp.height) || 1
        }
      }
    },
    curSelCompLayoutR: {
      get() {
        if (this.curSelComp) {
          return this.getRoundNum(this.curSelComp.rotation)
        } else {
          return null
        }
      },
      set(v) {
        if (_.isNumber(v)) {
          this.curSelComp.rotation = v
        }
      }
    },
    curSelCompLayout: {
      get() {
        if (this.curSelComp) {
          return {
            x: this.getRoundNum(this.curSelComp.x),
            y: this.getRoundNum(this.curSelComp.y),
            scaleX: this.curSelComp.scaleX,
            scaleY: this.curSelComp.scaleY,
            rotation: this.getRoundNum(this.curSelComp.rotation),
            width: this.getRoundNum(this.curSelComp.width * this.curSelComp.scaleX),
            height: this.getRoundNum(this.curSelComp.height * this.curSelComp.scaleY),
          }
        } else {
          return null
        }
      }
    }
  },
  watch: {
    curSelCompLayout(newVal, oldVal) {
      if (oldVal && newVal && !this.historyState) {
        this.recordToHistoryDebounce()
      }
    }
  }
}