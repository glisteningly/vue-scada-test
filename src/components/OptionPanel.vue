<template>
  <div class="option_panel">
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
              @change="compValInputChanged"
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
  import OptionDefs from '../utils/styleDefs'
  import { ScadaCompsLibrary } from '../components/Scada'
  import SelCompsUtil from '../mixin/SelCompsUtil'

  export default {
    mixins: [SelCompsUtil],
    name: 'StylePanel',
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
      compValInputChanged() {
        this.$nextTick(() => {
          this.$emit('compOptionsChanged', {
            optionCategory: this.optionCategory,
            options: this.compOptions
          })
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
      // getCompCateOptions() {
      //   if (this.getCompOptions(this.curSelComp)) {
      //     const compStyles = Object.assign({}, this.getCompOptions(this.curSelComp).style)
      //     // console.log(compStyles)
      //     const styleCtrls = {}
      //     for (const key in compStyles) {
      //       styleCtrls[key] = _.has(styleDefs, [this.curSelComp.type, key]) ? {
      //         value: compStyles[key],
      //         label: styleDefs[this.curSelComp.type][key].label,
      //         type: styleDefs[this.curSelComp.type][key].type
      //       } : {
      //         value: compStyles[key],
      //         label: styleDefs.common[key].label,
      //         type: styleDefs.common[key].type
      //       }
      //     }
      //     return styleCtrls
      //   } else {
      //     return null
      //   }
      // },
      getCompDefaultOptions() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            // TODO:
            if (ScadaCompsLibrary[compType].props) {
              return ScadaCompsLibrary[compType].props.defaultOptions.default()
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
      // curSelCompStyleOptions() {
      //   if (this.selComps.length >= 1) {
      //     if (this.selComps.length === 1) {
      //       return this.getCompCateOptions()
      //     } else {
      //       return (this.curSelCompsType) ? this.getCompCateOptions() : null
      //     }
      //   }
      //   return null
      // }
    },
    watch: {
      selComps() {
        this.compOptions = this.getCurSelCompOptions()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .option_panel {
    padding: 12px;

    .type-hint {
      display: inline-block;
      color: #CCC;
      font-size: 13px;
      margin-bottom: 8px;
      background: #2A2A2A;
      padding: 3px 10px 3px 6px;
      border-radius: 12px;
    }

    .ctrl-item {
      label {
        font-size: 14px;
        letter-spacing: 1.5px;
        color: #DDD;
        display: block;
        margin-top: 4px;
      }
      .el-col {
        margin-bottom: 8px;
      }
    }
  }
</style>