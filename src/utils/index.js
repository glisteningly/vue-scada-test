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

export default {
  diff,
  getHVPos,
  getPathOriginPoints,
  getPathRect
}