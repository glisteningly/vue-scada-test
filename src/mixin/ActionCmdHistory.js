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
      this.recordToHistoryDebounce()
    },
  },
  methods: {
    recordToHistoryDebounce: _.debounce(function () {
      this.recordToHistory()
      // console.log(this.historyList.length)
    }, 500),
    undo() {
      if (this.historyIndex > 0) {
        // console.log('undo!')
        this.historyState = 'undo'
        this.historyIndex--
        this.loadFromHistory()
      }
    },
    redo() {
      // console.log('redo!')
      if (this.historyIndex < this.historyList.length - 1) {
        // console.log('redo!')
        this.historyState = 'redo'
        this.historyIndex++
        this.loadFromHistory()
      }
    },
    loadFromHistory() {
      this.comps = _.cloneDeep(this.historyList[this.historyIndex].comps)
      this.initKonvaWorkArea()
      this.toolState = ''
      const _toolState = this.historyList[this.historyIndex].toolState
      if (_toolState) {
        this.toolState = ''
        this.$nextTick(() => {
          this.toolState = _toolState
        })
      }

      const _selComps = []
      this.historyList[this.historyIndex].selectedIds.forEach(id => {
        const _selComp = _.find(this.comps, { name: id })
        if (_selComp) {
          _selComps.push(_selComp)
        }
      })
      if (_selComps.length > 0) {
        this.curSelComps = _selComps
      }
    },
    recordToHistory() {
      if (!this.historyState) {
        const _comps = _.cloneDeep(this.comps)
        const _selectedIds = []
        this.curSelComps.forEach(comp => {
          _selectedIds.push(comp.name)
        })

        if (this.historyIndex < this.historyList.length - 1) {
          const i = this.historyIndex + 1
          const l = this.historyList.length - this.historyIndex - 1
          // console.log(i + ',' + l)
          this.historyList.splice(i, l)
        }

        const _record = {
          comps: _comps,
          selectedIds: _selectedIds,
          toolState: this.toolState
        }

        this.historyList.push(_record)
        this.historyIndex = this.historyList.length - 1
      }
      this.historyState = null
    }
  },
  computed: {
    canUndo() {
      return (this.historyIndex > 0)
    },
    canRedo() {
      return (this.historyIndex < this.historyList.length - 1)
    }
  }
}