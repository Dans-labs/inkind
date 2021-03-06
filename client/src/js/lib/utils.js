import React from 'react'
import { createSelector } from 'reselect'
import update from 'immutability-helper'

export const emptyS = Object.freeze('')
export const emptyA = Object.freeze([])
export const emptyO = Object.freeze({})
export const emptySet = Object.freeze(new Set())
export const emptyF = Object.freeze(() => null)

export const propsChanged = (newProps, need, oldProps, keyPropNames) => {
  let result = false
  if (oldProps == null) {
    if (need(newProps)) {
      result = true
    }
  } else {
    if (keyPropNames.some(a => newProps[a] !== oldProps[a]) && need(newProps)) {
      result = true
    }
  }
  return result
}

/*
export const withParams = Component => ({ params, route, ...props }) => {
  const allProps = { ...props, ...params, ...route }
  return <Component {...allProps} />
}
*/

export const injectProps = (Component, inject) => ({ match: { params } = emptyO, ...props }) => {
  const allProps = { ...props, ...params, ...inject }
  return <Component {...allProps} />
}

export const makeReducer = (flows, init = emptyO) => (state, action) => {
  if (state === undefined) {
    return init
  }
  const { type } = action
  const { [type]: flow } = flows
  return flow ? flow(state, action) : state
}

const mergeObject = (...objects) => Object.assign({}, ...objects)

export const combineSelectors = (...selectors) =>
  createSelector(...selectors, mergeObject)

export const updateAuto = (state, path, data, asArray = false) =>
  path.length === 0
    ? update(state, data)
    : path.length === 1
      ? update(state, {
          [path[0]]: {
            $apply: v => {
              const newV = update(v || (asArray ? emptyA : emptyO), data)
              return jString(v) === jString(newV) ? v : newV
            },
          },
        })
      : update(state, {
          [path[0]]: {
            $apply: v => updateAuto(v || emptyO, path.slice(1), data, asArray),
          },
        })

export const jString = (o, indent) =>
  JSON.stringify(
    o,
    (k, v) =>
      v !== null && typeof v === 'object' && !Array.isArray(v)
        ? Object.keys(v)
            .sort()
            .reduce((r, kv) => {
              r[kv] = v[kv]
              return r
            }, {})
        : v,
    indent,
  )

export const getUrlParts = urlLoc => {
  const url = urlLoc.replace(/\/$/, emptyS)
  let parts
  parts = url.match(/^\/(.*)\/([^/]+)\/([^/]+)\/([^/]+)\/?$/)
  if (!parts) {
    parts = url.match(/^\/(.*)\/([^/]+)\/([^/]+)\/?$/)
  }
  if (!parts) {
    parts = url.match(/^\/(.*)\/([^/]+)\/?$/)
  }
  if (!parts) {
    parts = url.match(/^\/(.*)\/?$/)
  }
  parts = parts.slice(1)
  const result = {
    base: parts[0] || emptyS,
    table: parts[1] || emptyS,
    controller: parts[2] || emptyS,
    eId: parts[3] || emptyS,
  }
  return result
}

export const max = arr =>
  arr.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY)
export const min = arr =>
  arr.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
export const sum = arr => arr.reduce((a, b) => a + b, 0)
