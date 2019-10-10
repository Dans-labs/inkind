from flask import request

from controllers.config import Config as C, Names as N
from controllers.html import HtmlElements as H
from controllers.utils import E, ONE, cap1
from controllers.types import Types
from controllers.perm import getPerms

CT = C.table
CW = C.web


DEFAULT_TYPE = CT.defaultType

REFRESH = CW.messages[N.refresh]


def labelDiv(label):
  return H.div(
      f"""{label}:""",
      cls="record-label",
  )


class Field(object):
  inheritProps = (
      'db', 'auth', 'uid', 'eppn', 'table', 'record', 'eid', 'perm',
  )

  def __init__(self, recordObj, field):
    for prop in Field.inheritProps:
      setattr(self, prop, getattr(recordObj, prop, None))

    self.parent = recordObj

    self.field = field
    self.withRefresh = field == N.modified

    fieldSpecs = recordObj.fields
    fieldSpec = fieldSpecs.get(field, {})

    record = self.record
    self.value = record.get(field, None)

    require = fieldSpec.get(N.perm, {})
    self.require = require

    self.label = fieldSpec.get(N.label, cap1(field))
    self.tp = fieldSpec.get(N.type, DEFAULT_TYPE)
    self.multiple = fieldSpec.get(N.multiple, False)
    self.extensible = fieldSpec.get(N.extensible, False)

    perm = self.perm
    table = self.table
    eid = self.eid
    tp = self.tp

    tpClass = getattr(Types, tp)
    self.tpClass = tpClass
    self.widgetType = tpClass.widgetType

    (self.mayRead, self.mayEdit) = getPerms(perm, require)

    self.atts = (
        dict(
            table=table,
            eid=eid,
            field=field,
        )
    )

  def save(self, data):
    db = self.db
    uid = self.uid
    eppn = self.eppn
    table = self.table
    eid = self.eid
    field = self.field
    mayEdit = self.mayEdit
    extensible = self.extensible

    if mayEdit:
      record = self.record

      multiple = self.multiple
      tpClass = self.tpClass
      conversion = (
          tpClass.fromStr
          if tpClass else
          None
      )
      args = (
          dict(db=db, uid=uid, eppn=eppn, extensible=True)
          if extensible else
          {}
      )

      if conversion is not None:
        if multiple:
          data = [
              conversion(d, **args)
              for d in data or []
          ]
        else:
          data = conversion(data, **args)

      modified = record.get(N.modified, None)
      (updates, deletions) = db.updateField(
          table,
          eid,
          field,
          data,
          eppn,
          modified,
      )
      self.update(updates, deletions)

  def update(self, updates, deletions):
    parent = self.parent
    record = self.record
    field = self.field
    require = self.require

    record.update(updates)
    for f in deletions:
      if f in record:
        del record[f]
    self.value = record.get(field, None)

    parent.setPerm()
    self.perm = parent.perm
    perm = self.perm

    (self.mayRead, self.mayEdit) = getPerms(perm, require)

  def wrap(self, action=None):
    mayRead = self.mayRead

    if not mayRead:
      return E

    mayEdit = self.mayEdit
    editable = mayEdit and action == N.edit

    if action is not None:
      data = request.get_json()
      if data is not None and N.save in data:
        self.save(data[N.save])

    widget = self.wrapWidget(editable)

    if action is not None:
      return E.join(widget)

    label = self.label
    editClass = " edit" if editable else E

    return (
        H.div(
            [
                labelDiv(label),
                H.div(
                    widget,
                    cls=f"record-value{editClass}",
                ),
            ],
            cls="record-row",
        )
    )

  def wrapWidget(self, editable):
    atts = self.atts
    mayEdit = self.mayEdit
    withRefresh = self.withRefresh

    button = (
        H.icon(
            N.eye,
            cls="button small",
            action=N.view,
            **atts,
        )
        if editable else
        (
            H.icon(
                N.pencil,
                cls="button small",
                action=N.edit,
                **atts,
            )
            if mayEdit else
            H.icon(
                N.refresh,
                cls="button small",
                action=N.view,
                title=REFRESH,
                **atts,
            )
            if withRefresh else
            E
        )
    )

    return [button, self.wrapValue(editable)]

  def wrapValue(self, editable):
    db = self.db
    auth = self.auth
    tpClass = self.tpClass
    value = self.value
    tp = self.tp
    multiple = self.multiple
    extensible = self.extensible
    widgetType = self.widgetType

    cls = "tags" if widgetType == N.related else "values"
    collapseMultiple = widgetType == N.related

    args = []
    if collapseMultiple and editable:
      args.append(multiple)
      args.append(extensible)
    if tpClass.needsField:
      args.extend([db, auth])
    method = tpClass.widget if editable else tpClass.toDisplay
    atts = dict(wtype=widgetType)

    if editable:
      origStr = Types.toOrig(value, tp, multiple)
      atts[N.orig] = origStr
    if multiple:
      atts[N.multiple] = ONE
    if extensible:
      atts[N.extensible] = ONE

    return (
        H.div(
            [
                method(val, *args)
                for val in (value or []) + ([E] if editable else [])
            ],
            **atts,
            cls=cls,
        )
        if multiple and not (editable and collapseMultiple) else
        H.div(
            method(value, *args),
            **atts,
            cls="value",
        )
    )
