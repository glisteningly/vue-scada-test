import { ModuleCommonUtil } from 'service-module-utils'
import { DeviceTypeService } from 'service-module-api'

const DeviceType = DeviceTypeService.DeviceType
const TreeFormatUtil = ModuleCommonUtil.TreeDataFormat

import { DOC_DEFAULT_SETTING } from '../const'

export default {
  methods: {
    initDocSettings() {
      this.docSettings = DOC_DEFAULT_SETTING
      this.disableCompAnime()
    },
    initDeviceType() {
      DeviceType.getDeviceTypes('TypeRoot').then(rootType => {
        this.deviceTypeTree = TreeFormatUtil.treeFormat(rootType.children)
      }).catch(() => {
        this.$message.error('设备类型系统获取失败')
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
    initEventHandle() {
      this.$events.on('CompClick', (data) => {
        if (this.showPreview) {
          this.$notify.info({
            title: '点击组件',
            message: JSON.stringify(data)
          })
        }
      })
    }
  },
  destroyed() {
    this.$events.removeAll()
  },
}