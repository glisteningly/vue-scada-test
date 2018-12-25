const jstoxml = require('jstoxml')

import _ from 'lodash'

export default {
  generateMappingObj(queryConfig) {
    const data = {}
    for (const type in queryConfig) {
      const df = {}
      queryConfig[type].forEach(ds => {
        if (!ds.uid) {
          ds.field.forEach(f => {
            df[f] = ''
          })
        } else {
          const uidKey = ds.uid
          ds.field.forEach(f => {
            if (df[uidKey]) {
              df[uidKey][f] = ''
            } else {
              df[uidKey] = { [f]: '' }
            }
          })
        }
      })
      Object.assign(data, { [type]: df })
    }

    // console.log(data)

    return data
  },

  generateQuerySqlList(queryConfig) {
    const queryList = []
    for (const dataSource in queryConfig) {
      queryConfig[dataSource].forEach(ds => {
        let wqStr = ''

        if (ds.where !== '') {
          wqStr = `where ${ds.where}`
        } else {
          if (ds.uid) {
            wqStr = `where uid = "${ds.uid}"`
          }
        }

        const sql = `select ${ds.field.join(',')} from ${dataSource} ${wqStr}`
        const queryItem = { query: sql }

        // if (this.queryType !== 'realtime') {
        //   const args = {
        //     arguments: {
        //       engine: this.queryType
        //     }
        //   }
        //   Object.assign(queryItem, args)
        // }
        queryList.push(queryItem)

        // const whereKey = this.whereObjPrco(ds.where)
        // bindList.push({ dataSource: dataSource, dataWhere: whereKey })
      })
    }
    return queryList
  },

  generateBindingList(queryConfig) {
    const bindList = []
    for (const type in queryConfig) {
      queryConfig[type].forEach(ds => {
        bindList.push({ dataSource: type, dataWhere: ds.uid })
      })
    }
    return bindList
  },

  getQueryConfig(components) {
    // const dataConfig = []

    const dc = {}

    const addQueryConfig = (bindingObj) => {
      if (!bindingObj) {
        return null
      }

      _.keys(bindingObj).forEach(key => {
        const _type = bindingObj[key].type || ''
        const _field = bindingObj[key].field || ''
        const _uid = bindingObj[key].uid || ''
        const _where = bindingObj[key].where || ''

        if (_type !== '' && _field !== '') {
          const _qc = {
            [_type]: {
              field: [_field],
              uid: _uid,
              where: _where
            }
          }

          if (dc[_type]) {
            if (_where) {
              dc[_type].push(_qc[[_type]])
            } else {
              const i = _.findIndex(dc[_type], o => {
                return _.isEqual(o.uid, _uid)
              })
              if (i > -1) {
                if (dc[_type][i].field.indexOf(_field) === -1) {
                  dc[_type][i].field.push(_field)
                }
              } else {
                dc[_type].push(_qc[[_type]])
              }
            }
          } else {
            dc[_type] = [_qc[[_type]]]
          }
        }
      })
    }

    components.forEach(item => {
      addQueryConfig(item.binding)

      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          addQueryConfig(child.binding)
        })
      }
    })

    return dc
  },

  getCompStr(components) {
    const bindingToValString = (bindingObj) => {
      if (!bindingObj) {
        return null
      }

      // console.log(bindingObj)

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
      // console.log(comps)
      return comps
    }

    const comps = compToXmlObj(components)
    // console.log(comps)
    return jstoxml.toXML(comps)
  },
  getTplStr(docConfig, isShowBg = true) {
    const compStr = this.getCompStr(docConfig.comps)
    const filterStr = `<SvgColorFilter :blink="true"/>`
    const bgRectStr = isShowBg ? `<rect width="100%" height="100%" fill="${docConfig.docSettings.bgColor}"></rect>` : ''
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${docConfig.docSettings.width} ${docConfig.docSettings.height}" preserveAspectRatio="xMidYMid meet">${filterStr}${bgRectStr}${compStr}</svg>`
  }
}
