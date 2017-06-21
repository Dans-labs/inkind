model = {'generic': {'createdDate': 'dateCreated', 'createdBy': 'creator', 'modified': 'modified', 'title': 'rep', 'sort': [['rep', 1]]}, 'tables': {'user': {'title': 'eppn', 'sort': [['lastName', 1], ['firstName', 1], ['eppn', 1]], 'fieldOrder': ['eppn', 'email', 'firstName', 'lastName', 'mayLogin', 'authority', 'dateLastLogin', 'statusLastLogin', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'eppn': {'label': 'Eppn', 'valType': 'text', 'multiple': False}, 'email': {'label': 'Email', 'valType': 'email', 'multiple': False}, 'firstName': {'label': 'First name', 'valType': 'text', 'multiple': False}, 'lastName': {'label': 'Last name', 'valType': 'text', 'multiple': False}, 'mayLogin': {'label': 'Login allowed', 'valType': 'bool', 'multiple': False}, 'authority': {'label': 'Authentication authority', 'valType': 'text', 'multiple': False}, 'dateModified': {'label': 'modified on', 'valType': 'datetime', 'multiple': True}, 'dateLastLogin': {'label': 'last logged in on', 'valType': 'datetime', 'multiple': False}, 'statusLastLogin': {'label': 'Status last login', 'valType': 'text', 'multiple': False}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}}, 'country': {'title': 'name', 'sort': [['name', 1]], 'fieldOrder': ['iso', 'name', 'isMember', 'latitude', 'longitude', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'iso': {'label': 'ISO(2)', 'valType': 'text', 'valid': 'isoCountry', 'multiple': False, 'grid': {'width': '2em', 'grow': 0}}, 'name': {'label': 'Name', 'valType': 'text', 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'isMember': {'label': 'Is DARIAH member', 'valType': 'bool', 'multiple': False, 'grid': {'width': '4em', 'grow': 0}}, 'latitude': {'label': 'Latitude', 'valType': 'number', 'multiple': False, 'grid': {'width': '4em', 'grow': 0.5, 'shrink': 0}}, 'longitude': {'label': 'Longitude', 'valType': 'number', 'multiple': False, 'grid': {'width': '4em', 'grow': 0.5, 'shrink': 0}}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True, 'grid': {'width': '10em', 'grow': 1}}}}, 'typeContribution': {'title': 'subType', 'sort': [['mainType', 1], ['subType', 1]], 'fieldOrder': ['mainType', 'subType', 'explanation', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'mainType': {'label': 'Main type', 'valType': 'text', 'multiple': False, 'grid': {'width': '10em', 'grow': 0}}, 'subType': {'label': 'Subtype', 'valType': 'text', 'multiple': False, 'grid': {'width': '10em', 'grow': 0}}, 'explanation': {'label': 'Explanation', 'valType': 'textarea', 'multiple': True, 'grid': {'width': '20em', 'grow': 1}}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True, 'grid': {'width': '10em', 'grow': 1}}}}, 'contrib': {'title': 'title', 'sort': [['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'year', 'country', 'vcc', 'typeContribution', 'description', 'costTotal', 'costDescription', 'contactPersonName', 'contactPersonEmail', 'urlContribution', 'urlAcademic', 'tadirahObject', 'tadirahActivity', 'tadirahTechnique', 'discipline', 'keyword', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'contactPersonName': {'label': 'contact person', 'valType': 'text', 'multiple': False}, 'contactPersonEmail': {'label': 'contact email', 'valType': 'email', 'multiple': True}, 'urlContribution': {'label': 'Contribution url', 'valType': 'url', 'multiple': True}, 'urlAcademic': {'label': 'Academic url', 'valType': 'url', 'multiple': True}, 'description': {'label': 'Description', 'valType': 'textarea', 'multiple': False}, 'costTotal': {'label': 'cost (total)', 'valType': 'number', 'multiple': False}, 'costDescription': {'label': 'cost (description)', 'valType': 'textarea', 'multiple': False}, 'country': {'label': 'Country(ies)', 'valType': {'values': 'country', 'select': {'isMember': True}, 'allowNew': False}, 'multiple': False}, 'year': {'label': 'Year', 'valType': {'values': 'year', 'allowNew': True}, 'multiple': False}, 'vcc': {'label': 'VCC', 'valType': {'values': 'vcc', 'allowNew': False}, 'multiple': True}, 'discipline': {'label': 'Disciplines', 'valType': {'values': 'discipline', 'allowNew': True}, 'multiple': True}, 'keyword': {'label': 'Keywords', 'valType': {'values': 'keyword', 'allowNew': True}, 'multiple': True}, 'typeContribution': {'label': 'Type', 'valType': {'values': 'typeContribution', 'allowNew': False, 'inactive': {'className': 'inactive', 'title': 'this value does not belong to the current package'}}, 'multiple': False}, 'typeContributionOther': {'label': 'Type', 'valType': {'values': 'typeContribution', 'allowNew': True}, 'multiple': True}, 'tadirahObject': {'label': 'Object(s)', 'valType': {'values': 'tadirahObject', 'allowNew': False}, 'multiple': True}, 'tadirahActivity': {'label': 'Activity(ies)', 'valType': {'values': 'tadirahActivity', 'allowNew': False}, 'multiple': True}, 'tadirahTechnique': {'label': 'Technique(s)', 'valType': {'values': 'tadirahTechnique', 'allowNew': False}, 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'filters': [{'field': 'title', 'label': 'title', 'type': 'Fulltext', 'maxCols': None, 'expanded': None}, {'field': 'country', 'label': 'country', 'type': 'EUMap', 'maxCols': 2, 'expanded': True}, {'field': 'vcc', 'label': 'vcc', 'type': 'ByValue', 'maxCols': 2, 'expanded': True}, {'field': 'year', 'label': 'year', 'type': 'ByValue', 'maxCols': 3, 'expanded': False}, {'field': 'typeContribution', 'label': 'type', 'type': 'ByValue', 'maxCols': 2, 'expanded': True}, {'field': 'tadirahActivity', 'label': 'research activity', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'tadirahObject', 'label': 'research object', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'tadirahTechnique', 'label': 'research technique', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}, {'field': 'discipline', 'label': 'discipline', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'keyword', 'label': 'keyword', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}]}, 'package': {'title': 'title', 'sort': [['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'startDate', 'endDate', 'typeContribution', 'notes', 'criteria', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'startDate': {'label': 'start date', 'valType': 'datetime', 'multiple': False}, 'endDate': {'label': 'end date', 'valType': 'datetime', 'multiple': False}, 'typeContribution': {'label': 'Type', 'valType': {'values': 'typeContribution', 'allowNew': True}, 'multiple': True}, 'notes': {'label': 'Notes', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'detailOrder': ['criteria'], 'details': {'criteria': {'label': 'Assessment criteria', 'table': 'criteria', 'linkField': 'package', 'mode': 'list', 'filtered': True}}}, 'criteria': {'title': 'key', 'sort': [['package', 1], ['key', 1]], 'fieldOrder': ['key', 'package', 'typeContribution', 'criterion', 'notes', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'key': {'label': 'Key', 'valType': 'text', 'multiple': False}, 'package': {'label': 'Package', 'valType': {'values': 'package', 'allowNew': True}, 'multiple': False}, 'typeContribution': {'label': 'Type', 'valType': {'values': 'typeContribution', 'allowNew': True}, 'multiple': True}, 'criterion': {'label': 'Criterion', 'valType': 'textarea', 'multiple': False}, 'notes': {'label': 'Notes', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'filters': [{'field': 'typeContribution', 'label': 'type', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}]}}}
class DataModel(object):
    def __init__(self):
        for (k, v) in model.items():
            setattr(self, k, v)
