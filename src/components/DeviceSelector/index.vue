<template>
  <div class="device-selector-root">
    <el-dialog
        title="设备绑定"
        :visible.sync="dialogVisible"
        width="1000px">
      <div class="device-selector-container">
        <device-type-tree class="child-panel" @change="changeType" :type="type"
                          :treedata="deviceTypeTree"></device-type-tree>
        <device-ins :type="type" class="child-panel" :uid="uid" @change="changeIns"></device-ins>
        <device-attrs :type="type" class="child-panel" @change="changeAttr" :attr="attr"></device-attrs>
      </div>
      <span slot="footer">
        <div class="binding-opts-item">
          <span>填入属性名至前缀</span>
          <el-switch v-model="autoLabel"/>
        </div>
        <div class="binding-opts-item">
          <span>填入单位至后缀</span>
          <el-switch v-model="autoUnit"/>
        </div>
        <!--<el-button @click="clearBinding" size="small">清除绑定</el-button>-->
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import DeviceTypeTree from './DeviceTypeList'
  import DeviceAttrs from './DeviceAttrList'
  import DeviceIns from './DeviceInsList'

  import StateStore from '../../mixin/StateStore'
  import utils from '../../utils'

  export default {
    name: 'DeviceSelector',
    components: { DeviceTypeTree, DeviceAttrs, DeviceIns },
    mixins: [StateStore],
    model: {
      prop: 'device',
      event: 'modelChange'
    },
    props: {
      device: {
        type: Object,
        default: function () {
          return {
            type: '',
            field: '',
            uid: ''
          }
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: this.visible,
        type: this.device.type,
        attr: this.device.field,
        uid: this.device.uid,
        unit: '',
        fieldLabel: '',
        autoLabel: true,
        autoUnit: true
      }
    },
    mounted() {
    },
    watch: {
      dialogVisible(val) {
        this.$emit('update:visible', val)
      },
      visible(val) {
        this.dialogVisible = val

        if (val) {
          this.$nextTick(() => {
            this.scrollCurrentToShow()
          })
        }
      },
      device(val) {
        console.log(val)
        this.type = val.type || this.type
        this.attr = val.field || this.attr
        this.uid = val.uid || this.uid
      }
    },
    methods: {
      scrollCurrentToShow() {
        const devTree = document.getElementsByClassName('device-selector-root')[0]

        const curTypeDom = devTree.getElementsByClassName('el-tree-node is-current')
        if (curTypeDom && curTypeDom.length > 0) {
          utils.scrollElementToshow(curTypeDom[0])
        }

        const curItemDom = devTree.getElementsByClassName('device-instance-item item active')
        if (curItemDom && curItemDom.length > 0) {
          utils.scrollElementToshow(curItemDom[0])
        }


        const curFieldDom = devTree.getElementsByClassName('attr-item active')
        if (curFieldDom && curFieldDom.length > 0) {
          utils.scrollElementToshow(curFieldDom[0])
        }
      },
      modelChange() {
        this.$emit('modelChange', {
          type: this.type,
          field: this.attr,
          uid: this.uid,
        })
      },
      changeType(data) {
        this.type = data.name
        this.attr = ""
        this.uid = ""
        this.modelChange()
      },
      changeAttr(attr) {
        this.attr = attr.name
        this.fieldLabel = attr.label
        this.unit = attr.unit
        this.modelChange()
      },
      changeIns(ins) {
        this.uid = ins.uid
        this.modelChange()
      },
      close() {
        this.dialogVisible = false

        this.$emit('change', {
          type: this.type,
          field: this.attr,
          uid: this.uid,
          unit: this.autoUnit ? this.unit : '',
          fieldLabel: this.autoLabel ? this.fieldLabel : ''
        })
      },
      clearBinding() {
        this.dialogVisible = false
        this.$emit('clear')
      }
    }
  }
</script>
<style lang="scss">
  .device-selector-root {
    .device-selector-container {
      display: flex;
      flex-flow: row;
      height: 400px;
      /*background-color: #ffffff;*/
      .child-panel {
        width: 300px;
        height: 100%;
        /*margin-right: 5px;*/
        background: #333;
        /*border: 1px solid #CCC;*/
      }
    }
  }

  .child-panel {
    .header {
      .title {
        color: #EEE;
        background-color: #666;
        padding: 4px 6px;
        font-size: 16px;
      }
    }
  }

  .binding-opts-item {
    display: inline-block;
    float: left;
    color: #EEE;
    margin-right: 20px;
    span {
      margin-right: 6px;
      font-size: 14px;
    }
  }
</style>