import Input from 'Input.jsx'
import MarkDownArea from 'MarkDownArea.jsx'

const valTypes = {
  text: { component: Input, type: 'text' },
  datetime: { component: Input, type: 'text' },
  email: { component: Input, type: 'text' },
  url: { component: Input, type: 'text' },
  textarea: { component: MarkDownArea, type: 'text' },
}
const { text: DEFAULT_TYPE } = valTypes

export const getValType = valType => {
  const { [valType]: typing = DEFAULT_TYPE } = valTypes
  return typing
}

export const validation = {
  datetime(val) {
    if (val == null) {return}
    let times
    try {
      times = new Date(val)
    }
    catch (error) {
      return `not a valid date/time - ${error}`
    }
    if (isNaN(times)) {
      return `not a valid date/time`
    }
  },
  url(val) {
    if (val == null) {return}
    if (!val.match(/^https?:\/\//)) {
      return `urls should start with http:// or https://`
    }
  },
  email(val) {
    if (val == null) {return}
    if (val.match(/[^@a-zA-Z0-9_.-]/)) {
      return `email addresses may only contain alphanumeric characters, - _ and .`
    }
    if (!val.match(/@/)) {
      return `email addresses must contain one @`
    }
    if (val.match(/@.*@/)) {
      return `email addresses must contain exactly one @`
    }
    if (!val.match(/@[^.]+\.[^.]+.*$/)) {
      return `email addresses must end with a domain`
    }
  },
  number(val) {
    if (val == null) {return}
    if (isNaN(val)) {
      return `value must be a number`
    }
  },
}

export const normalization = {
  datetime(val) {
    try {
      const times = new Date(val)
      return times.toISOString()
    }
    catch (error) {
      return val
    }
  },
}
