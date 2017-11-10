import React from 'react'
import { connect } from 'react-redux'

import { withParams, emptyA } from 'utils'
import { getMe } from 'me'

import ErrorBoundary from 'ErrorBoundary'
import NavLink from 'NavLink'

const levels = {
  public: 1,
  auth: 2,
  office: 3,
  system: 4,
  root: 5,
}

const forMe = (my, item) => levels[my] >= levels[item]

const tableLinks = (me, { path, name, forWhom, details }) => forMe(me.groupRep, forWhom)
  ? <div key={path} className={'nav section'} >
      <NavLink to={path} className={'head'} >{name}</NavLink>
      <div className={'nav subsection'} >
        {
          (details || emptyA).filter(({ forWhom: subFor }) => forMe(me.groupRep, subFor)).map(
            ({ path: subPath, name: subName, hint }) =>
              <NavLink
                key={subPath}
                to={`${path}/${subPath}`}
                data-rh={hint}
                data-rh-at={'right'}
              >{subName}</NavLink>
           )
        }
      </div>
    </div>
  : null

const navBarItems = [
  {
    path: '/data/contrib',
    name: 'Contributions',
    forWhom: 'public',
    details: [
      { path: 'filter', name: 'All items', forWhom: 'public', hint: 'Overview of all contributions' },
      { path: 'mylist', name: 'My items', forWhom: 'auth', hint: 'Start here to add a contribution' },
    ],
  },
  {
    path: '/data/assessment',
    name: 'Assessments',
    forWhom: 'auth',
    details: [
      { path: 'filter', name: 'All items', forWhom: 'auth', hint: 'overview of all assessments' },
      { path: 'mylist', name: 'My items', forWhom: 'auth', hint: 'Look here to see the status of your assessments' },
    ],
  },
  {
    path: '/data/package',
    name: 'Packages',
    forWhom: 'office',
    details: [
      { path: 'filter', name: 'list', forWhom: 'office', hint: 'the setup of contribution types and criteria' },
      { path: 'grid', name: 'table', forWhom: 'office', hint: 'the setup of contribution types and criteria' },
    ],
  },
  {
    path: '/data/typeContribution',
    name: 'Contribution types',
    forWhom: 'office',
    details: [
      { path: 'filter', name: 'list', forWhom: 'office', hint: 'overview of all contribution types' },
      { path: 'grid', name: 'table', forWhom: 'office', hint: 'overview of all contribution types' },
    ],
  },
  {
    path: '/data/criteria',
    name: 'Criteria',
    forWhom: 'office',
    details: [
      { path: 'filter', name: 'list', forWhom: 'office', hint: 'overview of all criteria' },
      { path: 'grid', name: 'table', forWhom: 'office', hint: 'overview of all criteria' },
    ],
  },
  {
    path: '/data/score',
    name: 'Scores',
    forWhom: 'office',
    details: [
      { path: 'filter', name: 'list', forWhom: 'office', hint: 'overview of all scores' },
      { path: 'grid', name: 'table', forWhom: 'office', hint: 'overview of all scores' },
    ],
  },
  {
    path: '/data/user',
    name: 'Users',
    forWhom: 'office',
    details: [
      { path: 'filter', name: 'list', forWhom: 'office', hint: 'User management' },
      { path: 'grid', name: 'table', forWhom: 'office', hint: 'User management' },
    ],
  },
  {
    path: '/data/country',
    name: 'Countries',
    forWhom: 'office',
    details: [
      { path: 'filter', name: 'list', forWhom: 'office', hint: 'Country membership management' },
      { path: 'grid', name: 'table', forWhom: 'office', hint: 'Country membership management' },
    ],
  },
]

const SubApp = ({ me, table, routes, children }) => (
  <div className={'sub-app'} >
    <div className={'nav bar'} >
      <ErrorBoundary>
        {navBarItems.map(item => tableLinks(me, item))}
      </ErrorBoundary>
    </div>
    <div className={'details'} >
      <ErrorBoundary>
        {
          routes[1].path === 'data' && routes.length === 1
          ? <div>{'All tables'}</div>
          : routes[1].path === 'data' && routes.length === 2
            ? <div>
                <h3>{'Registry'}</h3>
                <p>{'Use the side bar to navigate to a section'}</p>
              </div>
              : routes[1].path === 'data' && routes.length === 3
                ? <div>
                    <h3>{'Registry'}</h3>
                    <h4>{`Table ${table}`}</h4>
                    <p>{'Use the side bar to navigate to a particular view on this table'}</p>
                  </div>
                : null
        }
      </ErrorBoundary>
      <ErrorBoundary>
        { children }
      </ErrorBoundary>
    </div>
  </div>
)

export default connect(getMe)(withParams(SubApp))
