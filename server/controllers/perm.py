from controllers.utils import oid, serverprint
from models.compiled.model import model as M
from models.compiled.names import N

DM = M[N.tables]
PM = M[N.permissions]


class PermApi(object):
    def __init__(self, Auth):

        self.userInfo = Auth.userInfo
        self.uid = self.userInfo.get(N._id, None)
        self.eppn = self.userInfo.get(N.eppn, None)
        self.group = self.userInfo[N.groupRep]
        self.rank = {lev: n for (n, lev) in enumerate(PM[N.levels])}
        self.DB = Auth.DB

    def getUid(self):
        return self.uid

    def getEppn(self):
        return self.eppn

    def allow(
        self,
        table,
        action,
        msgs,
        controller=None,
        document=None,
        newValues=None,
        extraMy=None,
        verbose=True,
    ):
        # sanity checks
        # does the action exist?
        actions = PM[N.actions]
        if action not in actions:
            if verbose:
                msgs.append({
                    N.kind: N.error,
                    N.text: 'Unknown action {}'.format(action),
                })
            return (False, None, None)

        # determine the access level that is required for this action
        # level on the basis of the table and the action
        permT = DM.get(table, {}).get(N.perm, {}).get(action, None)
        if permT is None:
            if verbose:
                msgs.append({
                    N.kind:
                        N.error,
                    N.text:
                        'Action {} not allowed for table {} '
                        .format(action, table),
                })
            return (False, None, None)

        # level on the basis of the controller
        if controller is None:
            perm = permT
        else:
            methods = PM[N.methods]
            permC = methods.get(controller, {}).get(N.call, None)
            if permC is None:
                if verbose:
                    msgs.append({
                        N.kind:
                            N.error,
                        N.text:
                            'Not allowed to execute controller {}'
                            .format(controller),
                    })
                return (False, None, None)
            # take the strictest access level
            # that the controller and the table require
            perm = self._highestLevel((permC, permT))

        # determine whether the action is allowed
        isOwn = False
        isEditor = False
        if document is None:
            allowed = self._authorize(perm, asList=True)
        else:
            isOwn = self._isOwn(table, document)
            isEditor = self._isEditor(table, document)
            allowed = self._authorize(
                perm, asList=False, isOwn=isOwn, isEditor=isEditor
            )

        if not allowed:
            if verbose:
                msgs.append({
                    N.kind:
                        N.error,
                    N.text:
                        'You are not allowed to perform {} on table {}{}'
                        .format(
                            action,
                            table,
                            '' if document is None else
                            ' on this particular document',
                        ),
                })
            return (False, None, None)

        # compute the rowFilter
        if action == N.insert:
            rowFilter = None
        elif document is None:
            if allowed == 1:
                rowFilter = True
            else:
                owners = PM[N.owners]
                ownField = owners.get(table, N.creator)
                if allowed == -1:
                    rowFilter = {ownField: self.uid}
                elif allowed == -2:
                    rowFilter = {
                        '$or': [{
                            ownField: self.uid
                        }, {
                            N.editors: self.uid
                        }]
                    }
        else:
            rowFilter = None

        # compute the fieldSet
        fieldSet = set()
        fields = DM.get(table, {}).get(N.fieldSpecs, {})

        for field in fields:
            permF = fields[field].get(N.perm, {}).get(action, None)
            if permF is None:
                continue
            if document is not None:
                if permF == N.ownLT:
                    oldValueId = document.get(field, None)
                    oldValue = (
                        None if oldValueId is None else
                        self.DB.groupFromId[oid(oldValueId)]
                    )
                    group = self.group
                    if oldValue is not None:
                        uid = document[N._id]
                        if uid != self.uid and self.rank[oldValue
                                                         ] >= self.rank[group]:
                            if verbose:
                                msgs.append({
                                    N.kind:
                                        N.error,
                                    N.text:
                                        '''Cannot change permission role:
                                        the other user is a {} with at least
                                        as much power as you have as {}'''
                                        .format(oldValue, group),
                                })
                            continue
                    if newValues is not None:
                        newValueId = newValues.get(field, None)
                        newValue = (
                            None if newValueId is None else
                            self.DB.groupFromId[oid(newValueId)]
                        )
                        if newValue is not None and newValue in {N.own, N.nobody}:
                            if verbose:
                                msgs.append({
                                    N.kind:
                                        N.error,
                                    N.text:
                                        '''Cannot change permission role:
                                        {} is not an assignable role'''
                                        .format(newValue),
                                })
                            continue
                        elif newValue is not None and newValue not in self.rank:
                            if verbose:
                                msgs.append({
                                    N.kind:
                                        N.error,
                                    N.text:
                                        '''Cannot change permission role:
                                        the power of role {} is unknown'''
                                        .format(newValue),
                                })
                            continue
                        elif newValue is not None and self.rank[newValue] > self.rank[group]:
                            if verbose:
                                msgs.append({
                                    N.kind:
                                        N.error,
                                    N.text:
                                        '''Cannot change permission role:
                                        the role {} has more power
                                        than you have as {}'''
                                        .format(newValue, group),
                                })
                            continue
            if self._authorize(
                permF, asList=document is None, isOwn=isOwn, isEditor=isEditor
            ):
                fieldSet.add(field)
            serverprint(fieldSet)
        return (True, rowFilter, fieldSet)

    def _isOwn(self, table, document):
        owners = PM[N.owners]
        ownField = owners.get(table, N.creator)
        if ownField is None or ownField not in document:
            return False
        return document[ownField] == self.uid

    def _isEditor(self, table, document):
        if self._isOwn(table, document):
            return True
        if N.editors not in document:
            return False
        return self.uid in set(document[N.editors])

    def _authorize(self, perm, asList=False, isOwn=None, isEditor=None):
        group = self.group
        authorize = PM[N.authorize]
        may = authorize.get(group, {}).get(perm, 0)
        if asList:
            return may
        if may == -1 and isOwn is False:
            may = 0
        if may == -2 and isOwn is False and isEditor is False:
            may = 0
        return may

    def _orderLevels(self, levs):
        rank = self.rank
        return sorted(levs, key=lambda lv: rank[lv])

    def _highestLevel(self, levs):
        return self._orderLevels(levs)[-1]
