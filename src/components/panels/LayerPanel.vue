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
               draggable
               ref="layerTree"
               empty-text="无组件"
               @node-click="handleNodeClick"
               @node-drop="handleDrop"
               :allow-drop="allowDrop"
               :allow-drag="allowDrag">
        <span class="layer-tree-node" slot-scope="{ node, data }">
          <label>{{ data.type}}<span class="comp-text" v-if="data.label"> - {{ data.label }}</span></label>
          <img v-if="data.locked"
               class="locked-icon"
               @click="handleNodeUnlock(data)"
               :src="'./images/icons/ic-comp-locked.png'">
          <!--<span class="locked" v-if="data.locked"></span>-->
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  const _compsRefMap = new WeakMap()

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
      handleNodeClick(data) {
        // console.log(data)
        const comp = _compsRefMap.get(data)
        this.$emit('layerCompClick', comp)
      },
      filterNode(value, data) {
        if (!value) return true
        return (data.type.indexOf(value.trim()) !== -1)
      },
      handleNodeUnlock(data) {
        const compCtrl = _.find(this.treedata, { name: data.name })
        if (compCtrl) {
          compCtrl.locked = false
        }
      },
      allowDrop(draggingNode, dropNode, type) {
        // return type !== 'inner'
        return true
      },
      allowDrag(draggingNode) {
        // return draggingNode.data.label.indexOf('三级 3-2-2') === -1
        return draggingNode.data.draggable
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        // console.log(draggingNode.data.name, dropNode.data.name, dropType)
        const draggingComp = _compsRefMap.get(draggingNode.data)
        const dropComp = _compsRefMap.get(dropNode.data)
        if (draggingComp && dropComp) {
          const dropInfo = { draggingComp, dropComp, dropType }
          console.log(dropInfo)
          this.$emit('layerCompDroped', dropInfo)
        }
      },
    },
    computed: {
      complist() {
        // const compList = []
        const getTree = (comps) => {
          const list = []
          comps.forEach(comp => {
            const c = _.pick(comp, ['name', 'type'])
            _compsRefMap.set(c, comp)
            if (c.type === 'ScadaGroupWrap') {
              c.type = 'ScadaGroup'
            }
            if (comp.type === 'ScadaLabel') {
              c.label = comp.options.param.defaultText || comp.options.param.prefixText || comp.options.param.suffixText || ''
            }
            c.type = c.type.substring(5).toLowerCase()
            c.locked = !!(comp.locked)
            c.draggable = !(comp.isChild)
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
          width: 100%;
          font-size: 13px;
          display: flex;
          flex-direction: row;
          align-items: center;
          label {
            flex: 1;
            overflow: hidden;
            .comp-text {
              color: #999;
            }
          }
          .locked-icon {
            width: 11px;
            height: 11px;
            margin-right: 4px;
          }
          /*.locked {*/
          /*justify-content: flex-end;*/

          /*}*/
        }
        .el-tree-node__content {
          border-bottom: 1px solid #222;
          border-right: 1px solid #222;
          height: 22px;
          cursor: default;
        }
      }
    }

  }

</style>