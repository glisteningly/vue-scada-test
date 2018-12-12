export default [
  {
    type: 'ScadaLabel',
    layout: {
      width: 140,
      height: 30
    },
    options: {
      style: {
        fontSize: 20
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
        imgUrl: '/images/holder.png'
      }
    }
  }
]