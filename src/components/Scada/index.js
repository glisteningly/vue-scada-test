import CompWrapper from './CompWrapper'
import ScadaImage from './ScadaImage'
import ScadaRect from './ScadaRect'
import ScadaLabel from './ScadaLabel'
import ScadaGroup from './ScadaGroup'
import ScadaGroupWrap from './ScadaGroupWrap'
import ScadaTube from './ScadaTube'
import ScadaStates from './ScadaStates'
import ScadaProgress from './ScadaProgress'


const components = [
  CompWrapper,
  ScadaImage,
  ScadaRect,
  ScadaLabel,
  ScadaGroup,
  ScadaTube,
  ScadaStates,
  ScadaProgress,
  ScadaGroupWrap
]

const install = function (Vue) {
  if (install.installed) return

  components.map(function (component) {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const ScadaCompsLibrary = {
  ScadaImage,
  ScadaRect,
  ScadaLabel,
  ScadaGroup,
  ScadaTube,
  ScadaStates,
  ScadaProgress,
  ScadaGroupWrap
}

// export default {
//   install: install,
//   ScadaCompsLibrary: ScadaCompsLibrary,
//   // ScadaGroup: ScadaGroup,
//   // ScadaImage: ScadaImage,
//   ScadaRect: ScadaRect,
//   // ScadaLabel: ScadaLabel
// }

export {
  ScadaCompsLibrary,
}

export default {
  install: install
}