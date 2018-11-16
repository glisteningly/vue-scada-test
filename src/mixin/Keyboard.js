import hotkeys from 'hotkeys-js'

export default {
  data() {
    return {
      isKeySpacepressing: false
    }
  },
  methods: {
    initHotkeyBinding() {
      hotkeys('delete,ctrl+g,ctrl+shift+g,space,ctrl+-,ctrl+=,ctrl+0', (e, handler) => {
        // hotkeys('*', (e, handler) => {
        e.preventDefault()
        // console.log(hotkeys.isPressed("space"))
        switch (handler.key) {
          case 'delete':
            this.compsDelete()
            break;
          case 'ctrl+g':
            this.jointCompsToGroup()
            break;
          case 'ctrl+shift+g':
            this.unGroupToComps()
            break;
          case 'space':
            this.isKeySpacepressing = true
            console.log('escape')
            break;
          case 'ctrl+-':
            this.zoomOut()
            break;
          case 'ctrl+=':
            this.zoomIn()
            break;
          case 'ctrl+0':
            this.zoom100()
            break;
        }
      })
    },
    setSpaceKeyState(e) {
      if (e.code === 'Space') {
        this.isKeySpacepressing = false
      }

      if (e.code === 'Escape') {
        this.toolState = ''
      }
    },
    preventBrowserZoom(e) {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY > 0) {
          this.zoomOut()
        } else {
          this.zoomIn()
        }
      }
    }
  },
  created() {
    document.addEventListener('keyup', this.setSpaceKeyState)
    window.addEventListener('wheel', this.preventBrowserZoom)
  },
  destroyed() {
    document.removeEventListener('keyup', this.setSpaceKeyState)
  },
  mounted() {
    this.initHotkeyBinding()
  }
}