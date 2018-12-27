<template>
  <div id="layer_panel">
    <div id="comps_tree">
      <div class="search">
        <el-input
            placeholder="搜索类型"
            size="mini"
            v-model="filterStr">
        </el-input>
      </div>
      <el-tree :data="complist"
               node-key="name"
               :current-node-key="curNode"
               :highlight-current="true"
               :props="defaultProps"
               :filter-node-method="filterNode"
               :expand-on-click-node="false"
               ref="layerTree"
               empty-text="无组件"
               @node-click="handleNodeClick">
        <span class="layer-tree-node" slot-scope="{ node, data }">
          <span>{{ data.type}}</span>
          <label v-if="data.locked"> o</label>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'LayerPanel',
    props: ['treedata', 'curNode'],
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'type'
        },
        filterStr: ''
      }
    },
    methods: {
      handleNodeClick(data, node) {
        console.log(data)
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.type.indexOf(value.trim()) !== -1)
      }
    },
    computed: {
      complist() {
        // const compList = []
        const getTree = (comps) => {
          const list = []
          comps.forEach(comp => {
            const c = _.pick(comp, ['name', 'type'])
            if (c.type === 'ScadaGroupWrap') {
              c.type = 'ScadaGroup'
            }
            c.type = c.type.substring(5).toLowerCase()
            c.locked = !!(comp.locked)
            if (comp.children) {
              c.children = getTree(comp.children)
            }
            list.unshift(c)
          })
          return list
        }

        return getTree(this.treedata)
      }
    },
    watch: {
      filterStr(val) {
        this.$refs.layerTree.filter(val)
      },
      curNode(val) {
        this.$refs.layerTree.setCurrentKey(val)
      }
    }
  }
</script>

<style lang="scss">
  @import "../../styles/mixin";

  #layer_panel {
    height: 100%;
    /*padding: 6px;*/
    display: flex;
    flex-direction: column;
    #comps_tree {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 6px;
      .el-tree {
        flex: 1;
        overflow-y: auto;
        border: 1px solid #222;
        @include scrollBar;
        margin-top: 6px;
        .layer-tree-node {
          font-size: 12px;
        }
        .el-tree-node__content {
          border-bottom: 1px solid #222;
          height: 22px;
        }
      }
    }

  }

</style>