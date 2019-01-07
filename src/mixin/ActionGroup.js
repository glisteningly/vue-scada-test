import _ from 'lodash'
import Konva from 'konva'
import CompCtrl from '../class/CompCtrl'

export default {
  methods: {
    // 成组
    jointCompsToGroup() {
      // console.log(this.konvaObjs.selCompsGroup.getAbsoluteScale())
      if (this.curSelComps.length > 1) {
        const options = {
          index: this.curSelCompIndex
        }
        const groupRect = this.konvaObjs.selCompsGroup.getClientRect({ relativeTo: this.konvaObjs.stage })
        const g = {
          type: 'ScadaGroupWrap',
          layout: {
            x: groupRect.x + 1,
            y: groupRect.y + 1,
            width: groupRect.width - 2,
            height: groupRect.height - 2,
          },
          konvaContext: this.konvaObjs
        }
        const children = []
        this.curSelComps.forEach((comp) => {
          comp.removeTempTransformer()
          comp.x -= g.layout.x
          comp.y -= g.layout.y
          comp.initBaseLayout()
          comp.syncCompLayout()
          children.push(comp)
        })
        this.compsDelete()
        const c = new CompCtrl(g)
        c.children = children
        this.addComp(c, options)
        this.curSelComps.push(c)
      }
    },
    // 拆组
    unGroupToComps() {
      if (this.curSelComp && this.curSelComps.length === 1 && this.curSelComp.type === 'ScadaGroupWrap' && !this.curSelComp.isChild) {
        const childComps = []
        if (this.curSelComp.children) {
          const options = {
            index: this.curSelCompIndex
          }
          // console.log(options.index)
          this.curSelComp.children.reverse().forEach((childrenComp) => {
            childrenComp.setContext(this.konvaObjs)
            childrenComp.initKonva()
            this.addComp(childrenComp, options)
            // childComps.push(childrenComp)
            childComps.unshift(childrenComp)
          })
        }
        this.compsDelete()
        this.curSelComps = childComps
      }
    },
    // 多选
    addToGroup() {
      this.detchCompTransformer()
      this.curSelComps.forEach((comp) => {
        this.konvaObjs.selCompsGroup.add(comp.konvaCtrl())
        comp.konvaCtrl().draggable(false)
        // 每个对象加上tr，拖动变形时更直观
        // 但如果一次选中的对象数量过多，会明显影响性能，因此限制在10个
        if (this.curSelComps.length <= 10) {
          if (!comp.tempTr) {
            comp.tempTr = new Konva.Transformer({
              node: comp.konvaCtrl(),
              name: 'tempTr',
              keepRatio: true,
              resizeEnabled: false,
              rotateEnabled: false,
            })
            this.konvaObjs.selCompsGroup.add(comp.tempTr)
          }
        }
      })
      this.konvaObjs.layers[0].add(this.konvaObjs.selCompsGroup)
      this.konvaObjs.layers[0].add(this.konvaObjs.groupTransformer)
      this.konvaObjs.groupTransformer.attachTo(this.konvaObjs.selCompsGroup)
      this.konvaObjs.groupTransformer.forceUpdate()
      this.konvaObjs.layers[0].draw()
    },
    // 取消多选
    unGroupSelAll() {
      this.curSelComps.forEach((comp) => {
        comp.removeCompfromGroupSel()
      })
      this.curSelComps = []
    },
    cancelSelGroup() {
      this.konvaObjs.groupTransformer.detach()
      // 重置选取框控件
      this.konvaObjs.selCompsGroup.remove()
      this.konvaObjs.selCompsGroup.x(0)
      this.konvaObjs.selCompsGroup.y(0)
      this.konvaObjs.selCompsGroup.scaleX(1)
      this.konvaObjs.selCompsGroup.scaleY(1)
      this.konvaObjs.selCompsGroup.rotation(0)
      this.konvaObjs.layers[0].draw()
    },
    isInSelGroup(comp) {
      return _.findIndex(this.curSelComps, comp) >= 0
    },
    syncGroupSel() {
      this.curSelComps.forEach((comp) => {
        comp.removeCompfromGroupSel()
      })
      this.cancelSelGroup()
      this.addToGroup()
    },
  }
}