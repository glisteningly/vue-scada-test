<template>
  <section>
    <el-dialog
        title="文档设置"
        :visible.sync="dialogVisible"
        @close="$emit('dialogClose')"
        @open="loadConfig"
        width="40%">
      <div class="setting-item">
        <label class="setting-title">画布设置</label>
        <div class="setting-content">
          <label>宽度: </label>
          <el-input-number :controls=false :max="10000" v-model="canvasConfig.width"
                           style="float: left"></el-input-number>
          <label>高度: </label>
          <el-input-number :controls=false :max="10000" v-model="canvasConfig.height"
                           style="float: left"></el-input-number>
          <label>背景色: </label>
          <el-color-picker size="small" v-model="canvasConfig.bgColor"/>
        </div>
        <!--<div class="setting-content">-->
          <!--<label>附加样式: </label>-->
          <!--<el-input v-model="canvasConfig.affixStyle" type="textarea" :rows="3"/>-->
        <!--</div>-->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeSettings">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
  export default {
    props: {
      isShowDialog: false,
      config: null
    },
    data() {
      return {
        dialogVisible: false,
        canvasConfig: {
          // name: '未命名文档',
          // queryType: 'realtime',
          // queryInterval: 60,
          width: 1000,
          height: 600,
          bgColor: '#FFF',
          // showGrid: true,
          // zoom: 1,
          // affixStyle: ''
        }
      }
    },
    watch: {
      isShowDialog() {
        this.dialogVisible = this.isShowDialog
      }
//      config() {
//        this.canvasConfig = Object.assign({}, this.config)
//      }
    },
    methods: {
      loadConfig() {
        this.canvasConfig = Object.assign({}, this.config)
      },
      changeSettings() {
        this.dialogVisible = false
        this.$emit('settingsChanged', this.canvasConfig)
      }
    }
  }
</script>
<style lang="scss">

  .setting-item {
    color: #DDD;
    .setting-title {
      display: block;
      margin-bottom: 10px;
      background: #2B2B2B;
      color: #DDD;
      padding: 4px 0 4px 6px
    }
    .el-input-number {
      margin-right: 30px;
      input {
        max-width: 70px;
      }
    }
    .setting-content {
      padding-left: 6px;
      margin-bottom: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      label {
        display: block;
        margin: 4px 8px 4px 0;
      }
      .el-switch {
        margin: 4px 0 0 4px
      }
    }
    .el-color-picker--small .el-color-picker__trigger {
      width: 60px !important;
      border: none;
    }
  }
</style>
