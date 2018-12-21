export default [
  {
    type: 'ScadaLabel',
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
    layout: {
      width: 24,
      height: 24
    },
    options: {
    }
  }
]