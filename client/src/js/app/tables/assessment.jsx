import React from 'react'

import { emptyA, emptyO, emptyS } from 'utils'
import { itemReadField, itemEditField } from 'fields'
import { decisions, processStatus, finalDecision } from 'workflow'

import Tooltip from 'Tooltip'
import ScoreBox from 'ScoreBox'

const rField = (field, l, f, key) =>
  itemReadField(field, l(field), f(field), key)
const eField = (field, l, fe, m, key) =>
  itemEditField(field, l(field), fe(field), m(field), key)

const templates = {
  head({ tables, v, w, me }) {
    return processStatus(
      { items: [{ reviewerF: v('reviewerF') }] },
      w('reviews'),
      v('submitted'),
      w('frozen').on,
      { tables, v, w, me },
    )
  },
  main({ l, f }) {
    return (
      <div className={'grid fragments'}>
        {rField('title', l, f)}
        {rField('assessmentType', l, f)}
        {rField('contrib', l, f)}
        {rField('remarks', l, f)}
        {rField('editors', l, f)}
      </div>
    )
  },
  mainEdit({ l, f, fe, m, editButton }) {
    return (
      <>
        {editButton}
        <div className={'grid fragments'}>
          {eField('title', l, fe, m)}
          {rField('assessmentType', l, f)}
          {rField('contrib', l, f)}
          {eField('remarks', l, fe, m)}
          {eField('editors', l, fe, m)}
        </div>
      </>
    )
  },
  mainAction({ tables, l, e, v, w, s, f, fe, fs, m }) {
    const scoreItems = (w('score') || emptyO).items || emptyA
    const score = scoreItems.length ? scoreItems[0] : emptyO
    const isWithdrawn = !e('dateWithdrawn')
    const isSubmitted = !e('submitted')
    const { dId } = decisions(tables.decision)
    const decision = finalDecision(
      { items: [{ reviewerF: v('reviewerF') }] },
      w('reviews'),
    )
    const reOpen = decision === dId['warning']
    const decided = !!decision
    const frozen = w('frozen').on
    const frozenDesc = w('frozen').desc
    return (
      <>
        <ScoreBox score={score} />
        <div className={'grid fragments'}>
          {m('submitted') ? null : rField('submitted', l, f)}
          {itemEditField(
            'submitted',
            'Submission',
            <>
              {!isSubmitted && isWithdrawn
                ? `${reOpen ? 'Revised' : l('dateWithdrawn')}: ${s(
                    'dateWithdrawn',
                  )}`
                : null}
              {isSubmitted
                ? `${l('dateSubmitted')}: ${s('dateSubmitted')}`
                : null}
              {w('incomplete').on || w('stalled').on ? null : decided &&
              !reOpen && !frozen ? (
                <span className={`label large workflow info`}>
                  {'Review finished'}
                </span>
              ) : (
                fs('submitted', e('submitted'), h => (
                  <span
                    className={`button large workflow ${
                      e('submitted') ? 'info' : reOpen ? 'info' : 'error'
                    }`}
                    onClick={h}
                  >{`${
                    e('submitted')
                      ? `Submit for review${reOpen ? ' (again)' : emptyS}`
                      : reOpen ? 'Enter revisions' : 'Withdraw from review'
                  }`}</span>
                ))
              )}
            </>,
            m('submitted'),
          )}
          {e('submitted') ? null : eField('reviewerE', l, fe, m)}
          {e('submitted') ? null : eField('reviewerF', l, fe, m)}
        </div>
        {w('stalled').on ? (
          <div className={'label large workflow error'}>
            {`This assessment cannot be submitted because: ${w('stalled').desc}.
              Either change the type of the contribution to the type of this assessment,
              or start a new assessment, copy over the relevant material form this
              assessment (by hand), and remove this assessment.
            `}
          </div>
        ) : null}
        {w('incomplete').on ? (
          <div className={'label large workflow warning'}>
            {`This assessment cannot yet be submitted because: ${
              w('incomplete').desc
            }.
            `}
          </div>
        ) : e('submitted') ? (
          <div className={'label large workflow good'}>
            {`All criteria filled: this assessment can be submitted.
              `}
          </div>
        ) : null}
        {frozen ? (
          <div className={'label large workflow info'}>
            {`This assessment is frozen because ${frozenDesc}.`}
          </div>
        ) : null}
        {m('title') && w('locked').on && !reOpen && !frozen ? (
          <div className={'label large workflow info'}>
            {`This assessment is locked because it ${
              decided ? 'has been reviewed' : w('locked').desc
            }.`}
          </div>
        ) : null}
      </>
    )
  },
  insert: {
    contrib({ at, v, w, n, o, onInsert }) {
    return w('frozen').on ? null :
      at.has(v('typeContribution')) ? (
        o ? (
          n == 0 ? (
            <span className={`button large workflow info`} onClick={onInsert}>
              {`Write a self-assessment`}
            </span>
          ) : (
            <Tooltip
              tip={
                <>
                  <p>
                    {'Normally a contribution needs just one self-assessment.'}
                  </p>
                  <p>{'Only add an other one in the following cases'}</p>
                  <ul>
                    <li>
                      {'The previous self-assessment has become obsolete'}
                    </li>
                    <li>
                      {`The previous self-assessment is based on a contribution type,
                          but the contribution in question has been assigned another type.`}
                    </li>
                  </ul>
                  <p>
                    <b>
                      {`In the last case, it is recommended to copy and paste the relevant parts
                        of the old assessment into the new one and delete the old one.`}
                    </b>
                  </p>
                </>
              }
              at={'top'}
            >
              <span
                className={`button large workflow warning`}
                onClick={onInsert}
              >
                {`Add another self-assessment`}
                <span className={'fa fa-exclamation'} />
              </span>
            </Tooltip>
          )
        ) : (
          <span className={`label large workflow info`}>
            {`Only owners and editors can self-assess a contribution`}
          </span>
        )
      ) : (
        <span className={`label large workflow error`}>
          {`Contributions with a legacy type cannot be assessed`}
        </span>
      )
    },
  },
}

Object.assign(templates, {
  detail: {
    contrib: templates.main,
  },
  detailEdit: {
    contrib: templates.mainEdit,
  },
  detailAction: {
    contrib: templates.mainAction,
  },
})

export default templates
