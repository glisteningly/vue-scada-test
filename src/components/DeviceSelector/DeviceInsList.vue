<template>
  <div class="device-instance-list-root ">
    <div class="header">
      <div class="title">
        实 例
      </div>
      <div class="search">
        <el-input
            placeholder="搜索实例"
            size="mini"
            v-model="filterStr">
        </el-input>
      </div>
    </div>
    <div class="list-container">
      <div class="device-instance-item header">
        <span>名称</span>
        <span>位置</span>
      </div>
      <div class="device-instance-item item"
           v-for="(item, index) in instanceList" :key="index"
           :title="item.label"
           :class="{ active: item.uid === activeIns }"
           @click="select(item, index)">
        <span class="ins-label">
          <label v-if="item.state === '在线'" class="state-on">● </label>
          <label v-else class="state-off">● </label>
          {{item.label}}
        </span>
        <span class="ins-location">{{item.location}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { DeviceTypeService } from 'service-module-api'
  import utils from '../../utils'

  const DeviceType = DeviceTypeService.DeviceType

  export default {
    props: ['type', 'uid'],
    data() {
      return {
        filterStr: '',
        instanceList: [],
        allInstanceList: [],
        activeIns: this.uid
      }
    },
    mounted() {
      if (this.type) {
        this.updateInstanceList(this.type)
      }
    },
    methods: {
      updateInstanceList(type) {
        DeviceType.getDeviceInstances({ type }).then(ins => {
          this.allInstanceList = ins.data
          this.filterIns(this.filterStr)
          this.$emit('instanceCountChange', this.allInstanceList.length)

          this.$nextTick(() => {
            const devTree = document.getElementsByClassName('device-selector-root')[0]
            const curItemDom = devTree.getElementsByClassName('device-instance-item item active')
            if (curItemDom && curItemDom.length > 0) {
              utils.scrollElementToshow(curItemDom[0])
            }
          })
        })
      },
      filterIns(str) {
        this.instanceList = this.allInstanceList.filter(item => {
          const location = item.location || ''
          return item.label.indexOf(str.trim()) > -1 || location.indexOf(str.trim()) > -1
        })
      },
      select(item, index) {
        this.activeIns = item.uid
        this.$emit('change', item)
      },
    },
    watch: {
      filterStr(val) {
        this.filterIns(val)
      },
      type(val) {
        if (val) {
          this.updateInstanceList(val)
        }
      },
      uid(val) {
        this.activeIns = val
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .device-instance-list-root {
    height: 100%;
    display: flex;
    flex-flow: column;
    background: #333;
    border: 1px solid #666;
    flex: auto;
    color: #DDD;

    .header {
      .search {
        padding: 6px;
        .el-input {
          border-radius: 15%;
        }
      }
    }

    .list-container {
      @include scrollBar;
      flex: 1;
      /*display: flex;*/
      flex-flow: column;
      overflow-y: auto;

      .device-instance-item {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        padding: 6px 8px;
        .ins-label {
          display: flex;
          align-items: center;
          font-size: 14px;
          label {
            font-size: 12px;
            margin-right: 3px;
          }
          .state-on {
            color: #5ba804;
          }
          .state-off {
            color: #a7001b;
          }
        }
      }

      .header {
        background: #555;
        border-top: 1px solid #222;
        border-bottom: 1px solid #222;
      }

      .item:hover {
        background-color: rgba(39, 176, 255, 0.08);
        cursor: pointer;
      }

      .active {
        background-color: rgba(39, 176, 255, 0.2);
        &:hover {
          background-color: rgba(39, 176, 255, 0.2);
        }
      }
    }
  }
</style>