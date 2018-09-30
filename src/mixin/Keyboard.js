import hotkeys from 'hotkeys-js'

export default {
  methods: {
    initHotkeyBinding() {
      hotkeys('delete,ctrl+g,ctrl+shift+g,space', (e, handler) => {
        // hotkeys('*', (e, handler) => {
        e.preventDefault()
        // console.log(hotkeys.isPressed("space"))
        switch (handler.key) {
          case "delete":
            this.compsDelete()
            break;
          case "ctrl+g":
            this.jointCompsToGroup()
            break;
          case "ctrl+shift+g":
            this.unGroupToComps()
            break;
          case "space":
            this.isKeySpacepressing = true
            break;
        }
      })
    },
    setSpaceKeyState(e) {
      if (e.code === 'Space') {
        this.isKeySpacepressing = false
      }
    }
  },
  created() {
    document.addEventListener('keyup', this.setSpaceKeyState)
  },
  destroyed() {
    document.removeEventListener('keyup', this.setSpaceKeyState)
  },
  mounted() {
    this.initHotkeyBinding()
  }
}