from itertools import chain
from bson.objectid import ObjectId

from controllers.utils import now, filterModified


class Db(object):
  def __init__(self, mongo, Config, Names):
    self.mongo = mongo
    self.names = Names
    self.config = Config

  def collect(self):
    mongo = self.mongo

    for table in f'''
        country
        criteria
        decision
        discipline
        keyword
        package
        permissionGroup
        score
        tadirahActivity
        tadirahObject
        tadirahTechnique
        typeContribution
        user
        vcc
        year
    '''.strip().split():
      setattr(
          self,
          table,
          {
              record['_id']: record
              for record in mongo[table].find()
          },
      )
    for table in f'''
        permissionGroup
    '''.strip().split():
      setattr(
          self,
          f'{table}Inv',
          {
              record['rep']: record['_id']
              for record in mongo[table].find()
          },
      )

    self.collectActiveItems()

  def collectActiveItems(self):
    mongo = self.mongo

    present = now()
    self.packageActive = {
        record['_id']
        for record in mongo.package.find(
            {
                'startDate': {'$lte': present},
                'endDate': {'$gte': present},
            },
        )
    }
    self.typeActive = set(chain.from_iterable(
        record.get('typeContribution', [])
        for (_id, record) in self.package.items()
        if _id in self.packageActive
    ))

    self.criteriaActive = {
        _id
        for (_id, record) in self.criteria.items()
        if record['package'] in self.packageActive
    }
    self.typeCriteria = {}
    for (_id, record) in self.criteria.items():
      if _id not in self.criteriaActive:
        continue
      for tp in record.get('typeContribution', []):
        self.typeCriteria.setdefault(tp, set()).add(_id)

  def getItem(self, table, eid):
    mongo = self.mongo

    records = list(
        mongo[table].find({'_id': ObjectId(eid)})
    )
    record = (
        records[0]
        if len(records) else
        {}
    )
    return record

  def getField(
      self,
      record,
      fieldName,
      relTable=None,
      multiple=False,
  ):
    relTable = relTable or fieldName
    rawValue = record.get(fieldName, None) or ([] if multiple else None)
    valTable = getattr(self, relTable, {})
    return (
        [
            valTable.get(rawVal, {})
            for rawVal in rawValue
        ]
        if multiple else
        valTable.get(rawValue, {})
    )

  def saveField(
      self,
      table,
      eid,
      field,
      data,
      actor,
      modified,
  ):
    mongo = self.mongo
    N = self.names

    newModified = filterModified(
        (modified or []) + [f'{actor} on {now()}']
    )
    update = {
        field: data,
        N.modified: newModified,
    }
    delete = {N.isPristine: ''}

    mongo[table].update_one(
        {'_id': ObjectId(eid)},
        {
            '$set': update,
            '$unset': delete,
        },
    )
    return (
        update,
        set(delete.keys()),
    )
