import VizResourceService from '../api/vizRes'

import ScadaVueTpl from '../utils/scadaVueTpl'

export default {
  data() {
    return {
      // draftId: null,
      // editorId: 1,
      // visGroupId: 1,
    }
  },
  methods: {
    getDocSaveStr() {
      const compConfig = []
      this.comps.forEach((comp) => {
        compConfig.push(comp.toConfig())
      })
      const saveSlot = {
        comps: compConfig,
        docSettings: this.docSettings,
      }
      return JSON.stringify(saveSlot)
    },
    loadDocFromTplStr(str) {
      const saveSlot = JSON.parse(str)
      if (saveSlot) {
        this.docSettings = saveSlot.docSettings
        this.initKonvaWorkArea()

        saveSlot.comps.forEach((comp) => {
          this.addCompToCanvas(comp)
        })
      }
    },
    generateDraft() {
      const image = ''
      const draft = {
        name: this.docInfo.name,
        label: this.docInfo.name,
        description: '',
        config: this.getDocSaveStr(),
        // config: this.getDocSaveSlot(),
        thumbnail: image,
        editorConfig: {},
        type: 'ScadaNew',
      }
      return draft
    },
    generatePublish() {
      const image = ''
      const scadaConfig = { comps: this.comps, docSettings: this.docSettings }
      const scadaTpl = ScadaVueTpl.getTplStr(scadaConfig, false)
      const queryConfig = ScadaVueTpl.getQueryConfig(this.comps)
      return {
        name: this.docInfo.name,
        label: this.docInfo.name,
        description: '',
        config: {
          scadaTpl: scadaTpl,
          // scadaStyle: this.canvasConfig.affixStyle,
          queryConfig: queryConfig,
          // queryConfig: {
          //   queryType: this.canvasConfig.queryType,
          //   queryInterval: this.canvasConfig.queryInterval
          // }
        },
        thumbnail: image,
        editorConfig: {},
        type: 'ScadaNew',
      }
    },
    saveDraft(state) {
      return new Promise((resolve, reject) => {
        let param = this.generateDraft()
        param.state = state
        if (this.docInfo.draftId && this.docInfo.draftId !== '0') {
          param.id = this.docInfo.draftId
          param.modifierId = this.docInfo.editorId
          VizResourceService.updateDraft(param).then(() => {
            resolve(param)
          }).catch(error => {
            reject(error)
          })
        } else {
          param.creatorId = this.docInfo.editorId
          param.modifierId = this.docInfo.editorId
          param.pid = this.docInfo.visGroupId
          VizResourceService.createDraft(param).then(draft => {
            this.docInfo.draftId = draft.id
            resolve(param)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    onActionSaveDraft() {
      this.saveDraft('EDIT').then(() => {
        this.$message.success('保存成功！')
      }).catch(error => {
        this.$message.error(`保存失败 - ${error}`)
      })
    },
    onPublishDoc() {
      this.saveDraft('PUBLISHED').then(() => {
        let param = this.generatePublish()
        param.vizResourceEditId = this.docInfo.draftId
        VizResourceService.publishDraft(param).then(() => {
          this.$message.success('发布成功！')
        })
      })
    },
    onActionLoadDocLocal() {
      this.loadDocFromTplStr(localStorage.getItem('saveSlot'))
    },
    onActionSaveDocLocal() {
      const saveSlot = this.getDocSaveStr()
      localStorage.setItem('saveSlot', saveSlot)
    },
    openDraft(id) {
      VizResourceService.getDraftById(id).then((config) => {
        console.log(config)
        this.loadDocFromTplStr(config.config)
        this.docInfo.name = config.label
        this.docInfo.editorId = config.modifierId || this.$route.query.uid
        this.zoomFit()
      }).catch(error => {
        this.$message.error(`打开可视化资源失败 - ${error}`)
      })
    },
    initDocFromParam() {
      if (this.$route.params.id && this.$route.params.id !== '0') {
//          console.log(this.$route.params)
        this.docInfo.draftId = this.$route.params.id
        this.openDraft(this.docInfo.draftId)
      } else {
        this.docInfo.name = this.$route.query.name
      }
      if (this.$route.query.uid) {
        this.docInfo.editorId = this.$route.query.uid
      }
      if (this.$route.query.pid) {
        this.docInfo.visGroupId = this.$route.query.pid
      }
    },
  },
  computed: {
    docName() {
      return this.docInfo.name
    }
  },

  watch: {
    docName(val) {
      val = val || '未命名'
      document.title = val + ' - ScadaEditor'
    }
  }
}