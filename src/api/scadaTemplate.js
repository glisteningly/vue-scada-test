import { GraphQLService } from 'as-utils'

const BaseURL = '/api/template/graph'

class ScadaTemplate {
  static getScadaTplList() {
    return GraphQLService.fetchData({
      query: 'query{scadaTemplate{findList{id,name,typeName,tpl,image}}}',
      url: BaseURL,
      resProc: response => {
        return response.data.scadaTemplate.findList
      }
    })
  }

  static getScadaTplByType(typeName) {
    return GraphQLService.fetchData({
      query: 'query($TYPENAME:String){scadaTemplate{getByType(typeName:$TYPENAME)}}',
      args: {
        TYPENAME: typeName
      },
      url: BaseURL,
      resProc: response => {
        return response.data.scadaTemplate.getByType
      }
    })
  }

  static createScadaTpl(object) {
    return GraphQLService.fetchData({
      query: 'mutation($OBJECT:Object){scadaTemplate{create(object:$OBJECT){id,name,tpl}}}',
      args: {
        OBJECT: object
      },
      url: BaseURL,
      resProc: response => {
        return response.data.scadaTemplate.create
      }
    })
  }

  static updateScadaTpl(object) {
    return GraphQLService.fetchData({
      query: 'mutation($OBJECT:Object){scadaTemplate{update(object:$OBJECT){id,name,tpl}}}',
      args: {
        OBJECT: object
      },
      url: BaseURL,
      resProc: response => {
        return response.data.scadaTemplate.update
      }
    })
  }

  static deleteScadaTpl(id) {
    return GraphQLService.fetchData({
      query: 'mutation($ID:String){scadaTemplate{delete(id:$ID)}}',
      args: {
        ID: id
      },
      url: BaseURL,
      resProc: response => {
        return response.data.scadaTemplate.delete
      }
    })
  }
}

export default ScadaTemplate