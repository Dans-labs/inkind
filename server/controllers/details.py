from controllers.config import Config as C, Names as N
from controllers.utils import E
from controllers.html import HtmlElements as H

CT = C.tables

DETAILS = CT.details


class Details(object):
  inheritProps = (
      N.control, N.db, N.auth, N.types,
      'uid', 'eppn',
      'Table', 'table',
      'record', 'eid',
      'fields', 'prov',
  )

  def __init__(self, recordObj):
    for prop in Details.inheritProps:
      setattr(self, prop, getattr(recordObj, prop, None))

    self.details = {}

  def fetchDetails(self, dtable, masterTable=None, eids=None, sortKey=None):
    control = self.control
    db = self.db
    Table = self.Table
    table = self.table
    eid = self.eid

    dtableObj = Table(control, dtable)
    drecords = db.getDetails(
        dtable,
        masterTable or table,
        eids or eid,
        sortKey=sortKey,
    )
    self.details[dtable] = (
        dtableObj,
        tuple(drecords),
    )

  def wrap(self):
    table = self.table

    for dtable in DETAILS.get(table, []):
      self.fetchDetails(dtable)

    return self.wrapAll()

  def wrapDetail(self, dtable, extraMsg=None, extraCls=None):
    details = self.details

    (dtableObj, drecords) = details.get(dtable, (None, []))
    if not dtableObj:
      return E

    nRecords = len(drecords)
    (itemSingular, itemPlural) = dtableObj.itemLabels
    itemLabel = itemSingular if nRecords == 1 else itemPlural

    nRep = H.div(f"""{nRecords} {itemLabel}""", cls="stats")
    return H.div(
        [
            H.div(extraMsg, cls=extraCls) if extraMsg else E,
            nRep,
        ]
        +
        [
            dtableObj.record(record=drecord).wrap(collapsed=True)
            for drecord in drecords
        ],
        cls=f"record-details",
    )

  def wrapAll(self):
    details = self.details

    return E.join(
        self.wrapDetail(dtable)
        for dtable in details
    )