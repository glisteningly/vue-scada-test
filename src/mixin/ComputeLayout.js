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
        this.curSelComp.x = v + this.curSelComp.offsetX * this.curSelComp.scaleX
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
        this.curSelComp.y = v + this.curSelComp.offsetY * this.curSelComp.scaleY
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
        this.curSelComp.x = this.curSelComp.x + (v - this.curSelComp.width * this.curSelComp.scaleX) / 2
        this.curSelComp.scaleX = (v / this.curSelComp.width) || 1
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
        this.curSelComp.y = this.curSelComp.y + (v - this.curSelComp.height * this.curSelComp.scaleY) / 2
        this.curSelComp.scaleY = (v / this.curSelComp.height) || 1
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
        this.curSelComp.rotation = v
        // this.curSelComp.x = -(this.curSelComp.width * this.curSelComp.scaleX / 2) * Math.cos(v * Math.PI / 180) + (this.curSelComp.height * this.curSelComp.scaleY / 2) * Math.sin(v * Math.PI / 180) + this.curSelComp.x + this.curSelComp.width * this.curSelComp.scaleX / 2
        // this.curSelComp.y = -(this.curSelComp.width * this.curSelComp.scaleX / 2) * Math.sin(v * Math.PI / 180) - (this.curSelComp.height * this.curSelComp.scaleY / 2) * Math.cos(v * Math.PI / 180) + this.curSelComp.y + this.curSelComp.height * this.curSelComp.scaleY / 2
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
  }
}