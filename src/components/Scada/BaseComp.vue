<script>
  import _ from 'lodash'

  export default {
    name: 'BaseComp',
    props: {
      bindingValue: {
        type: Object
      },
      comp: Object,
      defaultOptions: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    computed: {
      options() {
        return _.defaultsDeep({}, this.comp.options, this.defaultOptions)
      },
      values() {
        return _.defaultsDeep({}, this.bindingValue, this.defaultValue)
      },
      rectTransformStr() {
        return `translate(${this.comp.x - this.comp.offsetX * this.comp.scaleX} ${this.comp.y - this.comp.offsetY * this.comp.scaleY})
            rotate(${this.comp.rotation} ${this.comp.offsetX * this.comp.scaleX} ${this.comp.offsetY * this.comp.scaleY})`
      },
      alarmClass() {
        if (this.values.alarm && this.values.alarm !== 0) {
          return 'alarm'
        } else
          return null
      },
      hoverClass() {
        if (this.eventBinded) {
          return 'scada-comp'
        } else {
          return null
        }
      },
      eventBinded() {
        return (this.comp.bid || this.comp.eventMsg || !_.isEmpty(this.comp.binding))
      }
    },
    methods: {
      getEventPayload() {
        return {
          type: this.comp.type,
          id: this.comp.bid || null,
          msg: this.comp.eventMsg || '',
          binding: this.comp.binding || {}
        }
      },
      onCompClicked() {
        if (this.$events && this.eventBinded) {
          this.$events.emit('CompClick', this.getEventPayload())
        }
      },
      onCompMouseOver(e) {
        // const rect = e.target.getBoundingClientRect()
        // const el = document.getElementById('dianji')
        // console.log(el)
        // el.style.left = rect.left + rect.width + 10 + "px"
        // el.style.top = rect.top + rect.height / 2 - 10 + "px"

        // console.log(e)
        const payload = this.getEventPayload()
        Object.assign(payload, {
          targetRect: e.target.getBoundingClientRect()
        })
        // console.log(payload)
        if (this.$events && this.eventBinded) {
          this.$events.emit('CompHover', payload)
        }
      },
      onCompMouseOut() {
        if (this.$events && this.eventBinded) {
          this.$events.emit('CompMouseOut', this.getEventPayload())
        }
      }
    }
  }
</script>

<style lang="scss">
  .scada-comp {
    &:hover {
      cursor: pointer;
      .scada-cover {
        &:hover {
          fill: rgba(255, 255, 255, 0.1);
          /*stroke: rgba(32, 160, 255, 0.2);*/
        }
      }
    }
  }

</style>