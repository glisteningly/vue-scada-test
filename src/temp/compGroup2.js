export default {
  type: 'ScadaGroup',
  layout: {
    x: 200,
    y: 200,
    width: 320,
    height: 110
  },
  options: {},
  children: [{
    type: 'ScadaImage',
    layout: {
      x: 0,
      y: 0,
      width: 110,
      height: 110,
      scaleX: 1.5,
      scaleY: 1.5
    },
    options: {
      url: '/images/twitter.svg'
    }
  }, {
    type: 'ScadaImage',
    layout: {
      x: 120,
      y: 0,
      width: 200,
      height: 67.6,
      scaleX: 0.5,
      scaleY: 0.5
    },
    options: {
      url: '/images/google.png'
    }
  }, {
    type: 'ScadaRect',
    layout: {
      x: 120,
      y: 70,
      width: 200,
      height: 40
    },
    options: {
      style: {
        strokeWidth: 2
      }
    }
  }, {
    type: 'ScadaLabel',
    layout: {
      x: 168,
      y: 77,
      width: 100,
      height: 30
    },
    options: {
      style: {
        fontSize: 20
      }
    },
  }]
}