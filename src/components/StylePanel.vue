<template>
  <div id="style_panel">
    <div v-if="curSelCompsCount > 1 && curSelCompStyleOptions">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个 {{curSelCompsType}}</span>
    </div>
    <div v-if="curSelCompsCount > 1 && !curSelCompStyleOptions">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个不同类型对象</span>
    </div>
    <div class="ctrl-item" v-for="(ctrl,key) in styleOptions" :key="key">
      <el-row>
        <el-col :span="8"><label>{{ctrl.label}}</label></el-col>
        <el-col :span="16" class="param-input">
          <component
              :is="getCtrlTyp(ctrl.type)"
              v-model="ctrl.value"
              @change="compValInputChanged"
              controls-position="right"
              show-alpha>
          </component>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import styleDefs from '../utils/styleDefs'
  import { ScadaCompsLibrary } from '../components/Scada'

  export default {
    name: 'StylePanel',
    data() {
      return {
        styleOptions: {}
      }
    },
    props: {
      // styleOptions: {},
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
          this.$emit('compStyleOptionsChanged', this.styleOptions)
        })
      },
      getCompStyleOptions() {
        if (this.getCompOptions(this.curSelComp)) {
          const compStyles = Object.assign({}, this.getCompOptions(this.curSelComp).style)
          // console.log(compStyles)
          const styleCtrls = {}
          for (const key in compStyles) {
            styleCtrls[key] = {
              value: compStyles[key],
              label: styleDefs[key].label,
              type: styleDefs[key].type
            }
          }
          return styleCtrls
        } else {
          return null
        }
      },
      getCompDefaultOptions() {
        if (this.curSelComp) {
          const compType = this.curSelComp.type
          if (ScadaCompsLibrary[compType]) {
            if (ScadaCompsLibrary[compType].props) {
              return ScadaCompsLibrary[compType].props.defaultOptions.default()
            }
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
      getCurSelCompStyleOptions() {
        if (this.selComps.length >= 1) {
          if (this.selComps.length === 1) {
            return this.getCompStyleOptions()
          } else {
            return (this.curSelCompsType) ? this.getCompStyleOptions() : null
          }
        }
        return null
      }
    },
    computed: {
      curSelComp() {
        if (this.selComps.length >= 1) {
          return this.selComps[0]
        } else {
          return null
        }
      },
      curSelCompsCount() {
        return this.selComps.length
      },
      curSelCompsType() {
        if (this.selComps.length > 1) {
          const compType = this.selComps[0].type
          let _isSameType = true
          for (let i = 0; i < this.selComps.length; i++) {
            _isSameType = (this.selComps[i].type === compType)
            if (!_isSameType) {
              break
            }
          }
          if (_isSameType) {
            return compType
          }
        }
        return null
      },
      curSelCompStyleOptions() {
        if (this.selComps.length >= 1) {
          if (this.selComps.length === 1) {
            return this.getCompStyleOptions()
          } else {
            return (this.curSelCompsType) ? this.getCompStyleOptions() : null
          }
        }
        return null
      }
    },
    watch: {
      selComps() {
        // console.log('111')
        this.styleOptions = this.getCurSelCompStyleOptions()
      }
    }
  }
</script>

<style lang="scss" scoped>
  #style_panel {
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