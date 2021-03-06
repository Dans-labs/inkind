import React, { Component, createRef } from 'react'
import L from 'leaflet'

import { countryBorders } from 'europe.geo'
import { emptyO } from 'utils'

import ByValue from 'ByValue'

const mapOptions = {
  HEIGHT: 250,
  MAX_RADIUS: 25,
  LEVEL_OFF: 10,
  ZOOM_INIT: 3,
  MAP_CENTER: [52, 12],
  MAP_BOUNDS: [[30, -20], [70, 40]],
  MARKER_COLOR: {
    [true]: {
      color: '#008800',
      fillColor: '#00cc00',
    },
    [false]: {
      color: '#888844',
      fillColor: '#bbbb66',
    },
  },
  MARKER_SHAPE: {
    weight: 1,
    fill: true,
    fillOpacity: 0.8,
  },
  COUNTRY_STYLE: {
    [true]: {
      color: '#884422',
      weight: 2,
      fill: true,
      fillColor: '#aa7766',
      fillOpacity: 1,
    },
    [false]: {
      color: '#777777',
      weight: 1,
      fill: true,
      fillColor: '#bbbbbb',
      fillOpacity: 1,
    },
  },
}

const computeRadius = (mongoId, filteredAmountOthers, amounts) => {
  const amount = amounts ? amounts[mongoId] || 0 : 0
  if (amount === 0) {
    return 0
  }
  const { MAX_RADIUS, LEVEL_OFF } = mapOptions
  const proportional = MAX_RADIUS * amount / filteredAmountOthers
  if (filteredAmountOthers < LEVEL_OFF) {
    return proportional
  }
  return LEVEL_OFF * Math.sqrt(proportional)
}

class EUMap extends Component {
  constructor(props) {
    super(props)
    this.features = {}
    this.dom = createRef()
  }

  render() {
    const { props } = this
    return (
      <>
        <div ref={this.dom} />
        <ByValue {...props} />
      </>
    )
  }

  componentDidMount() {
    const {
      props: {
        filterSetting,
        filteredAmountOthers,
        amounts,
        tables: { country },
      },
      dom: { current: dom },
    } = this
    const {
      HEIGHT,
      MAP_CENTER,
      ZOOM_INIT,
      MAP_BOUNDS,
      MARKER_COLOR,
      MARKER_SHAPE,
      COUNTRY_STYLE,
    } = mapOptions
    dom.style.height = HEIGHT
    this.map = L.map(dom, {
      attributionControl: false,
      center: MAP_CENTER,
      zoom: ZOOM_INIT,
      maxBounds: MAP_BOUNDS,
    })
    const { allIds, entities } = country
    this.idFromIso = {}
    this.inDariah = {}
    allIds.forEach(mongoId => {
      const { [mongoId]: { values: { iso, isMember } } } = entities
      this.idFromIso[iso] = mongoId
      this.inDariah[iso] = isMember
    })
    L.geoJSON(countryBorders, {
      style: feature => COUNTRY_STYLE[this.inDariah[feature.properties.iso2]],
      onEachFeature: feature => {
        const { properties: { iso2, lat, lng } } = feature
        if (this.inDariah[iso2]) {
          const { idFromIso: { [iso2]: mongoId } } = this
          const { [mongoId]: isOn = false } = filterSetting || emptyO
          const marker = L.circleMarker([lat, lng], {
            ...MARKER_COLOR[isOn],
            radius: computeRadius(mongoId, filteredAmountOthers, amounts),
            ...MARKER_SHAPE,
            pane: 'markerPane',
          }).addTo(this.map)
          this.features[iso2] = marker
        }
      },
    }).addTo(this.map)
  }

  componentDidUpdate() {
    const { props: { filterSetting, filteredAmountOthers, amounts } } = this
    const { MARKER_COLOR } = mapOptions
    Object.entries(this.features).forEach(([iso2, marker]) => {
      const { idFromIso: { [iso2]: mongoId } } = this
      const { [mongoId]: isOn = false } = filterSetting || emptyO
      marker.setRadius(computeRadius(mongoId, filteredAmountOthers, amounts))
      marker.setStyle(MARKER_COLOR[isOn])
    })
  }
}

EUMap.displayName = 'EUMap'

export default EUMap
