import React, {Component} from 'react'
import { connect } from 'react-redux'
import LocalSettings from 'LocalSettings.jsx'
import { fetchData } from 'server.js'

class Login extends Component {
  render() {
    const { props: { me } } = this
    return (
      <span className="login" >{
        me.eppn && Object.keys(me).length > 0 ? (
          <span>
            <strong className="fa fa-user" title={me.eppn} >{me.eppn.split('@')[0]}</strong>
            <span className="fa fa-hashtag" />{me.authority}{' '}
            <em>{me.groupDesc || 'not authenticated'}</em>
            <a href="/logout" className="control fa fa-user-times" title="log out" />
            <a href="/slogout" className="control fa fa-users" title="sign out" />
          </span>
        ) : (
          <a href="/login" className="control fa fa-user-plus" >{' login'}</a>
        )}
        <LocalSettings />
      </span>
    )
  }
  componentDidMount() {
    const { props: { fetch } } = this
    fetch({ type: 'fetchMe', contentType: 'db', path: '/who/ami', desc: 'me' })
  }
}

const mapStateToProps = ( { me } ) => ({ me })

export default connect(mapStateToProps, { fetch: fetchData })(Login)

