<template>
  <button class="img-btn" @click="$emit('click')" :disabled="disabled">
    <img class="btn-icon" :src="imagePath">
  </button>
</template>

<script>
  export default {
    name: 'StylePanel',
    props: {
      disabled: false,
      icon: ''
    },
    methods: {},
    computed: {
      imagePath() {
        return `/images/icons/${this.icon}.png`
        // return `/images/icons-svg/${this.icon}.svg`
      }
    }
  }
</script>

<style lang="scss">
  .img-btn {
    outline: none;
    display: flex;
    padding: 5px 8px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    border: 1px solid #333;
    &:disabled {
      img {
        filter: grayscale(100%) opacity(30%);
      }
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
    img.btn-icon {
      width: 24px;
      height: 24px;
    }
  }
</style>