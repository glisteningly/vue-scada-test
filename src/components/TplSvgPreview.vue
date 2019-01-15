<template>
  <div class="tpl-preview">
    <svg class="tpl-preview-svg" :viewBox="getViewBox(config)">
      <component :is="config.type"
                 :comp="getTplPreview(config)"/>
    </svg>
    <div class="tpl-preview-cover"></div>
  </div>
</template>

<script>
  import CompCtrl from '../class/CompCtrl'

  export default {
    name: 'TplSvgPreview',
    props: ['config'],
    data() {
      return {}
    },
    methods: {
      getViewBox(config) {
        return `0 0 ${config.layout.width * config.layout.scaleX} ${config.layout.height * config.layout.scaleY}`
      },
      getTplPreview(config) {
        if (config) {
          return new CompCtrl(config, false)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .tpl-preview {
    position: relative;
    width: 100%;
    height: 100%;
    .tpl-preview-svg {
      position: absolute;
      margin: 5%;
      width: 90%;
      height: 90%;
    }
    .tpl-preview-cover {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
</style>