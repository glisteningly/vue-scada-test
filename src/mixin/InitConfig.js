import { ModuleCommonUtil } from 'service-module-utils'
import { DeviceTypeService } from 'service-module-api'

const DeviceType = DeviceTypeService.DeviceType

const TreeFormatUtil = ModuleCommonUtil.TreeDataFormat

export default {
  methods: {
    initDocSettings() {
      this.docSettings = {
        // bgColor: 'rgb(13, 51, 73)',
        bgColor: '#030A3E',
        width: 1000,
        height: 600
      }
    },
    initDeviceType() {
      DeviceType.getDeviceTypes().then(rootType => {
        this.deviceTypeTree = TreeFormatUtil.treeFormat(rootType.children)
      }).catch(() => {
        this.$message.error('设备类型系统获取失败')
      })
    }
  }
}