const jstoxml = require('jstoxml')

export default {
  getCompStr(components) {

    function bindingToValString(bindingObj) {

    }

    function compToXmlObj(components) {
      const comps = []

      components.forEach((item) => {
        const attrs = {
          ':comp': JSON.stringify(item.toVueTpl()).replace(/\"/g, "'")
        }
        if (item.type === 'ScadaGroupWrap') {
          const c = compToXmlObj(item.children)

          comps.push({
            _name: 'ScadaGroup',
            _attrs: attrs,
            _content: c
          })
        } else {
          comps.push({
            _name: item.type,
            _attrs: attrs
          })
        }
      })
      console.log(comps)
      return comps
    }

    const comps = compToXmlObj(components)
    // console.log(comps)
    return jstoxml.toXML(comps)
  },
  getTplStr(components, svgConfig) {
    const compStr = this.getCompStr(components)
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgConfig.width} ${svgConfig.height}" preserveAspectRatio="xMidYMid meet"><rect width="100%" height="100%" fill="${svgConfig.bgColor}"></rect>${compStr}</svg>`
  }
}
