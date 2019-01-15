<template>
  <section class="help-dialog">
    <el-dialog
        title="帮 助"
        :visible.sync="dialogVisible"
        @close="$emit('dialogClose')"
        width="60%">
      <div class="help-content">
        <h3>快捷操作</h3>
        <h4>界面操作</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <ul class="hotkey-list">
              <li><span>F1</span><label>帮助</label></li>
              <li><span>F9</span><label>预览 / 关闭预览</label></li>
              <li><span>Ctrl</span>+<span>Z</span><label>撤销</label></li>
              <li><span>Ctrl</span>+<span>Shift</span>+<span>Z</span><label>重做</label></li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="hotkey-list">
              <li><span>Esc</span><label>关闭预览 / 关闭当前工具</label></li>
              <li><span>Ctrl</span>+<span>S</span><label>保存当前文档</label></li>
              <li><span>F10</span><label>发布当前文档</label></li>
              <li><span>Ctrl</span>+<span>Alt</span>+<span>F</span><label>工作区最大化 / 恢复</label></li>
            </ul>
          </el-col>
        </el-row>
        <h4>画布操作</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <ul class="hotkey-list">
              <li><i class="icon ic-scroll"></i><label>垂直方向滚动画布</label></li>
              <li><span>Shift</span>+<i class="icon ic-scroll"></i><label>水平方向滚动画布</label></li>
              <li><span>空 格</span>+<i class="icon ic-dragmove"></i><label>拖拽移动画布</label></li>
              <li><span>Ctrl</span>+<i class="icon ic-scroll"></i><label>以鼠标位置为原点缩放画布</label></li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="hotkey-list">
              <li><span>Ctrl</span>+<span>=</span><label>放大画布</label></li>
              <li><span>Ctrl</span>+<span>-</span><label>缩小画布</label></li>
              <li><span>Ctrl</span>+<span>9</span><label>显示画布原始尺寸</label></li>
              <li><span>Ctrl</span>+<span>0</span><label>画布尺寸适合窗口</label></li>
            </ul>
          </el-col>
        </el-row>
        <h4>组件操作</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <ul class="hotkey-list">
              <li><span>↑</span>,<span>↓</span>,<span>←</span>,<span>→</span><label>移动选中组件 1px</label></li>
              <li><span>Shift</span>+<span>↑</span>,<span>↓</span>,<span>←</span>,<span>→</span><label>移动选中组件
                10px</label>
              </li>
              <li><span>Ctrl</span>+<span>C</span><label>复制选中组件</label></li>
              <li><span>Ctrl</span>+<span>V</span><label>粘贴组件</label></li>
              <li><span>Ctrl</span>+<span>L</span><label>锁定选中组件</label></li>
              <li><span>Ctrl</span>+<span>Shift</span>+<span>L</span><label>解除选中组件锁定</label></li>
              <li><span>Ctrl</span>+<span>G</span><label>多选组件成组</label></li>
              <li><span>Ctrl</span>+<span>Shift</span>+<span>G</span><label>选中成组组件拆组</label></li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="hotkey-list">
              <li><span>Ctrl</span>+<span>]</span><label>组件上移一层</label></li>
              <li><span>Ctrl</span>+<span>[</span><label>组件下移一层</label></li>
              <li><span>Ctrl</span>+<span>Shift</span>+<span>]</span><label>组件移至顶层</label></li>
              <li><span>Ctrl</span>+<span>Shift</span>+<span>[</span><label>组件移至底层</label></li>
              <li><span>Shift</span>+<i class="icon ic-dragmove"></i><label>水平/垂直方向锁定移动</label></li>
              <li><span>Alt</span>+<i class="icon ic-dragmove"></i><label>移动组件并复制</label></li>
              <li><span>Shift</span>+<i class="icon ic-resize"></i><label>组件保持比例缩放</label></li>
              <li><span>Alt</span>+<i class="icon ic-resize"></i><label>组件以中心点缩放</label></li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="version">版本: {{ appVersion}}</span>
        <el-button @click="openHelpDoc">帮助文档</el-button>
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
  import { appVersion } from '../../package.json'

  export default {
    name: 'HelpDialog',
    props: {
      isShowDialog: false,
    },
    data() {
      return {
        dialogVisible: false,
        appVersion: appVersion
      }
    },
    methods: {
      openHelpDoc() {
        window.open('./doc', '_blank')
      }
    },
    watch: {
      isShowDialog() {
        this.dialogVisible = this.isShowDialog
      }
    },
  }
</script>
<style lang="scss">
  @import "../styles/mixin";

  .help-dialog {
    .el-dialog__body {
      padding: 8px 12px;
    }
  }

  .help-content {
    @include scrollBar;
    overflow-y: auto;
    overflow-x: hidden;
    height: 60vh;
    background-color: #363636;
    padding: 12px 8px;
    border: 1px solid #2B2B2B;
    h3 {
      padding: 0 0 0 4px;
      line-height: 16px;
      margin: 0;
      font-size: 16px;
      color: #DDDDDD;
      font-weight: normal;
      letter-spacing: 1px;
      border-left: 4px solid #20a0ff;
    }
    h4 {
      font-size: 14px;
      font-weight: normal;
      padding: 0 4px;
      margin: 12px 0 0 0;
      color: #BBB;
    }
    .hotkey-list {
      padding: 6px 0;
      li {
        color: #DDD;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        span {
          font-size: 12px;
          margin: 0 5px;
          text-align: center;
          display: inline-block;
          min-width: 10px;
          background: #222;
          padding: 3px 8px;
          border: 1px solid #666;
          border-radius: 4px;
          box-shadow: 1px 1px 5px #111;
        }
        label {
          margin-left: 20px;
        }
        i.icon {
          margin: 0 6px;
          display: inline-block;
          width: 20px;
          height: 20px;
          background-size: cover;
          &.ic-dragmove {
            background-image: url("../assets/icons/ic-drag-move.png");
          }
          &.ic-resize {
            background-image: url("../assets/icons/ic-drag-resize.png");
          }
          &.ic-scroll {
            background-image: url("../assets/icons/ic-mouse-scroll.png");
          }
        }
      }
    }
  }

  .version {
    float: left;
    color: #DDDDDD;
    font-size: 14px;
    line-height: 32px;
  }

</style>
