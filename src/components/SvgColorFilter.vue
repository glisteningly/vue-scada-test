<template>
  <defs>
    <filter id="filter-red-overlay">
      <feColorMatrix type="matrix" :values="redMatrixVal"/>
    </filter>
    <filter id="filter-orange-overlay">
      <feColorMatrix type="matrix" :values="orangeMatrixVal"/>
    </filter>
  </defs>
</template>

<script>
  const RED_MATRIX = '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'
  const ORANGE_MATRIX = '1 0 0 0 0 0 0.6 0 0 0 0 0 0 0 0 0 0 0 1 0'

  export default {
    name: 'SvgColorFilter',
    props: {
      blink: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isAlarmShow: true
      }
    },
    computed: {
      redMatrixVal() {
        return this.isAlarmShow ? RED_MATRIX : ''
      },
      orangeMatrixVal() {
        return this.isAlarmShow ? ORANGE_MATRIX : ''
      }
    },
    mounted() {
      if (this.blink) {
        setInterval(() => {
          this.isAlarmShow = !this.isAlarmShow
        }, 1000)
      }
    }
  }
</script>