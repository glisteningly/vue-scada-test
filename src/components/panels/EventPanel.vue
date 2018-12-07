<template>
  <div class="event_panel ctrl-panel">
    <div v-if="curSelCompsCount > 1 && curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个 {{curSelCompsType}}</span>
    </div>
    <div v-if="curSelCompsCount > 1 && !curSelCompsType">
      <span class="type-hint"><i class="el-icon-info"></i> 已选择 {{curSelCompsCount}} 个不同类型对象</span>
    </div>
    <div class="ctrl-item">
      <el-row>
        <el-col :span="4"><label class="label-bid">ID</label></el-col>
        <el-col :span="10">
          <el-input @change="compBidChanged(compBid)"
                    v-model="compBid"/>
        </el-col>
      </el-row>
    </div>
    <div class="ctrl-item">
      <el-row>
        <el-col :span="4"><label class="label-bid">发送</label></el-col>
        <el-col :span="20">
          <el-input type="textarea"
                    :rows="2"
                    v-model="compEventMsg"
                    @change="compEventMsgChanged(compEventMsg)"
                    placeholder="消息文本"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  // import _ from 'lodash'

  import SelCompsUtil from '../../mixin/SelCompsUtil'

  export default {
    mixins: [SelCompsUtil],
    name: 'OptionPanel',
    data() {
      return {
        compBid: null,
        compEventMsg: '',
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
      compBidChanged(v) {
        this.$emit('compBidChanged', { bid: v })
      },
      compEventMsgChanged(v) {
        this.$emit('compEventMsgChanged', { eventMsg: v })
      },
      getCurSelCompBid() {
        return this.curSelComp ? (this.curSelComp.bid || '') : ''
      },
      getCurSelCompEventMsg() {
        return this.curSelComp ? (this.curSelComp.eventMsg || '') : ''
      }
    },
    computed: {},
    watch: {
      selComps() {
        this.compBid = this.getCurSelCompBid()
        this.compEventMsg = this.getCurSelCompEventMsg()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .event_panel {
    padding: 8px 8px 2px 12px;

    .ctrl-item {
      margin-bottom: 6px;
      label {
        margin-top: 3px;
      }
    }
  }
</style>