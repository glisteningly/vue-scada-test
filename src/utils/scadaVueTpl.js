const jstoxml = require('jstoxml')
// import Vue from 'vue'
// import BaseScadaView from '../components/Scada/BaseScadaView.vue'

export default {
  getCompStr(components) {
    const comps = []

    components.forEach((item) => {
      const attrs = {
        ':comp': JSON.stringify(item.toVueTpl()).replace(/\"/g, "'")
      }
      // if (Object.getOwnPropertyNames(item.params).length > 1) {
      //   Object.assign(attrs, { ':params': JSON.stringify(item.params).replace(/\"/g, "'") })
      // }
      // if (Object.getOwnPropertyNames(item.bind).length > 1) {
      //   Object.assign(attrs, { ':value': JSON.stringify(item.bind).replace(/\"/g, '') })
      // }
      comps.push({
        _name: item.type,
        _attrs: attrs
      })
    })
    return jstoxml.toXML(comps)
  },
  getTplStr(components, svgConfig) {
    const compStr = this.getCompStr(components)
    return `<svg version="1.1" 
xmlns="http://www.w3.org/2000/svg" 
viewBox="0 0 ${svgConfig.w} ${svgConfig.h}"
preserveAspectRatio="xMidYMid meet">
<rect width="100%" height="100%" fill="${svgConfig.bgColor}"></rect>${compStr}</svg>`
  }
  // getTplStr(components, svgConfig) {
  //   const compStr = this.getCompStr(components)
  //   return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgConfig.w} ${svgConfig.h}"  preserveAspectRatio="xMidYMid meet"
  //                          ><rect width="100%" height="100%" fill="${svgConfig.bgColor}"></rect>${compStr}</svg>`
  // }
  // initScadaComp(components, svgConfig = { w: 1000, h: 600, bgColor: '#FFF' }) {
  //   Vue.component('ScadaView', {
  //     extends: BaseScadaView,
  //     template: this.getTplStr(components, svgConfig)
  //   })
  // }
}
