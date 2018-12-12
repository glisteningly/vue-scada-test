import { ModuleCommonUtil } from 'service-module-utils'
import { DeviceTypeService } from 'service-module-api'

const DeviceType = DeviceTypeService.DeviceType

const TreeFormatUtil = ModuleCommonUtil.TreeDataFormat

export default {
  methods: {
    initDeviceType() {
      DeviceType.getDeviceTypes().then(rootType => {
        // console.log(rootType.children)

        const treeData = TreeFormatUtil.treeFormat(rootType.children)
        // this.$store.dispatch('SetDeviceType', treeData).then(() => {
        //   // console.log(this.$store.state.deviceTypeList)
        // })
        this.deviceTypeTree = treeData
      })
    }
  }
}