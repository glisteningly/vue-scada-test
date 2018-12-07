import hotkeys from 'hotkeys-js'

const HOTKEYS = 'delete, ctrl+g, ctrl+shift+g, space, ctrl+-, ctrl+=, ctrl+0,' +
  'up, down, left, right, ctrl+up, ctrl+down, ctrl+left, ctrl+right' +
  'ctrl+c, ctrl+v, ctrl+d'

export default {
  data() {
    return {
      isKeySpacepressing: false
    }
  },
  methods: {
    initHotkeyBinding() {
      hotkeys(HOTKEYS, (e, handler) => {
        // hotkeys('*', (e, handler) => {
        console.log(e)
        if (e.ctrlKey) {
          switch (e.keyCode) {
            case 67: // copy
              this.doCopy()
              break;
            case 86: // paste
              this.doPaste()
              break;
          }
        }

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
          case 'up':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY -= 1
            break;
          case 'ctrl+up':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY -= 10
            break;
          case 'down':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY += 1
            break;
          case 'ctrl+down':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY += 10
            break;
          case 'left':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX -= 1
            break;
          case 'ctrl+left':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX -= 10
            break;
          case 'right':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX += 1
            break;
          case 'ctrl+right':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX += 10
            break;
          // case 'ctrl+c':
          //   console.log('ctrl+c')
          //   break;
        }
      })
    },
    setSpaceKeyState(e) {
      if (e.code === 'Space') {
        this.isKeySpacepressing = false
      }

      if (e.code === 'Escape') {
        this.toolState = ''
        this.showPreview = false
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
    },
    doCopy(e) {
      this.copyCompsTolocalStorage()
      // console.log('copy!')
    },
    doPaste(e) {
      this.loadCompsFromlocalStorage()
    }
  },
  created() {
    document.addEventListener('keyup', this.setSpaceKeyState)
    document.addEventListener('copy', this.doCopy)
    window.addEventListener('wheel', this.preventBrowserZoom)
  },
  destroyed() {
    document.removeEventListener('keyup', this.setSpaceKeyState)
  },
  mounted() {
    this.initHotkeyBinding()
  }
}