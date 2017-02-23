import bottle
from bottle import post, get, route, response, view, template

from db import DbAccess
from file import FileApi
from controller import Controller
from auth import AuthApi
from perm import PermApi
from models.data import DataModel
from models.permission import PermissionModel

File = FileApi()
DM = DataModel()
PM = PermissionModel()
DB = DbAccess(DM)
Auth = AuthApi(DB, PM, '/opt/web-apps/dariah_jwt.secret')
Controller = Controller(DB)
app = Auth.app

@route('/static/<filepath:path>')
def serveStatic(filepath):
    return File.static(filepath)

@route('/favicons/<filepath:path>')
def serveFavicons(filepath):
    return File.static('favicons/{}'.format(filepath))

@route('/api/json/<doc:re:[/A-Za-z0-9_.-]+>')
def serveApiJson(doc):
    return File.json(doc) 

@route('/api/file/<doc:re:[/A-Za-z0-9_.-]+>')
def serveApiFile(doc):
    return File.static(doc)

@route('/api/db/who/ami')
def serveApiDbWho():
    Auth.authenticate()
    return Auth.deliver()

@post('/api/db/<verb:re:[a-z0-9_]+>')
@get('/api/db/<verb:re:[a-z0-9_]+>')
def serveApiDb(verb):
    Auth.authenticate()
    Perm = PermApi(Auth, PM)
    return Controller.data(verb, Perm)

@route('/slogout')
def serveSlogout():
    Auth.deauthenticate()
    bottle.redirect('/Shibboleth.sso/Logout')

@route('/login')
def serveLogin():
    Auth.authenticate(login=True)
    return template('index')

@route('/logout')
def serveLogout():
    Auth.deauthenticate()
    return template('index')

@route('/<anything:re:.*>')
def client(anything):
    Auth.authenticate()
    return template('index')

