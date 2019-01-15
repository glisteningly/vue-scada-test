export default [
  {
    type: 'ScadaLabel',
    label: 'label 文本',
    layout: {
      width: 140,
      height: 28
    },
    options: {
      style: {
        fontSize: 16,
        fontFamily: 'lcdmono'
      }
    }
  },
  {
    type: 'ScadaRect',
    label: 'rect 矩形',
    layout: {
      width: 120,
      height: 60
    },
    options: {
      style: {
        fill: 'rgba(0, 21, 68, 0.5)',
        stroke: '#20a0ff',
        strokeWidth: 2,
        cornerRadius: 4
      }
    },
  },
  {
    type: 'ScadaImage',
    label: 'image 放置图像',
    layout: {
      width: 80,
      height: 80
    },
    options: {
      param: {
        imgUrl: './images/holder.png'
      }
    }
  },
  {
    type: 'ScadaStates',
    label: 'states 状态显示',
    layout: {
      width: 24,
      height: 24
    },
    options: {}
  },
  {
    type: 'ScadaProgress',
    label: 'progress 状态显示',
    layout: {
      width: 60,
      height: 15
    },
    options: {}
  },
  {
    type: 'ScadaRotation',
    label: 'rotation 旋转图像',
    layout: {
      width: 80,
      height: 80
    },
    options: {}
  }
]