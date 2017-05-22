model = {'generic': {'createdDate': 'dateCreated', 'createdBy': 'creator', 'modified': 'modified', 'sort': [['rep', 1]]}, 'tables': {'user': {'title': 'eppn', 'sort': [['lastName', 1], ['firstName', 1], ['eppn', 1]], 'fieldOrder': ['eppn', 'email', 'firstName', 'lastName', 'mayLogin', 'authority', 'dateModified', 'dateLastLogin', 'statusLastLogin'], 'fieldSpecs': {'eppn': {'label': 'Eppn', 'valType': 'text', 'multiple': False}, 'email': {'label': 'Email', 'valType': 'email', 'multiple': False}, 'firstName': {'label': 'First name', 'valType': 'text', 'multiple': False}, 'lastName': {'label': 'Last name', 'valType': 'text', 'multiple': False}, 'mayLogin': {'label': 'Login allowed', 'valType': 'bool', 'multiple': False}, 'dateModified': {'label': 'modified on', 'valType': 'datetime', 'multiple': True}, 'dateLastLogin': {'label': 'last logged in on', 'valType': 'datetime', 'multiple': False}, 'statusLastLogin': {'label': 'Status last login', 'valType': 'text', 'multiple': False}}}, 'country': {'title': 'name', 'sort': [['name', 1]], 'fieldOrder': ['iso2', 'name', 'isMember', 'latitude', 'longitude'], 'fieldSpecs': {'iso2': {'label': 'ISO(2)', 'valType': 'text', 'multiple': False}, 'name': {'label': 'Name', 'valType': 'text', 'multiple': False}, 'isMember': {'label': 'Is DARIAH member', 'valType': 'bool', 'multiple': False}, 'latitude': {'label': 'Latitude', 'valType': 'number', 'multiple': False}, 'longitude': {'label': 'Longitude', 'valType': 'number', 'multiple': False}}}, 'contrib': {'title': 'title', 'sort': [['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'year', 'country', 'vcc', 'typeContribution', 'description', 'costTotal', 'costDescription', 'contactPersonName', 'contactPersonEmail', 'urlContribution', 'urlAcademic', 'creator', 'dateCreated', 'modified', 'tadirahObject', 'tadirahActivity', 'tadirahTechnique', 'discipline', 'keyword'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}, 'contactPersonName': {'label': 'contact person', 'valType': 'text', 'multiple': False}, 'contactPersonEmail': {'label': 'contact email', 'valType': 'email', 'multiple': True}, 'urlContribution': {'label': 'Contribution url', 'valType': 'url', 'multiple': True}, 'urlAcademic': {'label': 'Academic url', 'valType': 'url', 'multiple': True}, 'description': {'label': 'Description', 'valType': 'textarea', 'multiple': False}, 'costTotal': {'label': 'cost (total)', 'valType': 'number', 'multiple': False}, 'costDescription': {'label': 'cost (description)', 'valType': 'textarea', 'multiple': False}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False}, 'country': {'label': 'Country(ies)', 'valType': {'values': 'country', 'select': {'isMember': True}, 'allowNew': False}, 'multiple': False}, 'year': {'label': 'Year', 'valType': {'values': 'year', 'allowNew': True}, 'multiple': False}, 'vcc': {'label': 'VCC', 'valType': {'values': 'vcc', 'allowNew': False}, 'multiple': True}, 'discipline': {'label': 'Disciplines', 'valType': {'values': 'discipline', 'allowNew': True}, 'multiple': True}, 'keyword': {'label': 'Keywords', 'valType': {'values': 'keyword', 'allowNew': True}, 'multiple': True}, 'typeContribution': {'label': 'Type', 'valType': {'values': 'typeContribution', 'allowNew': False}, 'multiple': False}, 'typeContributionOther': {'label': 'Type', 'valType': {'values': 'typeContribution', 'allowNew': True}, 'multiple': True}, 'tadirahObject': {'label': 'Object(s)', 'valType': {'values': 'tadirahObject', 'allowNew': False}, 'multiple': True}, 'tadirahActivity': {'label': 'Activity(ies)', 'valType': {'values': 'tadirahActivity', 'allowNew': False}, 'multiple': True}, 'tadirahTechnique': {'label': 'Technique(s)', 'valType': {'values': 'tadirahTechnique', 'allowNew': False}, 'multiple': True}}, 'filters': [{'field': 'title', 'label': 'title', 'type': 'Fulltext', 'maxCols': None, 'expanded': None}, {'field': 'country', 'label': 'country', 'type': 'EUMap', 'maxCols': 2, 'expanded': True}, {'field': 'vcc', 'label': 'vcc', 'type': 'ByValue', 'maxCols': 2, 'expanded': True}, {'field': 'year', 'label': 'year', 'type': 'ByValue', 'maxCols': 3, 'expanded': False}, {'field': 'typeContribution', 'label': 'type', 'type': 'ByValue', 'maxCols': 2, 'expanded': True}, {'field': 'tadirahActivity', 'label': 'research activity', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'tadirahObject', 'label': 'research object', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'tadirahTechnique', 'label': 'research technique', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}, {'field': 'discipline', 'label': 'discipline', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'keyword', 'label': 'keyword', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}]}, 'package': {'title': 'title', 'sort': [['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'startDate', 'endDate', 'notes', 'dateCreated', 'creator', 'modified'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'startDate': {'label': 'start date', 'valType': 'datetime', 'multiple': False}, 'endDate': {'label': 'end date', 'valType': 'datetime', 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'creator': {'label': 'creator', 'valType': {'values': 'user', 'allowNew': False}, 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}, 'notes': {'label': 'Notes', 'valType': 'textarea', 'multiple': True}}}}}
class DataModel(object):
    def __init__(self):
        for (k, v) in model.items():
            setattr(self, k, v)
