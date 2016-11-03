import React, { Component, PropTypes, Children } from 'react'

/**
 * @class
 * @classdesc
 * **stateless, context providing** {@link external:Component|Component}
 */
export default class Provider extends Component {
  getChildContext() {
    const {globals} = this.props;
    return {globals}
  }
  render() {
    return Children.only(this.props.children);
  }
}

Provider.propTypes = {
  globals: PropTypes.object.isRequired,
}
Provider.childContextTypes = {
  globals: PropTypes.object.isRequired,
}

