<template>
  <div id="style_panel">
    <div class="ctrl-item" v-for="(ctrl,key) in styleOptions" :key="key">
      <el-row>
        <el-col :span="8"><label>{{ctrl.label}}</label></el-col>
        <el-col :span="16" class="param-input">
          <component
              :is="getCtrlTyp(ctrl.type)"
              v-model="ctrl.value"
              @change="compValInputChanged"
              show-alpha>
          </component>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StylePanel',
    props: {
      styleOptions: {}
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
          this.$emit('compStyleOptionsChanged')
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  #style_panel {
    padding: 12px;

    .ctrl-item {
      label {
        font-size: 13px;
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