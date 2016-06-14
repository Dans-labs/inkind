/* COMPONENTS 
 * The Page function specifies and builds a list of components
 * Every component on the page corresponds to a function (with a prototype)
 * This function is stored in a generic Component function in a field called specific.
 * Every component has a list of subcomponents. For example, the 'list' component has a subcomponent 'contrib'
 * for the list of contributions, and a subcomponent 'country' for the list of countries.
 * The generic functions of a component take care of:
 * - generating HTML container divs for the subcomponents under specified destination elements if they does not already exist
 * - showing and hiding the subcomponents, and in general, work the current state data to the subcomponents 
 * - fetching the subcomponent's data from the server, if needed
 * This *specific* functionality of the components are defined in separate files.
 * Of this specific functionality, the following will be called from the generic component function:
 * - show(vr): inspect the current state and determine whether the subcomponent should be shown or hidden
 * - wire(vr): after the data has been fetched, wrap the data into the desired HTML content of the subcomponent
 *   and add the wiring (click events, change events)
 * In turn, the specific functions can access their associated generic components by this.component
 */

/* GENERIC COMPONENT
 * Here is the generic functionality of each component
 */

var g = require('./generic.js');
var Msg = require('./message.js');

function Component(name, specs, page) {
    this.name = name;
    this.page = page;
    this.specs = specs;
    this.variants = specs.variants;
    this._stage = {};
    for (var vr in this.variants) {
        this._stage[vr] = {};
        for (var st in this.page.stages) {
            this._stage[vr][st] = true;
        }
    }
    this.msg = {};
    this.container = {};
    this.state = this.page.state;
    this.data = {};
    this.related_values = {};
    this.ids_fetched = {};
    this.implementation = new specs.specific(this);
};

Component.prototype = {
    /* need, deed, ensure are wrappers around the promise mechanism.
     * The stage is a stage in processing the component, such as fetch, wire, work.
     * There should be a method method which does the work and which is expected to return a promise.
     * If it does not, we detect it, and yield a promise that is resolved with the original return value.
     * ensure takes care that the function of an action is promised to be execute once, by registering it
     * as a promise for that stage.
     * If there is already a fulfilled or pending promise for that action at that stage, no new promise will be made.
     * Ensure returns a function with no arguments. If it is called, the promise will be made.
     * So the result of ensure can be put inside the .then() of an other promise.
     * Now is a function that calls a function and returns the result as promise.
     */
    need: function(vr, stage) { // check whether there is a promise and whether it has been fulfilled
        return !this._stage[vr][stage].state || (this._stage[vr][stage].state() == `rejected`);
    },
    _deed: function(vr, stage, method) { // register a promise to perform the method associated with stage by entering it in the book keeping of stages
            /* we want to pass a method call to a .then() later on.
             * If we pass it straight, like this.method, .then() will call this function and supplies its own promise object as the this.
             * That is not our purpose: we want to call the method with the current component object as the this.
             * Hence we use bind() in order to supply the right this.
             * Whoever calls this new function methodCall, will perform a true method call of method method on object that.
             * This is crucial, otherwise all the careful time logic gets mangled, because the promises are stored in the component object.
             */
        var methodCall = this[method].bind(this, vr);
        var timing = this.page.getBefore(this.name, stage);
        var promises = [];
        timing.forEach(function(task) {
            var prev_name = task[0];
            var prev_stage = task[1];
            var prev_component = this.page.getComponent(prev_name);
            if (prev_component.hasVariant(vr)) {
                promises.push(prev_component._stage[vr][prev_stage]);
            }
        }, this);
        this._stage[vr][stage] = $.when.apply($, promises).then(methodCall);
    },
    ensure: function(vr, stage, method) {
        /* function to promise that method fun will be executed once and once only or multiple times,
         * but only if the before actions have been completed
         */
        if (stage in this.page.stages) {
            /* if the component works per id, the once setting of the stage is ignored
             * because we have to look whether we should execute that stage for new identifiers
             */
            var once = this.page.stages[stage] && !this.specs.by_id;
            if (!once || this.need(vr, stage)) {
                this._deed(vr, stage, method);
            }
        }
    },
    /* here are the implementations of the functions that are to be wrapped as promises
     * They can focus on the work, may or may not yield a promise
     */    
    hasVariant: function(vr) {
        return (vr in this.variants);
    },
    _visibility: function(vr, on) {
        if (this.hasVariant(vr)) {
            if (vr in this.container) {
                if (on) {
                    this.container[vr].show();
                }
                else {
                    this.container[vr].hide();
                }
            }
        }
    },
    _fetch: function(vr, ids_to_fetch) { // get the material by AJAX if needed
        var fetch_url = url_tpl.replace(/_c_/, `data`).replace(/_f_/, `${this.specs.fetch_url}_${vr}`)+`.json`;
        this.msg[vr].msg(`fetching data ...`);
        var postFetch = this._postFetch.bind(this, vr);
        if (!(ids_to_fetch == undefined)) {
            fetch_url += `?ids=${ids_to_fetch.join(',')}`;
        }
        return $.ajax({
            type: `POST`,
            url: fetch_url,
            contentType: `application/json; charset=utf-8`,
            dataType: `json`,
        }).then(function(json) {
            postFetch(json, ids_to_fetch);
        });
    },
    _postFetch: function(vr, json, ids_to_fetch) { // receive material after AJAX call
        this.msg[vr].clear();
        json.msgs.forEach(function(m) {
            this.msg[vr].msg(m);
        }, this);
        if (json.good) {
            this.data[vr] = json.data;
            if (this.specs.by_id) {
                console.log(json.data);
            }
            if (`relvals` in json) {
                this.related_values[vr] = json.relvals;
            }
            if (this.specs.by_id) {
                ids_to_fetch.forEach(function(id) {
                    this.ids_fetched[id] = true;
                }, this);
            }
        }
        this.implementation.weld(vr);
    },
    _weld: function(vr) {
        this._dst = this.page.getContainer(this.specs.dest, this.variants);
        if (!(this.specs.by_id)) {
            this.container[vr] = $(`#${this.name}_${vr}`);
            if (this.container[vr].length == 0) {
                var destination = this._dst[vr];
                destination.append(`<div id="msg_${this.name}_${vr}"></div>`);
                destination.append(`<div id="${this.name}_${vr}" class="component"></div>`);
                this.container[vr] = $(`#${this.name}_${vr}`);
            }
            this.msg[vr] = new Msg(`msg_${this.name}_${vr}`);
        }
        else {
            if (!(vr in this.msg)) {
                var destination = this._dst[vr];
                destination.prepend(`<div id="msg_${this.name}_${vr}"></div>`);
                this.msg[vr] = new Msg(`msg_${this.name}_${vr}`);
            }
        }
        if (this.specs.fetch_url != null) {
            var ids_to_fetch = [];
            if (this.specs.by_id) {
                var ids_asked_for = g.from_str(this.state.getState(`${this.specs.fetch_url}_${vr}`));
                for (var id in ids_asked_for) {
                    if (!(id in this.ids_fetched)) {
                        ids_to_fetch.push(id);
                    }
                }
                console.log(`ids to fetch ${this.name} - ${vr}`, ids_to_fetch);
                if (ids_to_fetch.length != 0) {
                    return this._fetch(vr, ids_to_fetch);
                }
            }
            else {
                return this._fetch(vr);
            }
        }
        else {
            this.implementation.weld(vr);
        }
    },
    _wire: function(vr) {
        this.implementation.wire(vr); // perform wire actions that are specific to this component
    },
    _work: function(vr) {
        this._visibility(vr, true);
        this.implementation.work(vr); // perform work actions that are specific to this component
    },
    weld: function(vr) {
        if (this.hasVariant(vr) && this.implementation.show(vr)) {
            this.ensure(vr, `weld`, `_weld`);
        }
    },
    wire: function(vr) {
        if (this.hasVariant(vr) && this.implementation.show(vr)) {
            this.ensure(vr, `wire`, `_wire`);
        }
    },
    work: function(vr) { // work (changed) state to current material
        if (this.hasVariant(vr) && this.implementation.show(vr)) { // show/hide depending on the specific condition
            this.ensure(vr, `work`, `_work`);
        }
        else {
            this._visibility(vr, false);
        }
    },
};

module.exports = Component;
