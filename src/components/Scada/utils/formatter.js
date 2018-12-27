import dayjs from 'dayjs'

const timeFormat = (val, paramStr) => {
  paramStr = paramStr || 'HH:mm:ss'
  if (parseInt(val)) {
    return dayjs(parseInt(val)).format(paramStr)
  } else {
    return val
  }
}

const multiplier = (val, paramStr) => {
  paramStr = paramStr || 1
  if (parseFloat(val) && parseFloat(paramStr)) {
    const m = parseFloat(paramStr)
    return val * m
  } else {
    return val
  }
}

export default {
  timeFormat,
  multiplier
}


