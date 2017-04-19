import merge from 'lodash/merge'

import { accessData } from 'server.js'
import { propsChanged } from 'utils.js'

/* ACTIONS */
/*
 * Most actions call accessData, which will dispatch the ultimate fetch action.
 */

export const fetchDoc = props => {
  const { docDir, docName, docExt } = props
  const path = `${docDir}/${docName}.${docExt}`
  return accessData({ type: 'fetchDoc', contentType: 'json', path, desc: `document ${docName}` })
}

/* REDUCER */

export default (state = {}, { type, path, data }) => {
  switch (type) {
    case 'fetchDoc': {
      if (data == null) {return state}
      return merge({}, state, { [path]: data })
    }
    default: return state
  }
}

/* SELECTORS */

export const getDoc = ({ doc }, { docDir, docName, docExt }) => ({
  text: doc[`${docDir}/${docName}.${docExt}`],
})

/* HELPERS */

export const needDoc = props => (props.text == null)

export const changedDoc = (newProps, oldProps) => (
  propsChanged(newProps, needDoc, oldProps, ['docDir', 'docName', 'docExt'])
)

