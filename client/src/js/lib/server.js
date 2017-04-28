import 'whatwg-fetch'
import { SubmissionError } from 'redux-form'

const rootUrl = '/api/'

const ask = desc => ({ type: 'async', status: 'pending', desc })
const err = (desc, msgs) => ({ type: 'async', status: 'error', desc, msgs })
const succeed = desc => ({ type: 'async', status: 'success', desc })

/* global process */

export const accessData = task => dispatch => {
  const { path, contentType, desc, sendData } = task
  dispatch(ask(desc))
  dispatch(task)

  let settings = { credentials: 'same-origin' }
  if (sendData != null) {
    settings = {
      ...settings,
      method: 'POST',
      body: JSON.stringify(sendData),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }
  return fetch(`${rootUrl}${contentType}${path}`, settings)
  .then(response => response.json())
  .then(json => {
    const { msgs, good, data } = json
    if (good) {
      dispatch(succeed(desc))
      dispatch({ ...task, data })
    }
    else {
      dispatch(err(desc, msgs))
      if (data) {
        throw new SubmissionError(data)
      }
    }
  })
  .catch(error => {
    if (process.env.NODE_ENV === `development`) {console.error(error)}
    if (error instanceof SubmissionError) {
      throw error
    }
    else {
      dispatch(err(desc, [{kind: 'error', text: error.toString()}]))
    }
  })
}
