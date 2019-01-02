<template>
  <div class="device-attr-list-root">
    <div class="header">
      <div class="title">
        属 性
      </div>
    </div>
    <div class="list-contaienr">
      <div class="attr-item" v-for="(item, index) in attrs" :key="index"
           :class="{ active: item.name === activeAttr }"
           @click="select(item, index)">
        <span>{{item.label}}</span>
        <label v-if="item.label !== item.name">{{item.name}}</label>
      </div>
    </div>
  </div>
</template>
<script>
  import { DeviceTypeService } from 'service-module-api'

  const DeviceType = DeviceTypeService.DeviceType

  export default {
    props: ['type', 'attr'],
    data() {
      return {
        activeAttr: this.attr,
        attrs: []
      }
    },
    mounted() {
      if (this.type) {
        this.updateAttrs(this.type)
      }
    },
    methods: {
      select(item, index) {
        this.activeAttr = item.name
        this.$emit('change', item)
      },
      updateAttrs(type) {
        DeviceType.getDeviceFields(type).then(fields => {
          this.attrs = fields.slice(8)
          // this.attrs = fields
        })
      }
    },
    watch: {
      type(val) {
        if (val) {
          this.updateAttrs(val)
        }
      },
      attr(val) {
        this.activeAttr = val
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../styles/mixin";

  .device-attr-list-root {
    display: flex;
    flex-flow: column;
    border: 1px solid #666;
    border-left: none;

    .list-contaienr {
      @include scrollBar;
      flex: 1;
      display: flex;
      flex-flow: column;
      overflow-y: auto;

      .attr-item {
        padding: 6px 8px;
        cursor: pointer;
        span {
          letter-spacing: 1px;
          color: #EEE;
        }
        label {
          margin-left: 8px;
          color: #888;
        }
      }

      .attr-item:hover {
        background-color: rgba(39, 176, 255, 0.08);
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