import ScadaImage from './ScadaImage'
import ScadaRect from './ScadaRect'
import ScadaLabel from './ScadaLabel'
import ScadaGroup from './ScadaGroup'
import CompWrapper from './CompWrapper'

const components = [CompWrapper, ScadaImage, ScadaRect, ScadaLabel, ScadaGroup]
const install = function (Vue) {
  if (install.installed) return

  components.map(function (component) {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install: install,
  // ScadaGroup: ScadaGroup,
  // ScadaImage: ScadaImage,
  // ScadaRect: ScadaRect,
  // ScadaLabel: ScadaLabel
}