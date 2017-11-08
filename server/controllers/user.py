from datetime import datetime

class UserApi(object):
    def __init__(self, DB, PM):
        self.DB = DB
        self.PM = PM

    def getUser(self, eppn, email=None):
        return self.DB.userFind(eppn, email, authority = 'local' if self.isDevel else 'DARIAH')

    def getTestUsers(self):
        testUsers = {}
        records = self.DB.userLocal() 
        for r in records:
            testUsers[r['eppn']] = r
        return testUsers

    def storeUpdate(self, newUserInfo):
        eppn = newUserInfo['eppn']
        email = newUserInfo['email']
        record = self.getUser(eppn, email=email)
        if not record:
            record = self._store(newUserInfo)
        else:
            record = self._update(record, newUserInfo)
        return record

    def deliver(self):
        unauth = self.idFromGroup[self.PM.unauth]
        groups = self.PM.groups
        groupId = self.userInfo.get('group', unauth)
        group = self.groupFromId[groupId]
        self.userInfo['groupRep'] = group
        self.userInfo['groupDesc'] = groups.get(group, '??')
        return dict(data=self.userInfo, msgs=[], good=True)

    def _store(self, newUserInfo):
        now = datetime.utcnow()
        record = {}
        record.update(newUserInfo)
        record.update(dict(
            dateCreated=now,
            dateModified=now,
            dateLastLogin=now,
            statusLastLogin='Approved',
            mayLogin=True,
        ))
        self.DB.userAdd(record)
        return record

    def _update(self, userInfo, newUserInfo):
        eppn = newUserInfo['eppn']
        now = datetime.utcnow()
        userInfo.update(newUserInfo)
        userInfo.update(dict(
            dateModified=now,
            dateLastLogin=now,
            statusLastLogin='Approved' if userInfo.get('mayLogin', False) else 'Rejected',
        ))
        self.DB.userMod(userInfo)
        if '_id' in userInfo: del userInfo['_id']
        return userInfo

