import hotkeys from 'hotkeys-js'

const HOTKEYS = 'delete, ctrl+g, ctrl+shift+g, space, ctrl+-, ctrl+=, ctrl+0, ctrl+9' +
  'up, down, left, right, ctrl+up, ctrl+down, ctrl+left, ctrl+right' +
  'ctrl+c, ctrl+v, ctrl+d, ctrl+l, ctrl+shift+[, ctrl+shift+]'

export default {
  data() {
    return {
      isKeySpacepressing: false,
      zoomPointPos: null
    }
  },
  methods: {
    initHotkeyBinding() {
      hotkeys(HOTKEYS, (e, handler) => {
        // hotkeys('*', (e, handler) => {
        // console.log(e)
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
            this.zoomPointPos = null
            this.zoomOut()
            break;
          case 'ctrl+=':
            this.zoomPointPos = null
            this.zoomIn()
            break;
          case 'ctrl+9':
            this.zoom100()
            break;
          case 'ctrl+0':
            this.zoomFit()
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
          case 'ctrl+l':
            this.doLockComp()
            break;
          case 'ctrl+shift+]':
            this.compsMoveTop()
            break;
          case 'ctrl+shift+[':
            this.compsMoveBottom()
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
        this.showPreview = false
      }
    },
    doCanvasZoom(e) {
      if (e.ctrlKey) {
        e.preventDefault()

        // console.log(this.konvaObjs.stage.getPointerPosition().x)

        const oldScale = this.konvaObjs.stage.scaleX()

        const mousePointTo = {
          x: this.konvaObjs.stage.getPointerPosition().x / oldScale - this.konvaObjs.stage.x() / oldScale,
          y: this.konvaObjs.stage.getPointerPosition().y / oldScale - this.konvaObjs.stage.y() / oldScale,
        }

        this.zoomPointPos = mousePointTo

        // console.log(mousePointTo)

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
    window.addEventListener('wheel', this.doCanvasZoom)
  },
  destroyed() {
    document.removeEventListener('keyup', this.setSpaceKeyState)
  },
  mounted() {
    this.initHotkeyBinding()
  }
}