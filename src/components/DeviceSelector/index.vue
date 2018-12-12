<template>
  <div class="device-selector-root">
    <el-dialog
        title="设备绑定"
        :visible.sync="dialogVisible"
        width="1000px">
      <div class="device-selector-container">
        <device-type-tree class="child-panel" @change="changeType" :type="type"></device-type-tree>
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
        <el-button @click="clearBinding" size="small">清除绑定</el-button>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="close" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import DeviceTypeTree from './DeviceTypeList'
  import DeviceAttrs from './DeviceAttrList'
  import DeviceIns from './DeviceInsList'

  export default {
    name: 'DeviceSelector',
    components: { DeviceTypeTree, DeviceAttrs, DeviceIns },
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
      },
      device(val) {
        this.type = val.type
        this.attr = val.field
        this.uid = val.uid
      }
    },
    methods: {
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
          unit: this.unit,
          fieldLabel: this.fieldLabel
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