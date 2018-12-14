const jstoxml = require('jstoxml')

import _ from 'lodash'

export default {
  getCompStr(components) {
    function bindingToValString(bindingObj) {
      if (!bindingObj) {
        return null
      }

      console.log(bindingObj)

      const bind = {}

      _.keys(bindingObj).forEach(key => {
        const _type = bindingObj[key].type || ''
        const _field = bindingObj[key].field || ''
        const _uid = bindingObj[key].uid || ''
        const _where = bindingObj[key].where || ''

        if (_type !== '' && _field !== '') {
          if (_uid) {
            bind[key] = `value['${_type}']['${_uid}']['${_field}']`
          } else {
            bind[key] = `value['${_type}']['${_field}']`
          }
        }
      })

      return bind
    }

    function compToXmlObj(components) {
      const comps = []

      components.forEach((item) => {
        const attrs = {
          ':comp': JSON.stringify(item.toVueTpl()).replace(/\"/g, "'")
        }

        // console.log(item.binding)

        if (!_.isEmpty(item.binding)) {
          const bind = bindingToValString(item.binding)
          Object.assign(attrs, { ':bindingValue': JSON.stringify(bind).replace(/\"/g, '') })
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
  getTplStr(components, docSettings) {
    const compStr = this.getCompStr(components)
    console.log(compStr)
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${docSettings.width} ${docSettings.height}" preserveAspectRatio="xMidYMid meet"><rect width="100%" height="100%" fill="${docSettings.bgColor}"></rect>${compStr}</svg>`
  }
}
