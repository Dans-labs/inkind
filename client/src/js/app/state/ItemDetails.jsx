import React from 'react'
import { connect } from 'react-redux'

import { emptyS } from 'utils'
import { makeDetails } from 'fields'

import { DETAILS } from 'tables'
import { makeTag } from 'filters'
import { getAltSection, compileAlternatives } from 'alter'

import ListGrid from 'ListGrid'
import ListPlain from 'ListPlain'
import ListFilter from 'ListFilter'

const ItemDetails = ({ alter, alterSection, filters, tables, table, eId, detailFragments, dispatch }) => {
  const theFragments = detailFragments == null
  ? makeDetails(tables, table, eId)
  : detailFragments
  const makeAlternatives = compileAlternatives(alterSection, 2, 1, dispatch)
  const { [table]: { details } } = tables
  return (
    <div className={'grid fragments'}>
      {
        theFragments.map(({ name, detailTable, item: [thing, things], nDetails }) => {
          const { getAlt, nextAlt } = makeAlternatives(name)
          const alt = getAlt(alter)
          const { linkField, mode, filtered } = details[name]
          const {
            [detailTable]: {
              title: detailTitle,
              item,
              perm: detailPerm,
              entities: detailEntities,
              allIds: detailAllIds,
            },
          } = tables
          const detailThings = item[1]
          const detailListIds = detailAllIds.filter(_id => detailEntities[_id].values[linkField] == eId)
          const filterTag = makeTag(DETAILS, eId, linkField)
          const gridTag = `${table}-${name}-${eId}`
          return (
            <div key={name} className={'grid-row'} >
              <div
                className={'link'}
                onClick={nextAlt}
              >
                <span className={`fa fa-angle-${alt == 0 ? 'down' : 'up'}`} />
                {
                  alt == 0
                  ? `${nDetails} ${nDetails == 1 ? thing : things}`
                  : emptyS
                }
              </div>
              {
                alt == 1
                ? filtered
                  ? <ListFilter
                      filters={filters}
                      tables={tables}
                      table={detailTable}
                      listIds={detailListIds}
                      perm={detailPerm}
                      select={DETAILS}
                      mode={mode}
                      compact={true}
                      title={detailTitle}
                      gridTag={gridTag}
                      filterTag={filterTag}
                      masterId={eId}
                      linkField={linkField}
                    />
                  : mode == 'list'
                    ? <ListPlain
                        alterSection={`list-${detailTable}-${DETAILS}`}
                        filters={filters}
                        tables={tables}
                        table={detailTable}
                        listIds={detailListIds}
                        perm={detailPerm}
                        title={detailTitle}
                        masterId={eId}
                        linkField={linkField}
                      />
                    : mode == 'grid'
                      ? <ListGrid
                          alterSection={`list-${detailTable}-${DETAILS}`}
                          filters={filters}
                          tables={tables}
                          table={detailTable}
                          listIds={detailListIds}
                          perm={detailPerm}
                          gridTag={gridTag}
                          masterId={eId}
                          linkField={linkField}
                        />
                      : <span>{`unknown display mode "${mode}" for ${detailThings}`}</span>
                : null
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default connect(getAltSection)(ItemDetails)

