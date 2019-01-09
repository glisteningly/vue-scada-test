<template>
  <div class="device-type-list-root">
    <div class="header">
      <div class="title">
        类 型
      </div>
      <div class="search">
        <el-input
            placeholder="搜索类型"
            size="mini"
            v-model="filterStr">
        </el-input>
      </div>
    </div>
    <el-tree
        class="device-type-tree binding-panel"
        :data="treedata"
        node-key="name"
        :highlight-current="true"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultKeys"
        :current-node-key="type"
        @current-change="changeType"
        ref="typeTree">
            <span class="custom-tree-node" slot-scope="{ node, data }"
                  :title="`${node.label} ${data.name}`"
                  :class="{ active: data.name === activeNode.name }">
                <span>{{ node.label}}</span>
                <label v-if="(showTypeName && (node.label !== data.name))">{{ data.name }}</label>
            </span>
    </el-tree>
  </div>
</template>
<script>
  export default {
    name: 'DeviceTypeList',
    props: {
      type: {
        type: String,
        default: ''
      },
      treedata: {
        type: Array,
        default: function () {
          return []
        }
      },
      showTypeName: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        filterStr: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        activeNode: this.type ? { name: this.type } : {},
        defaultKeys: this.type ? [this.type] : []
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return (data.label.indexOf(value.trim()) !== -1) || (data.name.indexOf(value.trim()) !== -1);
      },
      changeType(nodeData) {
        this.activeNode = nodeData
        this.$emit('change', nodeData.data)
      }
    },
    mounted() {
    },
    watch: {
      filterStr(val) {
        this.$refs.typeTree.filter(val)
      },
      type(val) {
        console.log(val)
        this.activeNode = val ? { name: val } : {}
        this.defaultKeys = val ? [val] : []
        this.$refs.typeTree.setCurrentKey(val)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../styles/mixin";

  .device-type-list-root {
    border: 1px solid #666;
    border-right: none;
    display: flex;
    font-size: 14px;
    flex-flow: column;
    .header {
      .search {
        padding: 6px;
        .el-input {
          border-radius: 15%;
        }
      }
    }

    .device-type-tree {
      @include scrollBar;
      flex: 1;
      overflow-y: auto;

      .custom-tree-node {
        width: 100%;
        padding: 3px 8px;
        span {
          letter-spacing: 1px;
          color: #DDD;
        }
        label {
          margin-left: 8px;
          color: #888;
        }
      }

      /*.active {*/
      /*background-color: rgba(39, 176, 255, 0.2);*/
      /*}*/
    }
  }
</style>