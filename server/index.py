from flask import (
    Flask,
    render_template,
    redirect,
)

from controllers.utils import dbjson
from controllers.db import DbAccess
from controllers.info import getInfo, selectContrib
from controllers.review import getReview, modReview
from controllers.cons import getCons
from controllers.file import FileApi
from controllers.controller import Controller
from controllers.auth import AuthApi
from controllers.perm import PermApi


def factory():
  app = Flask(__name__, static_url_path='/xxx')

  File = FileApi()
  DB = DbAccess()
  Auth = AuthApi(DB, app, '/opt/web-apps/dariah_jwt.secret')
  Control = Controller(DB)

  infoPages = set('''
      ourcountry
      ourcountry.tsv
  '''.strip().split())

  reviewPages = set('''
      my
  '''.strip().split())

  @app.route('/static/<path:filepath>')
  def serveStatic(filepath):
    return File.static(filepath)

  @app.route('/favicons/<path:filepath>')
  def serveFavicons(filepath):
      return File.static('favicons/{}'.format(filepath))

  @app.route('/index.html')
  def serveIndex():
    return render_template('index.html', css=Auth.CSS, js=Auth.JS)

  @app.route('/info/<string:verb>')
  def serveInfo(verb):
    Auth.authenticate()
    DB.addGroupInfo(Auth.userInfo)
    if verb in infoPages:
      asTsv = verb.endswith('.tsv')
      data = getInfo(verb, Auth.userInfo, asTsv)
      return (
          data
          if asTsv else
          render_template('info.html', userInfo=Auth.userInfo, **data)
      )
    return render_template('index.html', css=Auth.CSS, js=Auth.JS)

  @app.route('/review/<string:verb>')
  def serveReview(verb):
    Auth.authenticate()
    DB.addGroupInfo(Auth.userInfo)
    if verb in reviewPages:
      data = getReview(verb, Auth.userInfo)
      return (
          render_template('review.html', userInfo=Auth.userInfo, **data)
      )
    return render_template('index.html', css=Auth.CSS, js=Auth.JS)

  @app.route('/cons/<path:contribId>')
  def serveCons(contribId):
    Auth.authenticate()
    data = getCons(contribId, Auth.userInfo)
    return render_template('cons.html', css=Auth.CSS, js=Auth.JS, **data)

  @app.route('/api/json/<path:doc>')
  def serveApiJson(doc):
    return dbjson(File.json(doc))

  @app.route('/api/file/<path:doc>')
  def serveApiFile(doc):
    return File.static(doc)

  @app.route('/api/db/who/ami')
  def serveApiDbWho():
    Auth.authenticate()
    return dbjson(Auth.deliver())

  @app.route('/api/db/selectc', methods=['GET', 'POST'])
  def selectC():
    Auth.authenticate()
    return dbjson(selectContrib(Auth.userInfo))

  @app.route('/api/db/reviewmod', methods=['GET', 'POST'])
  def reviewMod():
    Auth.authenticate()
    return dbjson(modReview(Auth.userInfo))

  @app.route('/api/db/<path:verb>', methods=['GET', 'POST'])
  def serveApiDb(verb):
    Auth.authenticate()
    Perm = PermApi(Auth)
    return dbjson(Control.data(verb, Perm))

  @app.route('/slogout')
  def serveSlogout():
    Auth.deauthenticate()
    return redirect('/Shibboleth.sso/Logout')

  @app.route('/login')
  def serveLogin():
    Auth.authenticate(login=True)
    return render_template('index.html', css=Auth.CSS, js=Auth.JS)

  @app.route('/logout')
  def serveLogout():
    Auth.deauthenticate()
    return render_template('index.html', css=Auth.CSS, js=Auth.JS)

  @app.route('/')
  @app.route('/<path:anything>')
  def client(anything=None):
    Auth.authenticate()
    return render_template('index.html', css=Auth.CSS, js=Auth.JS)

  return app


if __name__ == "__main__":
  app = factory()
