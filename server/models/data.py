model = {'generic': {'createdDate': 'dateCreated', 'createdBy': 'creator', 'modified': 'modified', 'title': 'rep', 'noTitle': 'no title', 'item': ['item', 'items'], 'sort': [['rep', 1]], 'fieldOrder': ['rep'], 'fieldSpecs': {'rep': {'label': 'representation', 'valType': 'text', 'multiple': False}}}, 'tables': {'user': {'title': 'eppn', 'item': ['user', 'users'], 'sort': [['lastName', 1], ['firstName', 1], ['eppn', 1]], 'fieldOrder': ['eppn', 'email', 'firstName', 'lastName', 'mayLogin', 'authority', 'dateLastLogin', 'statusLastLogin', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'eppn': {'label': 'Eppn', 'valType': 'text', 'multiple': False}, 'email': {'label': 'Email', 'valType': 'email', 'multiple': False}, 'firstName': {'label': 'First name', 'valType': 'text', 'multiple': False}, 'lastName': {'label': 'Last name', 'valType': 'text', 'multiple': False}, 'mayLogin': {'label': 'Login allowed', 'valType': 'bool', 'multiple': False}, 'authority': {'label': 'Authentication authority', 'valType': 'text', 'multiple': False}, 'dateModified': {'label': 'modified on', 'valType': 'datetime', 'multiple': True}, 'dateLastLogin': {'label': 'last logged in on', 'valType': 'datetime', 'multiple': False}, 'statusLastLogin': {'label': 'Status last login', 'valType': 'text', 'multiple': False}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'filters': [{'field': 'authority', 'label': 'authority', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}, {'field': 'mayLogin', 'label': 'login allowed', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}]}, 'country': {'title': 'name', 'item': ['country', 'countries'], 'sort': [['name', 1]], 'fieldOrder': ['iso', 'name', 'isMember', 'latitude', 'longitude', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'iso': {'label': 'ISO(2)', 'valType': 'text', 'valid': 'isoCountry', 'multiple': False, 'grid': {'width': '2em', 'grow': 0}}, 'name': {'label': 'Name', 'valType': 'text', 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'isMember': {'label': 'Is DARIAH member', 'valType': 'bool', 'multiple': False, 'grid': {'width': '4em', 'grow': 0}}, 'latitude': {'label': 'Latitude', 'valType': 'number', 'multiple': False, 'grid': {'width': '4em', 'grow': 0.5, 'shrink': 0}}, 'longitude': {'label': 'Longitude', 'valType': 'number', 'multiple': False, 'grid': {'width': '4em', 'grow': 0.5, 'shrink': 0}}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True, 'grid': {'width': '10em', 'grow': 1}}}, 'filters': [{'field': 'isMember', 'label': 'member of DARIAH', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}]}, 'typeContribution': {'title': 'subType', 'item': ['contribution type', 'contribution types'], 'sort': [['mainType', 1], ['subType', 1]], 'fieldOrder': ['mainType', 'subType', 'explanation', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'mainType': {'label': 'Main type', 'valType': 'text', 'multiple': False, 'grid': {'width': '10em', 'grow': 0}}, 'subType': {'label': 'Subtype', 'valType': 'text', 'multiple': False, 'grid': {'width': '10em', 'grow': 0}}, 'explanation': {'label': 'Explanation', 'valType': 'textarea', 'multiple': True, 'grid': {'width': '20em', 'grow': 1}}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False, 'grid': {'width': '10em', 'grow': 1}}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True, 'grid': {'width': '10em', 'grow': 1}}}, 'detailOrder': ['criteria', 'package'], 'details': {'criteria': {'table': 'criteria', 'linkField': 'typeContribution', 'mode': 'list', 'filtered': True}, 'package': {'table': 'package', 'linkField': 'typeContribution', 'mode': 'list', 'filtered': False}}, 'filters': [{'field': 'mainType', 'label': 'main type', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}, {'field': 'subType', 'label': 'subtype', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}]}, 'contrib': {'title': 'title', 'item': ['contribution', 'contributions'], 'sort': [['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'year', 'country', 'vcc', 'typeContribution', 'description', 'costTotal', 'costDescription', 'contactPersonName', 'contactPersonEmail', 'urlContribution', 'urlAcademic', 'tadirahObject', 'tadirahActivity', 'tadirahTechnique', 'discipline', 'keyword', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'contactPersonName': {'label': 'contact person', 'valType': 'text', 'multiple': False}, 'contactPersonEmail': {'label': 'contact email', 'valType': 'email', 'multiple': True}, 'urlContribution': {'label': 'Contribution url', 'valType': 'url', 'multiple': True}, 'urlAcademic': {'label': 'Academic url', 'valType': 'url', 'multiple': True}, 'description': {'label': 'Description', 'valType': 'textarea', 'multiple': False}, 'costTotal': {'label': 'cost (total)', 'valType': 'number', 'multiple': False}, 'costDescription': {'label': 'cost (description)', 'valType': 'textarea', 'multiple': False}, 'country': {'label': 'Country', 'valType': {'relTable': 'country', 'select': {'isMember': True}, 'allowNew': False}, 'multiple': False}, 'year': {'label': 'Year', 'valType': {'relTable': 'year', 'allowNew': True}, 'multiple': False}, 'vcc': {'label': 'VCC', 'valType': {'relTable': 'vcc', 'allowNew': False}, 'multiple': True}, 'discipline': {'label': 'Disciplines', 'valType': {'relTable': 'discipline', 'allowNew': True}, 'multiple': True}, 'keyword': {'label': 'Keywords', 'valType': {'relTable': 'keyword', 'allowNew': True}, 'multiple': True}, 'typeContribution': {'label': 'Type', 'valType': {'relTable': 'typeContribution', 'allowNew': False, 'inactive': {'attributes': {'className': 'inactive', 'title': 'this value does not belong to the current package'}, 'disabled': True}}, 'multiple': False}, 'typeContributionOther': {'label': 'Type', 'valType': {'relTable': 'typeContribution', 'allowNew': True}, 'multiple': True}, 'tadirahObject': {'label': 'Object(s)', 'valType': {'relTable': 'tadirahObject', 'allowNew': False}, 'multiple': True}, 'tadirahActivity': {'label': 'Activity(ies)', 'valType': {'relTable': 'tadirahActivity', 'allowNew': False}, 'multiple': True}, 'tadirahTechnique': {'label': 'Technique(s)', 'valType': {'relTable': 'tadirahTechnique', 'allowNew': False}, 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'detailOrder': ['assessment'], 'details': {'assessment': {'table': 'assessment', 'linkField': 'contrib', 'mode': 'list', 'filtered': False}}, 'filters': [{'field': 'title', 'label': 'title', 'type': 'Fulltext', 'maxCols': None, 'expanded': None}, {'field': 'country', 'label': 'country', 'type': 'EUMap', 'maxCols': 2, 'expanded': True}, {'field': 'vcc', 'label': 'vcc', 'type': 'ByValue', 'maxCols': 2, 'expanded': True}, {'field': 'year', 'label': 'year', 'type': 'ByValue', 'maxCols': 3, 'expanded': False}, {'field': 'typeContribution', 'label': 'type', 'type': 'ByValue', 'maxCols': 2, 'expanded': True}, {'field': 'tadirahActivity', 'label': 'research activity', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'tadirahObject', 'label': 'research object', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'tadirahTechnique', 'label': 'research technique', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}, {'field': 'discipline', 'label': 'discipline', 'type': 'ByValue', 'maxCols': 2, 'expanded': False}, {'field': 'keyword', 'label': 'keyword', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}]}, 'assessment': {'title': 'title', 'item': ['assessment', 'assessments'], 'sort': [['contrib', 1], ['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'assessmentType', 'contrib', 'remarks', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'contrib': {'label': 'Contribution', 'valType': {'relTable': 'contrib', 'allowNew': False}, 'multiple': False}, 'assessmentType': {'label': 'Assessment type', 'valType': {'relTable': 'typeContribution', 'allowNew': False, 'fixed': True, 'inactive': {'attributes': {'className': 'inactive', 'title': 'this value does not belong to the current package'}, 'disabled': True}}, 'multiple': False}, 'remarks': {'label': 'Remarks', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'detailOrder': ['criteriaEntry'], 'details': {'criteriaEntry': {'table': 'criteriaEntry', 'linkField': 'assessment', 'expand': True, 'mode': 'list', 'border': {'read': False, 'edit': False}, 'filtered': True, 'cascade': True, 'fixed': True}}, 'needMaster': True}, 'criteriaEntry': {'title': 'criteria', 'item': ['criterion entry', 'criterion entries'], 'sort': [['seq', 1]], 'fieldOrder': ['seq', 'criteria', 'score', 'evidence', 'assessment', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'seq': {'label': 'Number', 'valType': 'number', 'multiple': False}, 'criteria': {'label': 'criterion', 'valType': {'relTable': 'criteria', 'allowNew': False, 'fixed': True}, 'multiple': False}, 'score': {'label': 'score', 'valType': {'relTable': 'score', 'link': 'criteria', 'allowNew': False, 'popUpIfEmpty': True}, 'multiple': False}, 'assessment': {'label': 'assessment', 'valType': {'relTable': 'assessment', 'allowNew': False, 'fixed': True}, 'multiple': False}, 'evidence': {'label': 'evidence', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'needMaster': True, 'filters': [{'field': 'score', 'relField': 'score', 'label': 'score', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}]}, 'package': {'title': 'title', 'item': ['package', 'packages'], 'sort': [['title', 1], ['dateCreated', -1]], 'fieldOrder': ['title', 'startDate', 'endDate', 'typeContribution', 'remarks', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'title': {'label': 'Title', 'valType': 'text', 'multiple': False}, 'startDate': {'label': 'start date', 'valType': 'datetime', 'multiple': False}, 'endDate': {'label': 'end date', 'valType': 'datetime', 'multiple': False}, 'typeContribution': {'label': 'Type', 'valType': {'relTable': 'typeContribution', 'allowNew': True, 'inactive': {'attributes': {'className': 'inactive', 'title': 'this value does not belong to the current package'}, 'disabled': False}}, 'multiple': True}, 'remarks': {'label': 'Remarks', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'detailOrder': ['criteria'], 'details': {'criteria': {'table': 'criteria', 'linkField': 'package', 'mode': 'list', 'filtered': True}}}, 'criteria': {'title': 'criterion', 'item': ['assessment criterion', 'assessment criteria'], 'sort': [['package', 1], ['criterion', 1]], 'fieldOrder': ['criterion', 'remarks', 'typeContribution', 'package', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'package': {'label': 'Package', 'valType': {'relTable': 'package', 'allowNew': True, 'fixed': True}, 'multiple': False}, 'typeContribution': {'label': 'Type', 'valType': {'relTable': 'typeContribution', 'allowNew': True, 'inactive': {'attributes': {'className': 'inactive', 'title': 'this value does not belong to the current package'}, 'disabled': True}}, 'multiple': True}, 'criterion': {'label': 'Criterion', 'valType': 'text', 'multiple': False}, 'remarks': {'label': 'Remarks', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'detailOrder': ['score'], 'details': {'score': {'table': 'score', 'linkField': 'criteria', 'mode': 'list', 'filtered': True, 'cascade': True}}, 'needMaster': True, 'filters': [{'field': 'typeContribution', 'label': 'type', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}]}, 'score': {'title': 'description', 'item': ['score', 'scores'], 'sort': [['criteria', 1], ['score', 1], ['level', 1]], 'fieldOrder': ['score', 'level', 'description', 'remarks', 'criteria', 'creator', 'dateCreated', 'modified'], 'fieldSpecs': {'level': {'label': 'Level', 'valType': 'text', 'multiple': False}, 'score': {'label': 'Score', 'valType': 'number', 'multiple': False}, 'description': {'label': 'Description', 'valType': 'text', 'multiple': False}, 'criteria': {'label': 'Criterion', 'valType': {'relTable': 'criteria', 'allowNew': False}, 'multiple': False}, 'remarks': {'label': 'Remarks', 'valType': 'textarea', 'multiple': True}, 'creator': {'label': 'creator', 'valType': {'relTable': 'user', 'allowNew': False}, 'multiple': False}, 'dateCreated': {'label': 'created on', 'valType': 'datetime', 'multiple': False}, 'modified': {'label': 'modified', 'valType': 'text', 'multiple': True}}, 'filters': [{'field': 'description', 'label': 'description', 'type': 'Fulltext', 'maxCols': None, 'expanded': None}, {'field': 'criteria', 'label': 'criteria', 'type': 'ByValue', 'maxCols': 1, 'expanded': False}, {'field': 'score', 'label': 'score', 'type': 'ByValue', 'maxCols': 1, 'expanded': True}]}}}
class DataModel(object):
    def __init__(self):
        for (k, v) in model.items():
            setattr(self, k, v)
