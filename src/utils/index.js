import diff from './diff'

const getHVPos = function (basePoint, revPoint) {
  if (Math.abs(basePoint.x - revPoint.x) >= Math.abs(basePoint.y - revPoint.y)) {
    return { x: revPoint.x, y: basePoint.y }
  } else {
    return { x: basePoint.x, y: revPoint.y }
  }
}

export default {
  diff,
  getHVPos
}