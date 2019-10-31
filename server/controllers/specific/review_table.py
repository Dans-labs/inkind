from bson.objectid import ObjectId

from controllers.config import Names as N
from controllers.utils import pick as G
from controllers.table import Table


class ReviewT(Table):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)

  def insert(self, masterTable=None, masterId=None):
    mayInsert = self.mayInsert
    if not mayInsert:
      return None

    if not masterTable or not masterId:
      return None

    control = self.control
    db = control.db
    uid = self.uid
    eppn = self.eppn
    table = self.table

    masterOid = ObjectId(masterId)
    masterRecord = control.getItem(N.assessment, masterOid)
    contribId = G(masterRecord, N.contrib)
    if not contribId:
      return None

    wfitem = control.getWorkflowItem(contribId)

    if not wfitem.permission(N.assessment, masterOid, N.startReview):
      return contribId

    (contribType,) = wfitem.attributes(
        N.contrib, contribId,
        N.type,
    )
    assessmentTitle = wfitem.attributes(
        N.assessment, masterOid,
        N.title,
    )

    fields = {
        N.contrib: contribId,
        masterTable: masterOid,
        N.reviewType: contribType,
        N.title: f"review of {assessmentTitle}",
    }
    reviewId = db.insertItem(table, uid, eppn, **fields)

    criteriaEntries = db.getDetails(
        N.criteriaEntry,
        N.assessment,
        masterOid,
        sortKey=lambda r: G(r, N.seq, default=0),
    )
    records = [
        {
            N.seq: G(critEntry, N.seq, default=0),
            N.criteria: G(critEntry, N.criteria),
            N.criteriaEntry: G(critEntry, N._id),
            N.assessment: masterOid,
            N.review: reviewId,
        }
        for critEntry in criteriaEntries
    ]
    db.insertMany(N.reviewEntry, uid, eppn, records)
    self.adjustWorkflow(contribId, new=False)

    return contribId
