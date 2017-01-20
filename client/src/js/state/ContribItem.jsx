import React, { Component } from 'react'
import ContribField from './ContribField.jsx'

import { getData } from '../helpers/data.js'
import { withContext, saveState } from '../helpers/hoc.js'

/**
 * @class
 * @classdesc
 *
 * **stateful** {@link external:Component|Component}
 *
 * ## A single contribution record
 *
 * Displays all fields that the user is entitled to read.
 * With a control to edit the record.
 * 
 * For the actual editing I intend to use
 * {@link https://github.com/kaivi/riek|React Inline Edit Kit}
 *
 */
class ContribItem extends Component {
/**
 *
 * @method
 * @param {Contrib[]} contribdata (from *state*) The list of contribution records as it comes form mongo db,
 * plus a list of fields that is provided for each row (dependent on user permissions)
 * @returns {Fragment}
*/
  constructor(props) {
    super(props);
    this.state = {};
  }

  repField(infoRaw, hasValueList, convert) {
    if (infoRaw == undefined) {return ''}
    if (hasValueList) {
      if (!Array.isArray(infoRaw)) {infoRaw = [infoRaw]}
      return infoRaw.map((x, i) => this.repValue(x, i, convert));
    }
    return this.repValue({value: infoRaw}, -1, convert)
  }

  repValue(valRaw, i, convert) {
    let result;
    let val = valRaw.value;
    switch (convert) {
      case 'user': {
        const { usersMap } = this.props;
        const valId = valRaw._id;
        let valRep;
        if (!usersMap.has(valId)) {
          valRep = 'UNKNOWN';
        }
        else {
          const userData = usersMap.get(valId);
          const fname = userData.firstName || '';
          const lname = userData.lastName || '';
          const email = userData.email || '';
          const eppn = userData.eppn || '';
          const authority = userData.authority || '';
          const mayLogin = userData.mayLogin?'yes':'no';
          let linkText = [fname, lname].filter(x => x).join(' '); 
          if (!linkText) {linkText = email}
          const namePart = (linkText && email)? (
            <a href={`mailto:${email}`}>{linkText}</a>
          ) : (
            linkText+email
          );
          const eppnPart = eppn?` eppn=${eppn} `:'';
          const authorityPart = authority?` authenticated by=${authority} `:'';
          const mayLoginPart = mayLogin?` active=${mayLogin} `:'';
          valRep = [namePart, eppnPart, authorityPart, mayLoginPart].filter(x => x).join('; ');
        }
        result = [<span className="val" key={`v${i}`}>{valRep}</span>, ' '];
        break;
      }
      case 'datetime': {
        const valRep = (new Date(val['$date'])).toISOString();
        result = [<span className="val" key={`v${i}`}>{valRep}</span>, ' '];
        break;
      }
      case 'url': {
        result = [<a className="val" key={`v${i}`} target="_blank" href={val}>{val}</a>, ' '];
        break;
      }
      default: {
        result = [<span className="val" key={`v${i}`}>{val}</span>, ' '];
        break;
      }
    }
    return result;
  }

  parseFields() {
    const { fieldData } = this.state;
    const { row, fields, fieldSpecs, perm } = fieldData;
    const frags = []
    for (const fS of fieldSpecs) {
      const { name, label, classNames } = fS;
      if (!fields[name]) {continue}
      const editable = !!perm.update[name];
      const infoRaw = row[name];
      const infoRep = this.repField(infoRaw, fS.hasValueList, fS.convert);
      frags.push(
        <tr key={name}>
          <td className="label">{label}</td>
          <td>{editable ? (
            <ContribField
              tag={`${row._id}_${name}`}
              initValue={infoRaw}
              rowId={row._id}
              fieldSpec={fS}
            />
          ) : (
            <p className={`value ${classNames}`}>{infoRep}</p>
          )}</td>
        </tr>
      )
    }
    return frags
  }

  render() {
    const { fieldData } = this.state;
    if (fieldData == null) {
      return <div/>
    }
    return (
      <div className="item">
        <table>
          <tbody>
            {this.parseFields()}
          </tbody>
        </table>
      </div>
    )
  }
/**
 * @method
 * @param {Contrib[]} contribs (from *state*) The list of contribution records as it comes form mongo db
 * @returns {Object} The data fetched from the server.
*/
  componentDidMount() {
    const { fieldData } = this.state;
    const { row } = this.props;
    if (fieldData == null) {
      getData([
          {
            type: 'db',
            path: `/item_contrib?id=${row._id}`,
            branch: 'fieldData',
          },
        ],
        this,
        this.props.notification.component
      );
    }
  }
}

export default withContext(saveState(ContribItem, 'ContribItem', {fieldData: null}))

