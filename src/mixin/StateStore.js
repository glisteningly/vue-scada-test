export default {
  computed: {
    toolState: {
      get() {
        return this.$store.state.toolState
      },
      set(v) {
        const tool = this.$store.state.toolState ? '' : v
        // console.log(tool)
        this.$store.dispatch('SetToolState', tool).then(() => {
          // console.log(this.$store.state.toolState)
        })
      }
    },
    deviceTypeTree: {
      get() {
        return this.$store.state.deviceTypeList
      },
      set(v) {
        this.$store.dispatch('SetDeviceType', v).then(() => {
          // console.log(this.$store.state.deviceTypeList)
        })
      }
    }
  }
}