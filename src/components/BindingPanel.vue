<template>
  <div class="binding_panel ctrl-panel">
    <div v-if="curSelCompsCount > 1 && curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个 {{curSelCompsType}}</span>
    </div>
    <div v-if="curSelCompsCount > 1 && !curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个不同类型对象</span>
    </div>
    <div class="ctrl-item" v-for="(ctrl,key) in compBindings" :key="key">
      <el-row>
        <el-col :span="8"><label>{{ctrl.label}}</label></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import OptionDefs from '../utils/optionDefs'
  import { ScadaCompsLibrary } from '../components/Scada'
  import SelCompsUtil from '../mixin/SelCompsUtil'

  export default {
    mixins: [SelCompsUtil],
    name: 'BindingPanel',
    data() {
      return {
        compBindings: {}
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
      getCtrlTyp(type) {
        switch (type) {
          case 'Color' :
            return 'el-color-picker'
          case 'Number':
            return 'el-input'
          case 'Int':
            return 'el-input-number'
          case 'Enum':
            return 'el-select'
          case 'Boolean':
            return 'el-switch'
          default:
            return 'el-input'
        }
      },
      compValInputChanged() {
        this.$nextTick(() => {
          this.$emit('compOptionsChanged', {
            optionCategory: this.optionCategory,
            options: this.compOptions
          })
        })
      },
      getCompCateBinding() {
        console.log(this.getCompDefaultValue())
        console.log(this.getCompBindingDefine())
        // return this.getCompDefaultValue()

        const compBindings = this.getCompDefaultValue()

        const compDefine = this.getCompBindingDefine()
        const bindingCtrls = {}
        for (const key in compBindings) {
          const ctrl = _.has(compDefine, key) ? {
            binding: { t: '', u: '', f: '' },
            label: compDefine[key].label,
          } : {
            binding: { t: '', u: '', f: '' },
            label: OptionDefs.binding[key].label,
          }

          bindingCtrls[key] = Object.assign({}, ctrl)

        }
        return bindingCtrls
      },
      getCompDefaultValue() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            if (_.has(ScadaCompsLibrary[compType], ['props', 'defaultOptions'])) {
              return ScadaCompsLibrary[compType].props.defaultValue.default() || {}
            }
          }
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
          // console.log('-------def-------')
          // console.log(this.getCompOptionsDefine())

          if (this.selComps.length === 1) {
            return this.getCompCateBinding()
          } else {
            return (this.curSelCompsType) ? this.getCompCateBinding() : null
          }
        }
        return null
      }
    },
    computed: {},
    watch: {
      selComps() {
        this.compBindings = this.getCurSelCompBinding()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .binding_panel {

  }
</style>