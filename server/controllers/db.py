import json, datetime
from bottle import request, install, JSONPlugin
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

def oid(oidstr):
    return ObjectId() if oidstr == None else ObjectId(oidstr) 

def now(): return datetime.utcnow()

def dtm(isostr):
    isostr = isostr.rstrip('Z')
    try:
        date = datetime.strptime(isostr, "%Y-%m-%dT%H:%M:%S.%f")
    except:
        try:
            date = datetime.strptime(isostr, "%Y-%m-%dT%H:%M:%S")
        except Exception as err:
            return ('{}'.format(err), isostr)
    return ('', date)

def json_string(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError('Not sure how to serialize %s' % (obj,))

# We store the mongo db connection here as a module global variable
# No other module is supposed to import the connection
# Only the DbAccess methods are supposed to eaccess the db.
# All methods in DbAccess perform access control, based on the data model and the permission model.
# So: if these methods are fully debugged, and all Db access goes through these methods,
# it is guaranteed that every bit of data coming out of the Db and being sent to the client,
# complies with the configured permissions.

_DBM = None 

class DbAccess(object):
    def __init__(self, DM):
        global _DBM
        self.DM = DM
        install(JSONPlugin(json_dumps=lambda body: json.dumps(body, default=json_string)))
        clientm = MongoClient()
        _DBM = clientm.dariah
# the fields 'creator', 'dateCreated' and 'modified' are under system control.
        self.SYSTEM_FIELDS = {
            self.DM.generic['createdDate'],
            self.DM.generic['createdBy'],
            self.DM.generic['modified'],
        }

    def userFind(self, eppn, authority): return _DBM.user.find_one({'eppn': eppn, 'authority': authority})
    def userLocal(self): return _DBM.user.find({'authority': 'local'})
    def userInGroup(self): return _DBM.inGroup.find({})
    def userAdd(self, record): _DBM.user.insert_one(record)
    def userMod(self, record): _DBM.user.update_one({'eppn': record['eppn']}, {'$set': record})

    def validate(self, table, itemValues, uFields):
        tableInfo = self.DM.tables.get(table, {})
        modified = self.DM.generic['modified']
        fieldSpecs = dict(x for x in tableInfo.get('fieldSpecs', {}).items() if x[0] in itemValues)
        valItemValues = dict()
        newValues = []
        for (f, values) in itemValues.items():
            if f == '_id':
                valItemValues[f] = (True, {}, [], oid(values))
                continue
            valType = fieldSpecs[f]['valType']
            multiple = fieldSpecs[f]['multiple']

            if multiple: values = [] if values == None else values
            else: values = [values] if values != None else []
            valid = True
            valValues = []
            diags = []
            msgs = []
            if f not in uFields:
# if the current user has no update access to a system field, the received value is discarded.
# later on, the system will append the correct value
                if f not in self.SYSTEM_FIELDS:
                    valid = False
                    diags.append('{} not accessible'.format(f))
            elif type(valType) is str:
                if valType == 'datetime':
                    good = True
                    valValues = []
                    for v in values:
                        (err, dv) = dtm(v)
                        if err:
                            good = False
                            diags.append('not a valid datetime [{}] ({})'.format(dv, err))
                        else:
                            diags.append(None)
                            valValues.append(dv)
                    if not good:
                        valid = False
                else:
                    valValues = [v for v in values]
            else: 
                valueLists = self.getValueLists(table, {}, msgs, noTables=True)
                if len(msgs):
                    valid = False
                    diags.append('Could not get the valuelists')
                else:
                    allowNew = valType['allowNew']
                    relTable = valType['values']
                    for v in values:
                        if v not in valueLists.get(f, {}):
                            if not allowNew:
                                valid = False
                                diags.append('Unknown value "{}"'.format(v))
                            else:
                                result = _DBM[f].insert_one(dict(rep=v))
                                _id = result.inserted_id
                                valValues.append(result.inserted_id)
                                newValues.append(dict(_id=_id, rep=v, relTable=relTable, field=f))
                                diags.append(None)
                        else:
                            valValues.append(oid(v))
                            diags.append(None)

            if not multiple:
                valValues = None if valValues == [] else valValues[0]
                diags = None if diags == [] else diags[0]
            valItemValues[f] = (valid, diags, msgs, valValues)
        return (valItemValues, newValues)

    def _getList(
            self, controller, table,
            data, msgs,
            rFilter=None, titleOnly=False,
            withValueLists=True, withDetails=True,
            my=False,
        ):
        if table in data: return
        Perm = self.Perm
        tableInfo = self.DM.tables.get(table, {})
        title = tableInfo.get('title', self.DM.generic['title'])
        item = tableInfo.get('item', self.DM.generic['item'])
        sort =  tableInfo.get('sort', None)
        (mayInsert, iFields) = Perm.may(table, 'insert')
        perm = dict(insert=mayInsert)
        orderKey = 'myIds' if my else 'allIds' 
        none = {table: {orderKey: [], 'entities': {}, 'fields': {}, 'perm': {}}}
        (good, result) = Perm.getPerm(controller, table, 'list')
        if not good:
            msgs.append(dict(kind='error', text=result or 'Cannot list {}'.format(table)))
            return
        (rowFilter, fieldFilter) = result
        details = tableInfo.get('details', {})
        detailOrder = tableInfo.get('detailOrder', [])
        fieldOrder = [x for x in tableInfo.get('fieldOrder', []) if x in fieldFilter]
        fieldSpecs = dict(x for x in tableInfo.get('fieldSpecs', {}).items() if x[0] in fieldOrder)
        core = set()
        core.add(title)
        core |= {f['field'] for f in tableInfo.get('filters', [])}
        coreFields = dict(_id=True)
        getFields = set(fieldFilter)
        for f in getFields:
            coreFields[f] = True

        theFieldFilter = coreFields if titleOnly else fieldFilter 
        if rFilter != None:
            rowFilter.update(rFilter)
        if sort == None:
            documents = list(_DBM[table].find(rowFilter, theFieldFilter))
        else:
            documents = list(_DBM[table].find(rowFilter, theFieldFilter).sort(sort))
        allIds=[d['_id'] for d in documents]
        entities=dict((str(d['_id']), dict(values=dict((f, d[f]) for f in d if (not titleOnly or f in coreFields)))) for d in documents)
        if not titleOnly:
            for d in documents:
                (mayDelete, dFields) = Perm.may(table, 'delete', document=d)
                (mayUpdate, uFields) = Perm.may(table, 'update', document=d)
                thisPerm = dict(update=uFields, delete=mayDelete)
                entities[str(d['_id'])]['perm'] = thisPerm

        result = dict(
            entities=entities,
            fields=theFieldFilter,
            title=title,
            item=item,
            perm=perm,
            fieldOrder=fieldOrder,
            fieldSpecs=fieldSpecs,
            details=details,
            detailOrder=detailOrder,
            complete=not titleOnly,
        )
        if my: result['myIds'] = allIds
        else: result['allIds'] = allIds

        data[table] = result
        data[table]['filterList'] = tableInfo.get('filters', [])
        if withValueLists: data[table]['valueLists'] = self.getValueLists(table, data, msgs)
        if withDetails: self.getDetails(table, data, msgs)
        return

    def getList(
            self, controller, table,
            rFilter=None, titleOnly=False,
            withValueLists=True, withDetails=True,
            my=False,
        ):
        data = dict()
        msgs = []
        self._getList(
            controller, table,
            data,
            msgs,
            rFilter=rFilter, titleOnly=titleOnly,
            withValueLists=withValueLists, withDetails=withDetails,
            my=my,
        )
        return self.stop(data=data, msgs=msgs)

    def getValueLists(self, table, data, msgs, noTables=False):
        Perm = self.Perm
        (good, result) = Perm.getPerm('list', table, 'list')
        if not good: return dict()
        tableInfo = self.DM.tables.get(table, {})
        valueLists = {}
        (rowFilter, fieldFilter) = result
        getFields = set(fieldFilter)
        fieldOrder = [x for x in tableInfo.get('fieldOrder', []) if x in fieldFilter]
        fieldSpecs = dict(x for x in tableInfo.get('fieldSpecs', {}).items() if x[0] in fieldOrder)

        relFields = [
            f for (f, fSpec) in fieldSpecs.items()\
                if f in getFields and\
                type(fSpec['valType']) is dict
        ]  
        relTables = {fieldSpecs[f]['valType']['values'] for f in relFields}
        good = True
        if not noTables:
            for t in relTables:
                self._getList('list', t, data, msgs, titleOnly=False)

        for f in relFields:
            fSpec = fieldSpecs[f]['valType']
            t = fSpec['values']
            thisTableInfo = self.DM.tables.get(t, {})
            select = fSpec.get('select', {})
            valueOrder = thisTableInfo.get('sort', self.DM.generic['sort'])
            rows = [str(row['_id']) for row in _DBM[t].find(select, dict(_id=True)).sort(valueOrder)]
            valueLists[f] = rows
        return valueLists

    def getDetails(self, table, data, msgs):
        Perm = self.Perm
        tableInfo = self.DM.tables.get(table, {})
        details = tableInfo.get('details', {})
        msgs = []
        for (name, detailProps) in details.items():
            t = detailProps['table']
            self._getList('list', t, data, msgs, titleOnly=False)

    def getItem(self, controller, table, ident):
        Perm = self.Perm
        none = {}
        (good, result) = Perm.getPerm(controller, table, 'read')
        if not good:
            return self.stop(text=result or 'Cannot read {}'.format(table))
        tableInfo = self.DM.tables.get(table, {})
        (rowFilter, fieldFilter) = result
        fieldOrder = [x for x in tableInfo.get('fieldOrder', []) if x in fieldFilter]
        fieldSpecs = dict(x for x in tableInfo.get('fieldSpecs', {}).items() if x[0] in fieldOrder)
        rowFilter.update({'_id': oid(ident)})
        documents = list(_DBM[table].find(rowFilter, fieldFilter))

        ldoc = len(documents)
        if ldoc == 0:
            return self.stop(data=none, text='{} item does not exist'.format(table))
        document = documents[0]
        (mayDelete, dFields) = Perm.may(table, 'delete', document=document)
        (mayUpdate, uFields) = Perm.may(table, 'update', document=document)
        perm = dict(update=uFields, delete=mayDelete)
        return self.stop(data=dict(values=document, perm=perm, fields=fieldFilter))

    def modList(self, controller, table, action):
        Perm = self.Perm
        modified = self.DM.generic['modified']
        (good, result) = Perm.getPerm(controller, table, action)
        none = '' if action == 'insert' else {}
        if not good:
            return self.stop(data=none, text=result or 'Cannot do {} in table {}'.format(table, action))

        (rowFilter, fieldFilter) = result

        if action == 'insert':
            newData = request.json
            masterId = newData.get('masterId', None)
            linkField = newData.get('linkField', None)
            tableInfo = self.DM.tables.get(table, {})
            title = tableInfo.get('title', self.DM.generic['title'])
            sort = tableInfo.get('title', self.DM.generic['sort'])
            modified = self.DM.generic['modified']
            modDate = now()
            modBy = self.eppn
            createdDate = self.DM.generic['createdDate']
            createdBy = self.DM.generic['createdBy']
            insertValues = {
                title: 'no title',
                createdDate: now(),
                createdBy: self.uid,
                modified: ['{} on {}'.format(modBy, modDate)],
            }
            if masterId != None and linkField != None:
                insertValues[linkField] = oid(masterId)
            result = _DBM[table].insert_one(insertValues)
            ident = result.inserted_id
            (readGood, readResult) = Perm.getPerm(controller, table, 'read')
            if not readGood:
                return self.stop(data=none, text=readResult or 'Cannot read table {}'.format(table))
            (readRowFilter, readFieldFilter) = readResult
            documents = list(_DBM[table].find(dict(_id=ident), readFieldFilter))
            ldoc = len(documents)
            if ldoc == 0:
                return self.stop(data=none, text='failed to insert new item into {}'.format(table))
            document = documents[0]
            (mayDelete, dFields) = Perm.may(table, 'delete', document=document)
            (mayUpdate, uFields) = Perm.may(table, 'update', document=document)
            perm = dict(update=uFields, delete=mayDelete)
            return self.stop(data=dict(values=document, perm=perm, fields=readFieldFilter))

        elif action == 'delete':
            newData = request.json
            ident = newData.get('_id', None)
            if ident == None:
                return self.stop(data=none, text='Not specified which item to delete')
            rowFilter.update({'_id': oid(ident)})
            documents = list(_DBM[table].find(rowFilter, {'_id': True}))
            if len(documents) != 1:
                return self.stop(data=none, text='Unidentified item to delete')
            document = documents[0]
            (mayDelete, dFields) = Perm.may(table, 'delete', document=document)
            if not mayDelete:
                return self.stop(data=none, text='Not allowed to delete this item')
            else:
                _DBM[table].delete_one(rowFilter)
                return self.stop(data=str(ident))

        elif action == 'update':
            newData = request.json
            ident = newData.get('_id', None)
            if ident == None:
                return self.stop(data=none, text='Not specified which item to update')
            rowFilter.update({'_id': oid(ident)})
            documents = list(_DBM[table].find(rowFilter))
            if len(documents) != 1:
                return self.stop(data=none, text='Unidentified item to update')
            document = documents[0]
            (mayUpdate, uFields) = Perm.may(table, 'update', document=document)
            if not mayUpdate:
                return self.stop(data=none, text='Not allowed to update this item')
            newValues = dict(x for x in newData.get('values', {}).items())
            (valItemValues, newValues) = self.validate(table, newValues, uFields)
            validationMsgs = []
            validationDiags = {}
            updateValues = dict()
            stop = False
            for (f, (valid, diags, msgs, vals)) in sorted(valItemValues.items()):
                if valid:
                    updateValues[f] = vals
                else:
                    stop = True
                    validationMsgs.extend(msgs)
                    validationDiags[f] = diags
            if stop:
                invalidFields = ', '.join(sorted(validationDiags))
                validationDiags['_error'] = 'invalid values in fields {}'.format(invalidFields)
                validationMsgs.append(dict(kind='warning', text='table {}, item {}: invalid values in {}'.format(table, ident, invalidFields)))
                return self.stop(data=validationDiags, msgs=validationMsgs)
            modDate = now()
            modBy = self.eppn
            updateSaveValues = {}
            updateSaveValues.update(updateValues) # shallow copy of updateValues
            for sysField in self.SYSTEM_FIELDS:
                if sysField not in updateValues or updateValues[sysField] == None:
                        updateSaveValues[sysField] = document[sysField] # add the system field

            updateSaveValues[modified].append('{} on {}'.format(modBy, modDate))
            _DBM[table].update_one(rowFilter, {'$set': updateSaveValues }) # system values are updated in the database
            return self.stop(data=dict(values=updateSaveValues, newValues=newValues)) # ??? but modified is not always returned

    def stop(self, data=None, text=None, msgs=None):
        good = text == None and (msgs == None or len(msgs) == 0)
        msgs = [] if good else [dict(kind='error', text=text)] if msgs == None else msgs
        return dict(data=data, msgs=msgs, good=good)

