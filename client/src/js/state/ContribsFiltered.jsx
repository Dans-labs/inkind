import React, { Component, PropTypes } from 'react'

import FilterCompute from './FilterCompute.jsx'
import { filterList } from '../pure/Filters.jsx'
import { compileFiltering } from '../helpers/filters.js'
import { getData } from '../helpers/data.js'
import { withContext, saveState } from '../helpers/hoc.js'

class ContribsFiltered extends Component {
  render() {
    const { contribs, countries } = this.state;
    if (contribs == null || countries == null) {
      return <div/>
    }
    const { fieldValues, filterInit } = compileFiltering(contribs, filterList);
    const countriesMap = new Map(countries.map(x => [x._id, x]));
    return <FilterCompute
      contribs={contribs}
      countries={countriesMap}
      fieldValues={fieldValues}
      filterInit={filterInit}
    />
  }
  componentDidMount() {
    const { contribs, countries } = this.state;
    if (contribs == null || countries == null) {
      getData({
          contribs: `list_contrib`,
          countries: 'member_country',
        },
        this,
        this.props.notification.component,
      );
    }
  }
}

ContribsFiltered.propTypes = {
};

export default withContext(saveState(ContribsFiltered, 'ContribsFiltered', {contribs: null, countries: null}))
