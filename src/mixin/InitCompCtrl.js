import hotkeys from 'hotkeys-js'
import _ from 'lodash'

export default {
  methods: {
    addCompToSelection(compCtrl) {
      if (!this.isInSelGroup(compCtrl)) {
        this.detchCompTransformer()
        this.unGroupSelAll()
        this.curSelComps.push(compCtrl)
      }
    },
    addCompEvent(compCtrl) {
      compCtrl.konvaCtrl().on('click', (e) => {
        if (e.evt.button === 0) {
          if (!this.isInSelGroup(compCtrl)) {
            // 不在多选组内
            if (!hotkeys.shift) {
              this.addCompToSelection(compCtrl)
            } else {
              if (!this.isInSelGroup(compCtrl)) {
                this.curSelComps.push(compCtrl)
              }
            }
          } else {
            // 在多选组内
            if (hotkeys.shift) {
              if (this.isInSelGroup(compCtrl)) {
                compCtrl.removeCompfromGroupSel()
                this.curSelComps.splice(_.findIndex(this.curSelComps, compCtrl), 1)
              }
            }
          }
        }
      })
      compCtrl.konvaCtrl().on('dragstart', () => {
        this.addCompToSelection(compCtrl)
      })
      compCtrl.konvaCtrl().on('dragend', (e) => {
        //alt 拖拽复制
        if (e.evt.altKey && this.curSelCompsCopied.length > 0) {
          const options = {
            index: this.getCompIndex(compCtrl)
          }
          this.addCompsFromConfig(this.curSelCompsCopied, options)
        }
        //更新选中的comps config记录
        this.curSelCompsCopied = this.getCompsConfig(this.curSelComps)
      })
    },
  },
  watch: {
    curSelCompLayout: {
      handler: function () {
        if (this.curSingleSelComp) {
          this.curSelComp.syncKonva()
        }
      },
      // deep: true
    },
  }
}