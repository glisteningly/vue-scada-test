import hotkeys from 'hotkeys-js'

const HOTKEYS = ['delete', 'ctrl+g', 'ctrl+shift+g', 'space', 'ctrl+-', 'ctrl+=', 'ctrl+0', 'ctrl+9', 'f1', 'f9', 'f10', 'escape',
  'up', 'down', 'left', 'right', 'shift+up', 'shift+down', 'shift+left', 'shift+right',
  'ctrl+c', 'ctrl+v', 'ctrl+d', 'ctrl+l', 'ctrl+shift+l', 'ctrl+[', 'ctrl+]', 'ctrl+shift+[', 'ctrl+shift+]', 'ctrl+alt+l',
  'ctrl+z', 'ctrl+shift+z']

const HOTKEYS_DEF = HOTKEYS.join(',')

const MOVE_OFFSET = 30

export default {
  data() {
    return {
      isKeySpacepressing: false,
      zoomPointPos: null
    }
  },
  methods: {
    initHotkeyBinding() {
      hotkeys(HOTKEYS_DEF, (e, handler) => {
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
          case 'shift+up':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY -= 10
            break;
          case 'down':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY += 1
            break;
          case 'shift+down':
            if (this.curSingleSelComp)
              this.curSelCompLayoutY += 10
            break;
          case 'left':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX -= 1
            break;
          case 'shift+left':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX -= 10
            break;
          case 'right':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX += 1
            break;
          case 'shift+right':
            if (this.curSingleSelComp)
              this.curSelCompLayoutX += 10
            break;
          case 'ctrl+l':
            this.doLockComp()
            break;
          case 'ctrl+shift+l':
            this.doUnlockComp()
            break;
          case 'ctrl+]':
            this.compsMoveUp()
            break;
          case 'ctrl+[':
            this.compsMoveDown()
            break;
          case 'ctrl+shift+]':
            this.compsMoveTop()
            break;
          case 'ctrl+shift+[':
            this.compsMoveBottom()
            break;
          case 'ctrl+alt+l':
            this.$root._isShowLog = !this.$root._isShowLog
            break;
          case 'escape':
            this.toolState = ''
            this.showPreview = false
            break;
          case 'f1':
            this.isShowHelpDialog = !this.isShowHelpDialog
            break;
          case 'f9':
            if (!this.showPreview) {
              this.doPreview()
            } else {
              this.showPreview = false
            }
            break;
          case 'f10':
            this.onPublishDoc()
            break;
          case 'ctrl+z':
            this.undo()
            break;
          case 'ctrl+shift+z':
            this.redo()
            break;
        }
      })
    },
    setSpaceKeyState(e) {
      if (e.code === 'Space') {
        this.isKeySpacepressing = false
      }

      // if (e.code === 'Escape') {
      //   this.toolState = ''
      //   this.showPreview = false
      // }
    },
    onCanvasMouseWheel(e) {
      //按住ctrl键缩放
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
      } else {
        if (e.shiftKey) {
          //水平移动画布
          if (e.deltaY > 0) {
            const movedPos = {
              x: this.canvasLayout.x - MOVE_OFFSET,
              y: this.canvasLayout.y,
            }
            this.setCanvasPos(movedPos)
          } else {
            const movedPos = {
              x: this.canvasLayout.x + MOVE_OFFSET,
              y: this.canvasLayout.y,
            }
            this.setCanvasPos(movedPos)
          }
        } else {
          //垂直移动画布
          if (e.deltaY > 0) {
            const movedPos = {
              x: this.canvasLayout.x,
              y: this.canvasLayout.y - MOVE_OFFSET,
            }
            this.setCanvasPos(movedPos)
          } else {
            const movedPos = {
              x: this.canvasLayout.x,
              y: this.canvasLayout.y + MOVE_OFFSET,
            }
            this.setCanvasPos(movedPos)
          }
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
  watch: {
    isKeySpacepressing(val) {
      // console.log(this.isKeySpacepressing)
      if (val) {
        this.comps.forEach((comp) => {
          comp.konvaCtrl().draggable(false)
        })
        this.konvaObjs.stage.draggable(true)
        this.konvaObjs.stage.container().style.cursor = '-webkit-grabbing'
      } else {
        this.comps.forEach((comp) => {
          // TODO: 判断组件是否锁定
          if (!comp.locked) {
            comp.konvaCtrl().draggable(true)
          }
        })
        if (this.curSelComps.length > 1) {
          this.curSelComps.forEach((comp) => {
            comp.konvaCtrl().draggable(false)
          })
        }
        this.konvaObjs.stage.draggable(false)
        this.konvaObjs.stage.container().style.cursor = this.canvasCursorStyle
      }
    },
  },
  created() {
    document.addEventListener('keyup', this.setSpaceKeyState)
    document.addEventListener('copy', this.doCopy)
  },
  destroyed() {
    document.removeEventListener('keyup', this.setSpaceKeyState)
  },
  mounted() {
    this.initHotkeyBinding()
  }
}