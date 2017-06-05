import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isequal'

import { memoize } from 'memo'
import { combineSelectors, emptyO } from 'utils'
import { EditStatus } from 'fields'

import { getTables, insertItem } from 'tables'
import { getAlts, nextAlt, setAlt } from 'alter'

import ItemContainer from 'ItemContainer'

const initial = 0

const handleNext = memoize((dispatch, tag) => () => dispatch(nextAlt(tag, 2, initial)))

class ListPlain extends Component {
  handleInsert = () => {
    const { props: { table, select, masterId, linkField, dispatch } } = this
    dispatch(insertItem(table, select, masterId, linkField))
    this.gotoNew = true
  }
  gotoItem = eId => {
    const { props: { table, dispatch } } = this
    const tag = `${table}-${eId}`
    dispatch(nextAlt(tag, 2, initial))
  }
  closeItem = eId => {
    const { props: { table, dispatch } } = this
    const tag = `${table}-${eId}`
    dispatch(setAlt(tag, initial))
  }
  handleCloseAll = memoize(items => () => {items.forEach(eId => {this.closeItem(eId)})})

  scroll = domElem => {
    if (domElem != null) {
      domElem.scrollIntoViewIfNeeded()
    }
  }

  render() {
    const { props: { tables, alter, table, listIds, perm, title, dispatch } } = this
    const { [table]: { entities } } = tables
    //console.warn('LISTPLAIN RENDER', this.props)
    return (
      <div className={'listGeneric'} >
        <div>
          {`${listIds.length} item${listIds.length == 1 ? '' : 's'} `}
          {(perm != null && perm.insert) ? (
            <span
              className="fa fa-plus button-large"
              title={`new ${table}`}
              onClick={this.handleInsert}
            />
          ) : null}
        </div>
        {
          listIds.map(eId => {
            const { [eId]: { values } } = entities
            const { [title]: entityHead = '-empty-' } = values
            const tag = `${table}-${eId}`
            const { [tag]: alt = initial } = alter
            const active = alt != initial
            const scrollProps = active ? { ref: this.scroll } : emptyO
            return (
              <div key={eId} >
                <span {...scrollProps} >
                  {perm != null && perm.update ? <EditStatus form={tag} showNeutral={active} /> : null}
                  <span
                    className={'link'}
                    onClick={handleNext(dispatch, tag)}
                  >
                    <span className={`fa fa-angle-${active ? 'left' : 'right'}`} />
                    {' '}{entityHead}
                  </span>
                </span>
                {active ?
                  <ItemContainer
                    table={table}
                    eId={eId}
                  /> : null
                }
              </div>
            )
          })
        }
        <div
          className={'button-large fa fa-angle-double-left'}
          onClick={this.handleCloseAll(listIds)}
        />
      </div>
    )
  }

  gotoNewItem() {
    if (this.gotoNew) {
      const { props: { tables, table } } = this
      const { [table]: tableInfo } = tables
      if (tableInfo == null) {return}
      const { lastInserted } = tableInfo
      if (lastInserted != null) {
        this.gotoNew = false
        this.gotoItem(lastInserted)
      }
    }
  }
  shouldComponentUpdate(newProps) {
    for (const prop in newProps) {
      if (prop != 'listIds') {
        if (newProps[prop] !== this.props[prop]) {
          //console.warn(`LISTPLAIN SHOULDUPDATE because of ${prop}`)
          return true
        }
      }
      else {
        if (!isEqual(newProps[prop], this.props[prop])) {
          //console.warn(`LISTPLAIN SHOULDUPDATE because of ${prop}`)
          return true
        }
      }
    }
    //console.warn(`LISTPLAIN SHOULDUPDATE NO`)
    return false
  }
  componentDidMount() {
    //console.warn('LISTPLAIN DIDMOUNT')
    this.gotoNewItem()
  }
  componentDidUpdate() {
    //console.warn('LISTPLAIN DIDUPDATE')
    this.gotoNewItem()
  }
}

const getInfo = combineSelectors(getTables, getAlts)

export default connect(getInfo)(ListPlain)
