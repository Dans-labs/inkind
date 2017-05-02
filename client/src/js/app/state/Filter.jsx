import React from 'react'
import { connect } from 'react-redux'

import { getTableFilters } from 'tables'

import FullText from 'FullText'
import ByValue from 'ByValue'
import EUMap from 'EUMap'

const filterClass = {
  FullText,
  EUMap,
  ByValue,
}

const Filter = ({
  table, fields,
  filterList, filteredAmount, filteredAmountOthers, amounts,
}) => (
  <div>
    {filterList.filter(x => fields[x.field]).map((filter, filterId) => {
      const { type } = filter
      const { [type]: Fclass } = filterClass
      return (
        <Fclass
          key={filterId}
          table={table}
          filterId={filterId}
          filterField={filter.field}
          filterLabel={filter.label}
          maxCols={filter.maxCols}
          filteredAmount={filteredAmount}
          filteredAmountOthers={filteredAmountOthers[filterId]}
          amounts={amounts[filterId]}
          expanded={filter.expanded}
        />
      )}
    )}
  </div>
)

export default connect(getTableFilters)(Filter)
