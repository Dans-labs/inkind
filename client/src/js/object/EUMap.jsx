import React, { Component } from 'react'
import ByValue from '../pure/ByValue.jsx'
import L from 'leaflet'
import {countryBorders} from '../helpers/europe.geo.js'

/**
 * A complex component! 
 * It is a facet filter for the field country,
 * and it contains a map of Europe, visualizing by means of markers,
 * how the filter result is distributed over the DARIAH countries.
 * 
 * Both ingredients of this component are brought together not by
 * class extension but by functional composition.
 *
 * The country facet filter is a true react {@link external:Component|component}. 
 *
 * The map is a [Leaflet](http://leafletjs.com) module on a blank pane,
 * with a {@link module:europe_geo_js|geojson} file of country boundaries laid out on it.
 * The map is not react aware, it will be rendered in its own div.
 *
 * Remember that the results of filter computation descend from a stateful
 * parent into the present component.
 * So, whenever we receive new props, we manipulate the leaflet map and adjust
 * the markers on it.
 * More precisely, since we do not have to manipulate state, we put the marker updates
 * in the {@link external:componentDidMount|componentDidMount()}
 * and {@link external:componentDidUpdate|componentDidUpdate()}
 * {@link external:LifeCycle|life cycle methods} of React.
 * At those moments we know that the DOM elements that must be rendered have mounted,
 * so the map exists, and we can put the markers there.
 *
 * @module EUMap
 */

const mapOptions = {
  HEIGHT: 250,
  MAX_RADIUS: 25,
  LEVEL_OFF: 10,
  ZOOM_INIT: 3,
  MAP_CENTER: [52, 12],
  MAP_BOUNDS: [[30, -20], [70,40]],
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
  }
}

/**
 * ## Compute Marker Radius
 *
 * When we know the filter results per country, we can put markers on countries
 * with a radius in proportion to their scores.
 * However, if the scores are very far apart, either the small markers get invisible,
 * or the big markers get too big. 
 * We mitigate this effect, by using proportional radii only for values below a certain
 * threshold (LEVEL_OFF). For higher values we essentiall take the square root.
 * 
 * @function
 * @param {string} iso2 Two-letter country code, see [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
 * @param {number} filteredAmountOthers - how many rows pass all other filters
 * @param {Map} amounts - `filteredAmountOthers`, but more specific: the amounts per faceted value
 * @returns {number} the desired radius for this country
*/
const computeRadius = (iso2, filteredAmountOthers, amounts) => { 
  const amount = amounts ? amounts.has(iso2) ? amounts.get(iso2) : 0 : 0;
  if (!amount) {return 0}
  const proportional = mapOptions.MAX_RADIUS * amount / filteredAmountOthers;
  if (filteredAmountOthers < mapOptions.LEVEL_OFF) {return proportional}
  return mapOptions.LEVEL_OFF * Math.sqrt(proportional);
}

/**
 * @function
 * @param {Object} feature A feature (i.e. a country) in the   
 * {@link module:europe_geo_js|geojson}
 * file of European countries
 * @param {Map} countries The country information as fetched from the database on the server.
 * Organized as a {Map} keyed by Two-letter country codes.
 * @returns {boolean} Whether the country in question is a member of DARIAH.
 */
const inDariah = (feature, countries) => {
  const iso2 = feature.properties.iso2;
  return countries.has(iso2) && countries.get(iso2).inDARIAH
}

/**
 * @class
 * @classdesc
 * **stateless, DOM-modifying** {@link external:Component|Component}
 * 
 * An ordinary faceted filter on the country field plus a container for the map,
 * with
 * {@link external:LifeCycle|life cycle methods}
 * to place and update markers when the filter results have changed.
 */
class EUMap extends Component {
  constructor(props) {
    super(props);
    this.features = new Map();
  }
/**
 * render() just invokes the ByValue component with the right parameters
 * to get the country facets.
 * And it puts a div in place that will receive the map.
 * @method
 * @param {Map} countries This parameter is not used, but mentioned to select all the other parameters to
 * pass on
 * @param {Object[]} byValueProps The remaining properties, to be passes to the {ByValue} component.
 * @returns {Fragment}
 */
  render() {
    const { countries, ...byValueProps } = this.props;
    return (
      <div>
        <div ref="eumap" style={{
          height: mapOptions.HEIGHT,
        }}/>
        <ByValue {...byValueProps}/>
      </div>
    )
  }

/**
 * After the initial mount we get the country data and perform
 * initializations that depend on that information:
 *
 * * we put the map in place
 * * we put the country boundaries on the pane
 * * we add markers, style them, and maintain references to them
 *
 * These do not have to be repeated after subsequent updates.
 * @method
 * @param {Map} filterSettings - the current settings of the country facets
 * @param {number} filteredAmountOthers - how many rows pass all other filters
 * @param {Map} amounts` - `filteredAmountOthers`, but more specific: the amounts per faceted value
 * @param {Map} countries The country information as fetched from the database on the server.
 * Organized as a {Map} keyed by Two-letter country codes.
 * @returns {DOM}
 */
  componentDidMount() {
    const { filterSettings, filteredAmountOthers, amounts, countries } = this.props;
    this.map = L.map(this.refs.eumap, {
      attributionControl: false,
      center: mapOptions.MAP_CENTER,
      zoom: mapOptions.ZOOM_INIT,
      maxBounds: mapOptions.MAP_BOUNDS,
    });
    L.geoJSON(countryBorders, {
      style: feature => mapOptions.COUNTRY_STYLE[inDariah(feature, countries)],
      onEachFeature: feature => {
        if (inDariah(feature, countries)) {
          const fprops = feature.properties;
          const iso2 = fprops.iso2;
          const isOn = filterSettings.get(iso2);
          const marker = L.circleMarker([fprops.lat, fprops.lng], {
            ...mapOptions.MARKER_COLOR[isOn],
            radius: computeRadius(iso2, filteredAmountOthers, amounts),
            ...mapOptions.MARKER_SHAPE,
            pane: 'markerPane',
          }).addTo(this.map);
          this.features.set(fprops.iso2, marker);
        }
      },
    }).addTo(this.map);
  }

/**
 * After getting new filter results, the only thing we have to do is to
 *
 * * update the marker radii
 * * update the marker colors
 *
 * @param {Map} filterSettings - the current settings of the country facets
 * @param {number} filteredAmountOthers - how many rows pass all other filters
 * @param {Map} amounts` - `filteredAmountOthers`, but more specific: the amounts per faceted value
 * @returns {DOM}
 */
  componentDidUpdate() {
    const { filterSettings, filteredAmountOthers, amounts } = this.props;
    for (const [iso2, marker] of this.features) {
      const isOn = filterSettings.get(iso2);
      marker.setRadius(computeRadius(iso2, filteredAmountOthers, amounts));
      marker.setStyle(mapOptions.MARKER_COLOR[isOn]);
    }
  }
}

export default EUMap
