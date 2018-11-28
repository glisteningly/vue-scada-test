<template>
  <button class="img-btn" @click="$emit('click')" :disabled="disabled">
    <img class="btn-icon" :src="imagePath">
  </button>
</template>

<script>
  export default {
    name: 'ImageButton',
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
    padding: 6px 8px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    border: 1px solid #333;
    box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
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
      width: 20px;
      height: 20px;
    }
  }

  .img-btn-group {
    display: flex;
    .img-btn {
      &:nth-of-type(n) {
        border-radius: 0;
        border-right: none;
      }
      &:first-of-type {
        border-right: none;
        border-radius: 4px 0 0 4px;
      }
      &:last-of-type {
        border-right: 1px solid #333;
        border-radius: 0 4px 4px 0;
      }
    }
  }
</style>