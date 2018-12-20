export default {
  methods: {
    setDocSize(width, height) {
      this.docSettings.width = width
      this.docSettings.height = height
      this.initKonvaWorkArea()
    },
    onSettingsChanged(docSettings) {
      console.log(docSettings)
      Object.assign(this.docSettings, docSettings)

      if (docSettings.width && docSettings.height) {
        this.setDocSize(docSettings.width, docSettings.height)
      }
    }
  }
}