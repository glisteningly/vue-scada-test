import ScadaTemplate from '../api/scadaTemplate'
import _ from 'lodash'
import utils from '../utils'
import { ScadaCompsLibrary } from '../components/Scada/index'

const addTplImagePath = './images/icons/ic-comp-add-tpl.png'


export default {
  props: {
    canAddToTpl: {
      type: Boolean,
      default: false
    },
    curSelComp: {
      type: Object
    }
  },
  data() {
    return {
      addTplImagePath: addTplImagePath,
      curTypeTpls: [],
    }
  },
  methods: {
    dragTypeTpl(e, tpl) {
      console.log('drag')
      const config = _.cloneDeep(tpl.config)
      config.bindingValue = this.getCompDefaultOptions(config.type)

      if (this.curSelInstanceUid && (config.type === "ScadaGroupWrap")) {
        utils.setGroupBinding(config, { uid: this.curSelInstanceUid })
      }

      e.dataTransfer.setData('data', JSON.stringify(config))
    },
    getCompDefaultOptions(compType) {
      if (ScadaCompsLibrary[compType]) {
        if (_.has(ScadaCompsLibrary[compType], ['props', 'defaultValue'])) {
          return ScadaCompsLibrary[compType].props.defaultValue.default() || {}
        }
      }
      return null
    },
    generateTpl(options) {
      const tplConfig = this.curSelComp.toConfig()
      tplConfig.layout.x = 0
      tplConfig.layout.y = 0

      const newTpl = {
        tpl: JSON.stringify(tplConfig),
        typeName: this.typeInfo.name,
        image: ''
      }

      return Object.assign(newTpl, options)
    },
    publishTplConfirm() {
      this.$prompt('请输入模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.typeInfo.label
      }).then(({ value }) => {
        this.tryPublishTpl(value)
      })
    },
    tryPublishTpl(tplname) {
      const newTpl = this.generateTpl({ name: tplname })
      ScadaTemplate.createScadaTpl(newTpl).then(data => {
        this.$message.success('模板发布成功！')
        this.getCurTypeTplList(this.typeInfo.name)
      })
    },
    deleteTplConfirm(tplId) {
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tryDeleteCurTypeTpl(tplId)
      })
    },
    tryDeleteCurTypeTpl(tplId) {
      ScadaTemplate.deleteScadaTpl(tplId).then(data => {
        this.$message.success('模板删除成功！')
        this.getCurTypeTplList(this.typeInfo.name)
      })
    },
    updateTplConfirm(tplId) {
      this.$confirm('将用选中的组件将更新此模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tryUpdateTpl(tplId)
      })
    },
    tryUpdateTpl(tplId) {
      const newTpl = this.generateTpl({ id: tplId })
      ScadaTemplate.updateScadaTpl(newTpl).then(data => {
        this.$message.success('模板更新成功！')
        this.getCurTypeTplList(this.typeInfo.name)
      })
    },
    getCurTypeTplList(typeName) {
      ScadaTemplate.getScadaTplByType(typeName).then(list => {
        // console.log(list)
        const tpls = []
        list.forEach(item => {
          tpls.push({
            id: item.id,
            type: item.typeName,
            name: item.name,
            config: JSON.parse(item.tpl),
          })
        })
        this.curTypeTpls = tpls
      })
    }
  }
}