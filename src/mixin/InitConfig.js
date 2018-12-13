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

      })
    }
  }
}