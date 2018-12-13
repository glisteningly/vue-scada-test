import { ModuleCommonUtil } from 'service-module-utils'
import { DeviceTypeService } from 'service-module-api'

const DeviceType = DeviceTypeService.DeviceType

const TreeFormatUtil = ModuleCommonUtil.TreeDataFormat

export default {
  methods: {
    initDeviceType() {
      DeviceType.getDeviceTypes().then(rootType => {
        this.deviceTypeTree = TreeFormatUtil.treeFormat(rootType.children)
      }).catch(() => {
        this.$message.error('设备类型系统获取失败')
      })
    }
  }
}