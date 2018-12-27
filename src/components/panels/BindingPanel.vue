<template>
  <div class="binding_panel ctrl-panel">
    <div v-if="curSelCompsCount > 1 && curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个 {{curSelCompsType}}</span>
    </div>
    <div v-if="curSelCompsCount > 1 && !curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个不同类型对象</span>
    </div>
    <el-tabs v-if="compValueBindingCount > 0" v-model="activeTab" type="border-card">
      <el-tab-pane v-for="(ctrl,key) in compBindings" :key="key" :label="ctrl.label" :name="key">
        <div class="action-list">
          <el-button plain size="mini" @click="openSelDialog">对象选择</el-button>
          <!--<el-button plain size="mini" class="btn-unbinding" icon="el-icon-close" @click="onBindingClear"/>-->
          <el-button title="清除绑定" plain size="mini" class="btn-unbinding" @click="onBindingClear">✕</el-button>
          <el-button plain size="mini" v-show="key === 'alarm'">关联</el-button>
          <el-input-number class="value-preview" @change="compValChanged(ctrl.value)"
                           placeholder="预览值" controls-position="right"
                           v-model="ctrl.value"/>
        </div>
        <div class="ctrl-item">
          <el-row>
            <el-col :span="4"><label class="label-bid">类型</label></el-col>
            <el-col :span="20">
              <el-input @change="compBindingChanged(ctrl.binding.type,'type')"
                        v-model="ctrl.binding.type"/>
            </el-col>
          </el-row>
        </div>
        <div class="ctrl-item">
          <el-row>
            <el-col :span="4"><label class="label-bid">uid</label></el-col>
            <el-col :span="20">
              <el-input @change="compBindingChanged(ctrl.binding.uid,'uid')"
                        :title="ctrl.binding.uid"
                        v-model="ctrl.binding.uid"/>
            </el-col>
          </el-row>
        </div>
        <div class="ctrl-item">
          <el-row>
            <el-col :span="4"><label class="label-bid">属性</label></el-col>
            <el-col :span="20">
              <el-input @change="compBindingChanged(ctrl.binding.field,'field')"
                        v-model="ctrl.binding.field"/>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24">
            <el-input type="textarea"
                      :rows="1"
                      v-model="ctrl.binding.where"
                      @change="compBindingChanged(ctrl.binding.where,'where')"
                      placeholder="查询 where 语句"/>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <DeviceSelector ref="deviceSelector" v-model="deviceBinding" :visible.sync="selectorVisible"
                    @change="onBindingChange" @clear="onBindingClear"></DeviceSelector>
  </div>
</template>

<script>
  import _ from 'lodash'
  import OptionDefs from '../../const/optionDefs'
  import { ScadaCompsLibrary } from '../Scada/index'
  import SelCompsUtil from '../../mixin/SelCompsUtil'

  import DeviceSelector from '../../components/DeviceSelector'


  export default {
    mixins: [SelCompsUtil],
    components: { DeviceSelector },
    name: 'BindingPanel',
    data() {
      return {
        activeTab: '',
        compBindings: {},
        lastSelTab: '',
        selectorVisible: false,
        deviceBinding: {
          type: '',
          field: '',
          uid: ''
        }
      }
    },
    props: {
      optionCategory: '',
      selCompType: null,
      selComps: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      compBindingChanged(value, inputField) {
        this.$emit('compBindingChanged', { [this.activeTab]: { [inputField]: value } })
      },
      compValChanged(value) {
        this.$emit('compValChanged', { [this.activeTab]: value })
      },
      getCompCateBinding() {
        // console.log(this.getCompDefaultValue())
        // console.log(this.getCompBindingDefine())

        const compValBindings = this.getCompDefaultValue()
        if (!compValBindings) {
          return null
        }

        const compDefine = this.getCompBindingDefine()
        const bindingCtrls = {}
        for (const key in compValBindings) {
          const _bingTemplate = {
            type: '',
            uid: '',
            field: '',
            where: ''
          }

          const _compCurBinding = this.getCompBinding(this.curSelComp)
          const _compValBinding = _compCurBinding ? _compCurBinding[key] : {}
          const _b = Object.assign(_bingTemplate, _compValBinding)

          const ctrl = _.has(compDefine, key) ? {
            label: compDefine[key].label,
          } : {
            label: OptionDefs.binding[key].label,
          }

          const _v = (_.has(this.curSelComp, ['bindingValue', key])) ? this.curSelComp.bindingValue[key] : null

          Object.assign(ctrl, {
            binding: _b,
            value: _v
          })

          bindingCtrls[key] = Object.assign({}, ctrl)
        }
        return bindingCtrls
      },
      getCompDefaultValue() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            if (_.has(ScadaCompsLibrary[compType], ['props', 'defaultValue'])) {
              return ScadaCompsLibrary[compType].props.defaultValue.default() || {}
            }
          }
        }
        return null
      },
      getCompBinding(comp) {
        if (comp) {
          return comp.binding
        }
        return null
      },
      getCompBindingDefine() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (_.has(ScadaCompsLibrary[compType], 'define.binding')) {
            return ScadaCompsLibrary[compType].define.binding || {}
          }
        }
        return null
      },
      getCurSelCompBinding() {
        if (this.selComps.length >= 1) {
          return this.getCompCateBinding()
        }
        return null
      },
      openSelDialog() {
        this.deviceBinding = this.compBindings[this.activeTab].binding

        this.selectorVisible = true
      },
      onBindingChange(device) {
        // console.log(device)
        const keys = ['type', 'uid', 'field']
        keys.forEach(key => {
          if (device[key]) {
            this.compBindings[this.activeTab].binding[key] = device[key]
          }
        })
        this.$emit('compBindingChanged', { [this.activeTab]: this.compBindings[this.activeTab].binding })

        if (this.curSelComp.type === 'ScadaLabel') {
          const o = {}

          if (device.unit) {
            _.merge(o, { param: { suffixText: device.unit } })
          }
          if (device.fieldLabel) {
            _.merge(o, { param: { prefixText: device.fieldLabel } })
          }

          if (!_.isEmpty(o)) {
            // console.log(o)
            this.$emit('compOptionsChanged', o)
          }
        }
      },
      onBindingClear() {
        const keys = ['type', 'uid', 'field']
        keys.forEach(key => {
          this.compBindings[this.activeTab].binding[key] = ''
        })
        this.$emit('compBindingChanged', { [this.activeTab]: this.compBindings[this.activeTab].binding })
      },
      // onTabClick() {
      //   this.lastSelTab = this.activeTab
      // }
    },
    computed: {
      compValueBindingCount() {
        return _.keys(this.compBindings).length
      }
    },
    watch: {
      selComps() {
        this.compBindings = this.getCurSelCompBinding()
        if (_.keys(this.compBindings).includes(this.lastSelTab)) {
          this.activeTab = this.lastSelTab
        } else {
          this.activeTab = _.keys(this.compBindings)[0]
          // if (this.activeTab) {
          //   this.lastSelTab = this.activeTab
          // }
        }
      },
      activeTab(val) {
        if (val) {
          if (_.keys(this.compBindings).length > 1) {
            this.lastSelTab = val
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .binding_panel {
    padding: 6px;
    /*background-color: #323537;*/
    .action-list {
      margin-bottom: 6px;
      .el-button {
        letter-spacing: 1px;
        padding: 6px 8px;
      }
      .value-preview {
        float: right;
        display: inline-block;
        width: 80px
      }
      .btn-unbinding {
        padding: 6px 3px 6px 4px;
        /*font-size: 11px;*/
        /*min-height: 25px;*/
      }
    }
    .ctrl-item {
      label {
        margin-top: 3px;
        margin-left: 3px;
      }
      margin-bottom: 4px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
</style>