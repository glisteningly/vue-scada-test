const LAYOUT_FULL = {
  leftPanel: false,
  rightPanel: false,
  topToolbar: false
}

const LAYOUT_NORMAL = {
  leftPanel: true,
  rightPanel: true,
  topToolbar: true
}

export default {
  data() {
    return {
      editorLayout: LAYOUT_NORMAL,
      editorLayoutPopoverVisible: false
    }
  },
  methods: {
    toggleLeftPanel() {
      this.editorLayout.leftPanel = !this.editorLayout.leftPanel
    },
    toggleRightPanel() {
      this.editorLayout.rightPanel = !this.editorLayout.rightPanel
    },
    workAreaFullSize() {
      this.editorLayout = LAYOUT_FULL
      this.editorLayoutPopoverVisible = false
    },
    workAreaFullSizeReturn() {
      this.editorLayout = LAYOUT_NORMAL
    },
    toggleWorkAreaFullSize() {
      if (this.editorLayout.topToolbar) {
        this.editorLayout = LAYOUT_FULL
      } else {
        this.editorLayout = LAYOUT_NORMAL
      }
      this.editorLayoutPopoverVisible = false
    }
  },
  computed: {
    curEditorLayout() {
      return {
        leftPanel: this.editorLayout.leftPanel,
        rightPanel: this.editorLayout.rightPanel,
        topToolbar: this.editorLayout.topToolbar,
      }
    }
  },
  watch: {
    curEditorLayout() {
      this.$nextTick(() => {
        this.initKonvaWorkArea()
      })
    }
  }
}