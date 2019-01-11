import diff from './diff'
import _ from 'lodash'

const getHVPos = (basePoint, revPoint) => {
  if (Math.abs(basePoint.x - revPoint.x) >= Math.abs(basePoint.y - revPoint.y)) {
    return { x: revPoint.x, y: basePoint.y }
  } else {
    return { x: basePoint.x, y: revPoint.y }
  }
}

const getPathOriginPoints = (points) => {
  const pathPts = []

  let tempPt = { x: 0, y: 0 }

  points.forEach((pt, index) => {
    if ((index + 1) % 2 === 0) {
      tempPt.y = pt
      pathPts.push(Object.assign({}, tempPt))
    } else {
      tempPt.x = pt
    }
  })
  return pathPts
}

const getPathRect = (points) => {
  const pathPts = getPathOriginPoints(points)

  let tempPt = { x: 0, y: 0 }

  points.forEach((pt, index) => {
    if ((index + 1) % 2 === 0) {
      tempPt.y = pt
      pathPts.push(Object.assign({}, tempPt))
    } else {
      tempPt.x = pt
    }
  })
  return {
    x: _.minBy(pathPts, 'x').x,
    y: _.minBy(pathPts, 'y').y,
    width: _.maxBy(pathPts, 'x').x - _.minBy(pathPts, 'x').x,
    height: _.maxBy(pathPts, 'y').y - _.minBy(pathPts, 'y').y
  }
}

const isElementVisible = (el) => {
  const rect = el.getBoundingClientRect()
  const vWidth = window.innerWidth
  const vHeight = window.innerHeight
  const efp = function (x, y) {
    return document.elementFromPoint(x, y)
  }

  // Return false if it's not in the viewport
  if (rect.right < 0 || rect.bottom < 0
    || rect.left > vWidth || rect.top > vHeight)
    return false

  // Return true if any of its four corners are visible
  return (
    el.contains(efp(rect.left, rect.top))
    || el.contains(efp(rect.right, rect.top))
    || el.contains(efp(rect.right, rect.bottom))
    || el.contains(efp(rect.left, rect.bottom))
  )
}

const scrollElementToshow = (el) => {
  if (!isElementVisible(el)) {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

const setGroupBinding = (comp, binding) => {
  if (!_.isEmpty(binding) && (comp.type === 'ScadaGroupWrap') && comp.children && comp.children.length > 0) {
    comp.children.forEach(childrenComp => {
      if (!_.isEmpty(childrenComp.binding)) {
        const newUid = binding.uid
        if (newUid) {
          const keys = _.keys(childrenComp.binding)
          if (keys.length > 0) {
            keys.forEach(key => {
              if (!_.isEmpty(childrenComp.binding[key])) {
                childrenComp.binding[key].uid = newUid
              }
            })
          }
        }
      }
      // childrenComp.setGroupBinding(binding)
      setGroupBinding(childrenComp, binding)
    })
  }
}

export default {
  diff,
  getHVPos,
  getPathOriginPoints,
  getPathRect,
  isElementVisible,
  scrollElementToshow,
  setGroupBinding
}