export default {
  comps: [{
    type: 'ScadaLabel',
    layout: {
      x: 400,
      y: 400,
      width: 200,
      height: 68
    },
    options: {
      style: {
        fontSize: 20
      }
    },
  }, {
    type: 'ScadaRect',
    layout: {
      x: 200,
      y: 200,
      width: 120,
      height: 100
    },
    options: {
      style: {
        strokeWidth: 2
      }
    }
  }, {
    type: 'ScadaImage',
    layout: {
      x: 100,
      y: 100,
      width: 100,
      height: 100
    },
    options: {
      url: '/images/twitter.svg'
    }
  }, {
    type: 'ScadaImage',
    layout: {
      x: 300,
      y: 300,
      width: 200,
      height: 68
    },
    options: {
      url: '/images/google.png'
    }
  }]
}