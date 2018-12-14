export default {
  methods: {
    setDocSize(width, height) {
      this.docSettings.width = width
      this.docSettings.height = height
      this.initKonvaWorkArea()
    }
  }
}