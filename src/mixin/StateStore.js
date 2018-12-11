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
    }
  },
}