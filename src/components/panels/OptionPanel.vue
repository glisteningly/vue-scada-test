<template>
  <div class="option_panel ctrl-panel">
    <div v-if="curSelCompsCount > 1 && curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个 {{curSelCompsType}}</span>
    </div>
    <div v-if="curSelCompsCount > 1 && !curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个不同类型对象</span>
    </div>
    <div class="ctrl-item" v-for="(ctrl,key) in compOptions" :key="key">
      <el-row>
        <el-col :span="8"><label>{{ctrl.label}}</label></el-col>
        <el-col :span="14" class="param-input">
          <component
              :is="getCtrlTyp(ctrl.type)"
              v-model="ctrl.value"
              @change="compValInputChanged(ctrl.value, key)"
              controls-position="right"
              :min="0"
              show-alpha>
            <el-option v-if="ctrl.type === 'Enum'"
                       v-for="item in ctrl.opts"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </component>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import OptionDefs from '../../const/optionDefs'
  import { ScadaCompsLibrary } from '../Scada/index'
  import SelCompsUtil from '../../mixin/SelCompsUtil'

  export default {
    mixins: [SelCompsUtil],
    name: 'OptionPanel',
    data() {
      return {
        compOptions: {}
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
      compValInputChanged(val, key) {
        // this.$emit('compOptionsChanged', {
        //   optionCategory: this.optionCategory,
        //   options: this.compOptions
        // })
        this.$emit('compOptionsChanged', {
          [this.optionCategory]: { [key]: val }
        })
      },
      getCompCateOptions() {
        if (this.getCompOptions(this.curSelComp)) {
          const compOpts = Object.assign({}, this.getCompOptions(this.curSelComp)[this.optionCategory] || {})
          const compDefine = Object.assign({}, this.getCompOptionsDefine()[this.optionCategory] || {})
          // console.log(compStyles)
          const optionCtrls = {}
          for (const key in compOpts) {
            const ctrl = _.has(compDefine, key) ? {
              value: compOpts[key],
              label: compDefine[key].label,
              type: compDefine[key].type
            } : {
              value: compOpts[key],
              label: OptionDefs[this.optionCategory][key].label,
              type: OptionDefs[this.optionCategory][key].type
            }

            if (_.has(compDefine, key)) {
              optionCtrls[key] = Object.assign({}, compDefine[key], ctrl)
            } else {
              optionCtrls[key] = Object.assign({}, ctrl)
            }
          }
          return optionCtrls
        } else {
          return null
        }
      },
      getCompDefaultOptions() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            // TODO:
            // if (ScadaCompsLibrary[compType].props) {
            //   return ScadaCompsLibrary[compType].props.defaultOptions.default() || {}
            // }
            if (_.has(ScadaCompsLibrary[compType], ['props', 'defaultOptions'])) {
              return ScadaCompsLibrary[compType].props.defaultOptions.default() || {}
            }
            // console.log(ScadaCompsLibrary[compType].defaultOptions)
            // return ScadaCompsLibrary[compType].defaultOptions || {}
          }
        }
        return null
      },
      getCompOptionsDefine() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            // if (ScadaCompsLibrary[compType].props) {
            //   return ScadaCompsLibrary[compType].props.define || {}
            // }
            return ScadaCompsLibrary[compType].define || {}
          }
        }
        return null
      },
      getCompOptions(comp) {
        if (comp) {
          return _.merge({}, this.getCompDefaultOptions(), comp.options)
        }
        return null
      },
      getCurSelCompOptions() {
        if (this.selComps.length >= 1) {
          // console.log('-------def-------')
          // console.log(this.getCompOptionsDefine())

          if (this.selComps.length === 1) {
            return this.getCompCateOptions()
          } else {
            return (this.curSelCompsType) ? this.getCompCateOptions() : null
          }
        }
        return null
      }
    },
    computed: {
      curSelCompOptions() {
        return this.curSelComp ? this.curSelComp.options : null
      }
    },
    watch: {
      selComps() {
        this.compOptions = this.getCurSelCompOptions()
      },
      curSelCompOptions: {
        handler() {
          this.compOptions = this.getCurSelCompOptions()
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .option_panel {
    padding: 8px 8px 2px 12px;

    .ctrl-item {
      margin-bottom: 6px;
      label {
        margin-top: 3px;
      }
      .param-input {
        min-height: 28px;
      }
    }
  }
</style>