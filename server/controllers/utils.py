import sys
import json
from base64 import b64encode, b64decode
from datetime import datetime as dt
from flask.json import JSONEncoder
from bson.objectid import ObjectId


ISO_DTP = '%Y-%m-%dT%H:%M:%S.%f'
ISO_DT = '%Y-%m-%dT%H:%M:%S'
ISO_D = '%Y-%m-%d'

E = ''
BLANK = ' '
COMMA = ','
COLON = ':'
DOT = '.'
PIPE = '|'
T = 'T'
Z = 'Z'
AT = '@'
EURO = '€'
MINONE = '-1'
ZERO = '0'
ONE = '1'
TWO = '2'
THREE = '3'
SLASH = '/'
LOW = '_'
AMP = '&'
LT = '<'
APOS = "'"
QUOT = '"'
DOLLAR = '$'

NL = '\n'

HYPHEN = '-'
WHYPHEN = ' - '
ELLIPS = '...'
ON = ' on '

LATIN1 = 'latin1'
UTF8 = 'utf8'

EMPTY_DATE = '1900-01-01T00:00:00Z'

ITER = '__iter__'


class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
      if isinstance(obj, dt):
        return obj.isoformat()
      elif isinstance(obj, ObjectId):
        return str(obj)
      return JSONEncoder.default(self, obj)


dbjson = CustomJSONEncoder().encode


def utf8FromLatin1(s):
  return str(bytes(s, encoding=LATIN1), encoding=UTF8)


def bencode(s):
  return (
      b64encode(
          json.dumps(s, separators=(COMMA, COLON)).encode()
      ).decode()
  )


def bdecode(s):
  return json.loads(
      b64decode(s.encode()).decode()
  )


def getNumberAsStr(v):
  if v is None:
    return ZERO
  try:
    rep = int(round(v))
  except Exception:
    rep = v
  return str(rep)


def getDatetimeAsStr(v):
  if v is None:
    return EMPTY_DATE
  if type(v) is str:
    return v
  return v.isoformat()


def getStrAsInt(v):
  if v is None:
    return 0
  try:
    rep = int(v)
  except Exception:
    rep = str(v)
  return rep


def getStrAsFloat(v):
  if v is None:
    return float(0)
  try:
    rep = float(v)
  except Exception:
    rep = str(v)
  return rep


def getStrAsDatetime(v):
  (error, rep) = dtm(v or EMPTY_DATE)
  if error:
    rep = dtm(EMPTY_DATE)[1]
  return rep


def now():
  return dt.utcnow()


def serverprint(msg):
  sys.stdout.write(f'{msg}\n')
  sys.stdout.flush()


def dtm(isostr):
  isostr = isostr.rstrip(Z)
  try:
    date = dt.strptime(isostr, ISO_DTP)
  except Exception:
    try:
      date = dt.strptime(isostr, ISO_DT)
    except Exception:
      try:
        date = dt.strptime(isostr, ISO_D)
      except Exception as err:
        return (str(err), isostr)
  return (E, date)


def asIterable(value):
  return value if hasattr(value, ITER) else [value]


def asString(value):
  return (
      E
      if value is None else
      E.join(value)
      if hasattr(value, ITER) else
      value
  )


def filterModified(modified):
  logicM = _decomposeM(modified)
  chunks = _perDay(logicM)
  thinned = _thinM(chunks)
  return _composeM(thinned)


def _decomposeM(modified):
  splits = [m.rsplit(ON, 1) for m in modified]
  return [(m[0], dtm(m[1].replace(BLANK, T))[1]) for m in splits]


def _trimM(mdt, trim):
  return (
      str(mdt).split(BLANK)[0]
      if trim == 1 else
      str(mdt).split(DOT)[0]
  )


def _composeM(modified):
  return [f'{m[0]}{ON}{_trimM(m[1], trim)}' for (m, trim) in reversed(modified)]


def _perDay(modified):
  chunks = {}
  for m in modified:
    chunks.setdefault(dt.date(m[1]), []).append(m)
  return [chunks[date] for date in sorted(chunks)]


def _thinM(chunks):
  modified = []
  nChunks = len(chunks)
  for (i, chunk) in enumerate(chunks):
    isLast = i == nChunks - 1
    people = {}
    for m in chunk:
      people.setdefault(m[0], []).append(m[1])
    thinned = []
    for (p, dates) in people.items():
      thinned.append((p, sorted(dates)[-1]))
    for m in sorted(thinned, key=lambda x: x[1]):
      modified.append((m, 2 if isLast else 1))
  return modified
