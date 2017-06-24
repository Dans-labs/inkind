import React from 'react'
import { connect } from 'react-redux'

import { combineSelectors, emptyS, emptyA } from 'utils'
import { handle } from 'handle'

import { getSettings } from 'settings'
import { getAltSection, compileAlternatives } from 'alter'
import { getGrid, compileSortedData, resetSort, addColumn, turnColumn, delColumn } from 'grid'
import { insertItem } from 'tables'

import { dealWithProvenance } from 'fields'

import ItemRow from 'ItemRow'

const ListGrid = ({
  alter, alterSection,
  heading,
  settings, filters, tables, table, listIds, select, perm: tablePerm,
  masterId, linkField,
  grid, gridTag,
  dispatch,
}) => {
  const { [gridTag]: sortSpec = emptyA } = grid
  const theHeading = heading ? `${heading}: ` : emptyS
  const { [table]: tableData } = tables
  const { fields: givenFields, fieldOrder: givenFieldOrder, fieldSpecs, detailOrder, entities } = tableData
  const fields = dealWithProvenance(settings, givenFields)
  const fieldOrder = givenFieldOrder.filter(field => fields[field])
  const { length: nFields } = fieldOrder
  const nDetails = detailOrder != null ? detailOrder.length : 0
  const avLength = `${90 / nFields}%`
  const widths = fieldOrder.map(field => {
    const { [field]: { grid } } = fieldSpecs
    if (grid == null) {
      return { width: avLength, shrink: 0, grow: 1 }
    }
    const { width, grow, shrink } = grid
    return {
      width: width == null ? avLength : width,
      shrink: shrink == null ? 0 : shrink,
      grow: grow == null ? 0 : grow,
    }
  }).concat(new Array(nDetails).fill({ width: avLength, shrink: 0, grow: 0.3 }))
  const widthStyles = widths.map(({ width, grow, shrink }) => ({
    flex: `${grow} ${shrink} ${width}`,
    overflow: 'auto',
  }))
  const nItemsRep = `${listIds.length} item${listIds.length == 1 ? emptyS : 's'} `

  const sortedData = compileSortedData(tables, table, listIds, sortSpec)
  const makeAlternatives = compileAlternatives(alterSection, 2, 0, dispatch)
  const rows = []
  for (const eId of sortedData) {
    const { [eId]: { values: initialValues, perm } } = entities
    const { getAlt, nextAlt } = makeAlternatives(eId)
    const alt = getAlt(alter)
    rows.push(
      <ItemRow
        key={`${table}-${eId}`}
        alt={alt}
        nextAlt={nextAlt}
        filters={filters}
        tables={tables}
        table={table}
        eId={eId}
        initialValues={initialValues}
        perm={perm}
        fields={fields}
        widthStyles={widthStyles}
      />
    )
  }
  return (
    <div>
      <p>
        <span className={'list-title'}>{theHeading}</span>{nItemsRep}
        {
          (tablePerm != null && tablePerm.insert)
          ? <span
              className={'fa fa-plus button-large'}
              title={`new ${table}`}
              onClick={handle(dispatch, insertItem, table, select, masterId, linkField)}
            />
          : null
        }
      </p>
      {
        sortSpec.length != 0
        ? <p className={'sortspecs'} >
            {'Sorted: '}
            {
              sortSpec.map(([column, direction]) => (
                <span className={'sortcol'} key={column} >
                  <span>{column}</span>
                  <span className={`fa fa-arrow${direction == -1 ? 'down' : 'up'}`} />
                </span>
              ))
            }
            <span
              className={'fa fa-close button-small'}
              title={'remove all sort options'}
              onClick={handle(dispatch, resetSort, gridTag)}
            />{' '}
          </p>
        : null
      }
      <div className={'grid'} >
        <div className={'grid-head'} >
          <div className={'grid-status-cell'} />
          {
            fieldOrder.filter(field => field != linkField).map((field, i) => {
              const widthStyle = widthStyles[i]
              const isSorted = sortSpec.find(x => x[0] == field)
              const direction = isSorted ? isSorted[1] : 0
              return (
                <div
                  className={'grid-head-cell label-col-grid'}
                  key={field}
                  style={widthStyle}
                >
                  {
                    direction
                    ? <span
                        className={'sorted button-small'}
                        title={'remove column from sort options'}
                        onClick={handle(dispatch, delColumn, gridTag, field)}
                      >{field}</span>
                    : <span
                        className={'unsorted button-small'}
                        title={'sort on this column'}
                        onClick={handle(dispatch, addColumn, gridTag, field, 1)}
                      >{field}</span>
                  }
                  {
                    direction
                    ? <span
                        className={`sorted button-small fa fa-arrow-${direction == 1 ? 'up' : 'down'}`}
                        title={'change sort direction'}
                        onClick={handle(dispatch, turnColumn, gridTag, field)}
                      />
                    : null
                  }
                </div>
              )
            })
          }
          {
            (detailOrder || emptyA).map((name, i) => {
              const widthStyle = widthStyles[i]
              return (
                <div
                  className={'grid-head-cell label-col-grid'}
                  key={name}
                  style={widthStyle}
                >{name}
                </div>
              )
            })
          }
        </div>
        {rows}
      </div>
    </div>
  )
}

const getInfo = combineSelectors(getSettings, getGrid, getAltSection)

export default connect(getInfo)(ListGrid)
