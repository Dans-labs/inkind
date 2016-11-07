import React, { Component } from 'react'

const indeterminate = states => !states.allTrue && !states.allFalse

/**
 * @class
 * @classdesc
 * **stateless, DOM-modifying** {@link external:Component|Component}
 * Displays a *collective* checkbox for a filter with many facets.
 *
 *
 * Clicking on this box will collectively check and uncheck all associate
 * checkboxes.
 *
 * This checkbox can have an indeterminate state, if some but not all
 * of the associate checkboxes are checked.
 *
 * We have to resort to a DOM manipulation after rendering to get the
 * indeterminate state across.
 */
class CheckboxI extends Component {
  componentDidMount() {
    const { states } = this.props;
    this.refs.ci.indeterminate = indeterminate(states);
  }
  componentDidUpdate() {
    const { states } = this.props;
    this.refs.ci.indeterminate = indeterminate(states);
  }
/**
 * @method
 * @param {boolean[]} states Exactly two booleans, indicating whether the associate checkboxes
 * are all checked or all unchecked
 * @param {number} filterId The index of the filter in {@link module:Filters.filterList|filterList}
 * @param {FilterCompute#updFilter} updFilter Callback to update the state when user event has occurred 
 * @returns {Fragment}
*/
  render () {
    const { states, filterId, updFilter } = this.props;
    return (
      <input
          ref="ci"
          type="checkbox"
          onChange={event => updFilter(filterId, this.refs.ci.indeterminate || !states.allTrue)}
          checked={states.allTrue}
      />
    )
  }
}

export default CheckboxI