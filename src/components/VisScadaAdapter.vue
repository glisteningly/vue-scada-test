<template>
  <component :is="scadaView" :value="bindData"></component>
</template>

<script>
  import SvgColorFilter from './SvgColorFilter'

  import ScadaVueTpl from '../utils/scadaVueTpl'
  import { BaseService } from 'as-utils'

  export default {
    components: { SvgColorFilter },
    name: 'VisScadaAdapter',
    props: {
      config: null,
      extraConfig: null,
      isPreviewMode: false,
    },
    data() {
      return {
        scadaView: null,
        bindData: null,
        sqlList: [],
        bindList: [],
        topicList: [],
        topicMap: {},
        lastMqttMsg: '',
      }
    },
    methods: {
      initMappingData() {
        const queryConfig = ScadaVueTpl.getQueryConfig(this.config.comps)
        this.bindData = ScadaVueTpl.generateMappingObj(queryConfig)
      },

      initScadaView() {
        const tpl = ScadaVueTpl.getTplStr(this.config, this.isPreviewMode)

        this.scadaView = {
          name: 'scadaSvg',
          // extends: BaseScadaView,
          template: tpl,
          props: {
            value: {
              type: Object
            }
          }
        }
      },

      initSqlList() {
        const queryConfig = ScadaVueTpl.getQueryConfig(this.config.comps)
        this.sqlList = ScadaVueTpl.generateQuerySqlList(queryConfig)
        this.bindList = ScadaVueTpl.generateBindingList(queryConfig)
      },

      queryData() {
        BaseService({
          baseURL: '/api/queryengine/batch_query',
          method: 'post',
          data: this.sqlList
        }).then(response => {
          response.forEach((res, index) => {
            // 初始化数据绑定
            const initData = {}
            for (const df in res.data) {
              initData[df] = res.data[df][res.data[df].length - 1]
            }
            const dataSource = this.bindList[index].dataSource
            const dataWhere = this.bindList[index].dataWhere
            if (dataSource) {
              if (dataWhere !== '') {
                Object.assign(this.bindData[dataSource], { [dataWhere]: initData })
              } else {
                Object.assign(this.bindData[dataSource], initData)
              }
            }
            // 订阅列表和订阅列表数据Map
            // if (this.queryType === 'realtime') {
            this.topicList.push(res.topic)
            Object.assign(this.topicMap, { [res.topic]: this.bindList[index] })
            // console.log(index)
            if (this.$mqtt) {
              this.$mqtt.subscribe('+' + res.topic)
            }
            // }
          })
        })
      },
    },
    mqtt: {
      '+/report/+'(message, topic) {
        const msgStr = message.toString()
        console.log(topic + ' : ' + msgStr)
        if (msgStr === this.lastMqttMsg) {
          return
        }
        this.lastMqttMsg = msgStr
        // console.log(topic + ' : ' + msgStr)
        if (this.topicList.indexOf(topic) >= 0) {
          const data = JSON.parse(message.toString())
          if (data) {
            const dataSource = this.topicMap[topic].dataSource
            const dataWhere = this.topicMap[topic].dataWhere
            if (dataSource) {
              if (dataWhere !== '') {
                Object.assign(this.bindData[dataSource], { [dataWhere]: data })
              } else {
                Object.assign(this.bindData[dataSource], data)
              }
            }
          }
        }
      }
    },
    computed: {},
    mounted() {
      // this.$events.on('CompClick', eventData => this.$notify.info({
      //   title: '点击组件',
      //   message: JSON.stringify(eventData)
      // }))

      this.$events.on('CompClick', (data) => {
        console.log(data)
        this.$notify.info({
          title: '点击组件',
          message: JSON.stringify(data)
        })
      })
    },
    destroyed() {
      this.$events.removeAll()
    },
    created() {
      this.initMappingData()
      this.initSqlList()
      this.initScadaView()
      this.queryData()
    },
  }
</script>
