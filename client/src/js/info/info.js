/**
 * Documentation references.
 * 
 * {@link module:main|Entry point of this app's documentation}
 *
 * This file does not contain javascript code.
 *
 * @file
 */

/**
 * ## Local with backup
 * This app manages state locally through
 * {@link external:setState|setState()}
 * but with the enhancement that components can save state in a global store.
 * 
 * So, we do not adopt the full
 * {@link external:Redux|Redux}
 * approach, but
 * we borrow just one idea from it: a central store of state.
 *
 * Our components will use that store not for normal state updates, but only
 * when they
 * {@link external:componentWillUnmount|unmount}
 * or
 * {@link external:constructor|mount}
 *
 * ## Why local state?
 * We want to keep the pieces of business logic close to the component that deals with them.
 * We want to avoid the extra book keeping of actions and labels that  
 * {@link external:Redux|Redux}
 * requires.
 *
 * ## Why back up state?
 * Not all components can be kept on the interface all the time.
 * But stateful components may harbour costly state: big data tables from a server,
 * or lots of user interaction events, e.g. the faceted filter settings.
 * When the user {@link external:Routing|routes} back to a component with state, we want to restore
 * the last state before the user left the component.
 *
 * @external StatePolicy
 */

/**
 * @global
 * @typedef {Object} Source
 * @property {string} type - either
 * * `db` (mongo db access, results delivered as json)
 * * `json` (file contents delivered as json)  
 * @property {string} path - the remaining path to the controller function on the server
 * @property {string} branch - the subobject of the requesting component's state that will
 * receive the fetched data
 */

/**
 * @global
 * @typedef {Object} Result
 * @property {string} data - the actual payload of the data transfer; this is what the component needs
 * to have to do its work
 * @property {Message[]} messages - messages issued at the server side when carrying out the request
 * @property {boolean} good - whether the server has successfully carried out the request
 */

/**
 * @global
 * @typedef {Object} Message
 * @property {string} kind - one of the values `error`, `warning`, `good`, `special`, `info`
 * @property {string} text - the plain text of the message
 * @property {number} busy - an number that will be added by {@link module:data.getData|getData}: +1 at the start of a request,
 * -1 when the waiting is over; the {@link Notification} object can use `busy` for displaying progress
 * indication. **NB:** The server does not supply the `busy` attribute, only {@link module:data.getData|getData} does.
 */


