from controllers.config import Config as C, Names as N
from controllers.html import HtmlElements as H
from controllers.utils import E
from controllers.record import Record


CW = C.web
CT = C.tables

CONSTRAINED = CT.constrained

MESSAGES = CW.messages


class CriteriaR(Record):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)

  def wrapHelp(self, typeOk, cls):
    info = E.join(
        self.field(field, readonly=False).wrap(action=N.view)
        for field in [N.typeContribution, N.remarks]
        if not typeOk or field != N.typeContribution
    )

    detailsObj = self.detailsFactory()
    detailsObj.fetchDetails(N.score)
    details = detailsObj.wrapDetail(
        N.score, expanded=True, readonly=True,
        wrapMethod=N.wrapHelp,
        combineMethod=lambda x: [H.dl(x)],
    )

    return H.div(
        info + details,
        cls="criteriahelp",
    )