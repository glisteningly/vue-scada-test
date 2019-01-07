import _ from 'lodash'

export default {
  data() {
    return {
      historyList: [],
      historyIndex: 0,
      historyState: null
    }
  },
  watch: {
    comps() {
      if (!this.historyState) {
        const h = _.cloneDeep(this.comps)

        if (this.historyIndex < this.historyList.length - 1) {
          const i = this.historyIndex + 1
          const l = this.historyList.length - this.historyIndex - 1
          console.log(i + ',' + l)
          this.historyList.splice(i, l)
        }

        this.historyList.push(h)
        this.historyIndex = this.historyList.length - 1
      }
      this.historyState = null
    },
  },
  methods: {
    undo() {
      console.log('undo!')
      if (this.historyIndex > 0) {
        this.historyState = 'undo'
        this.comps = _.cloneDeep(this.historyList[this.historyIndex - 1])
        this.historyIndex--
        this.initKonvaWorkArea()
      }
    },
    redo() {
      console.log('redo!')
      if (this.historyIndex < this.historyList.length - 1) {
        this.historyState = 'redo'
        this.comps = this.historyList[this.historyIndex + 1]
        this.historyIndex++
        this.initKonvaWorkArea()
      }
    }
  }
}