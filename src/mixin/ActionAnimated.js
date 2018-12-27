const SCADA_ANIME_CSS =
  `svg#svg_scada_view .scada-anime {
  animation-name: none!important;
}`

// const getStyleEl = () => {
//   let styleEl = document.getElementById('scada-style')
//   if (!styleEl) {
//     styleEl = document.createElement('style')
//     styleEl.setAttribute('id', 'scada-style')
//     document.head.appendChild(styleEl)
//   }
//   return styleEl
// }

export default {
  data() {
    return {
      isAnimationEnabled: false
    }
  },
  methods: {
    toggleScadaAnimation() {
      this.isAnimationEnabled = !this.isAnimationEnabled
    },
    getStyleEl() {
      let styleEl = document.getElementById('scada-style')
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.setAttribute('id', 'scada-style')
        document.head.appendChild(styleEl)
      }
      return styleEl
    },
    disableCompAnime() {
      this.getStyleEl().innerHTML = SCADA_ANIME_CSS
    }
  },
  watch: {
    isAnimationEnabled(val) {
      this.getStyleEl().innerHTML = val ? '' : SCADA_ANIME_CSS
    }
  }
}

