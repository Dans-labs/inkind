/* INDIVIDUAL COMPONENT: EUmap
 * This manages a clickable map of the EU countries
 */

function EUmap(comp) {
    this.comp = comp;
    this.enabled = {contrib: 1};
};

EUmap.prototype = {
    _html: function(sc) {
        this.comp.container[sc].html(`
<p class="devel">by country:(under construction, not yet working!)</p>
<div id="map-europe">
 <ul class="europe">
  <li class="eu1"><a href="#albania">Albania</a></li>
  <li class="eu2"><a href="#andorra">Andorra</a></li>
  <li class="eu3"><a href="#austria">Austria</a></li>
  <li class="eu4"><a href="#belarus">Belarus</a></li>
  <li class="eu5"><a href="#belgium">Belgium</a></li>
  <li class="eu6"><a href="#bosnia-and-herzegovina">Bosnia and Herzegovina</a></li>
  <li class="eu7"><a href="#bulgaria">Bulgaria</a></li>
  <li class="eu8"><a href="#croatia">Croatia</a></li>
  <li class="eu9"><a href="#cyprus">Cyprus</a></li>
  <li class="eu10"><a href="#czech-republic">Czech Republic</a></li>
  <li class="eu11"><a href="#denmark">Denmark</a></li>
  <li class="eu12"><a href="#estonia">Estonia</a></li>
  <li class="eu13"><a href="#france">France</a></li>
  <li class="eu14"><a href="#finland">Finland</a></li>
  <li class="eu15"><a href="#georgia">Georgia</a></li>
  <li class="eu16"><a href="#germany">Germany</a></li>
  <li class="eu17"><a href="#greece">Greece</a></li>
  <li class="eu18"><a href="#hungary">Hungary</a></li>
  <li class="eu19"><a href="#iceland">Iceland</a></li>
  <li class="eu20"><a href="#ireland">Ireland</a></li>
  <li class="eu21"><a href="#san-marino">San Marino</a></li>
  <li class="eu22"><a href="#italy">Italy</a></li>
  <li class="eu23"><a href="#kosovo">Kosovo</a></li>
  <li class="eu24"><a href="#latvia">Latvia</a></li>
  <li class="eu25"><a href="#liechtenstein">Liechtenstein</a></li>
  <li class="eu26"><a href="#lithuania">Lithuania</a></li>
  <li class="eu27"><a href="#luxembourg">Luxembourg</a></li>
  <li class="eu28"><a href="#macedonia">Macedonia <abbr title="The Former Yugoslav Republic of Macedonia">(F.Y.R.O.M.)</abbr></a></li>
  <li class="eu29"><a href="#malta">Malta</a></li>
  <li class="eu30"><a href="#moldova">Moldova</a></li>
  <li class="eu31"><a href="#monaco">Monaco</a></li>
  <li class="eu32"><a href="#montenegro">Montenegro</a></li>
  <li class="eu33"><a href="#netherlands">Netherlands</a></li>
  <li class="eu34"><a href="#norway">Norway</a></li>
  <li class="eu35"><a href="#poland">Poland</a></li>
  <li class="eu36"><a href="#portugal">Portugal</a></li>
  <li class="eu37"><a href="#romania">Romania</a></li>
  <li class="eu38"><a href="#russian-federation">Russian Federation</a></li>
  <li class="eu39"><a href="#serbia">Serbia</a></li>
  <li class="eu40"><a href="#slovakia">Slovakia</a></li>
  <li class="eu41"><a href="#slovenia">Slovenia</a></li>
  <li class="eu42"><a href="#spain">Spain</a></li>
  <li class="eu43"><a href="#sweden">Sweden</a></li>
  <li class="eu44"><a href="#switzerland">Switzerland</a></li>
  <li class="eu45"><a href="#turkey">Turkey</a></li>
  <li class="eu46"><a href="#ukraine">Ukraine</a></li>
  <li class="eu47"><a href="#united-kingdom">United Kingdom</a></li>
<!-- 
  <li class="eu48"><a href="#england">England</a></li>
  <li class="eu49"><a href="#isle-of-man">Isle of Man</a></li>
  <li class="eu50"><a href="#northern-ireland">Northern Ireland</a></li>
  <li class="eu51"><a href="#scotland">Scotland</a></li>
  <li class="eu52"><a href="#wales">Wales</a></li>
-->
 </ul>
</div>
<p class="devel">selected: <input id="eu_sel"/></p>
        `);
    },
    _dressup: function(sc) {
        $(`#map-europe`).CSSMap({
            mapStyle: `default`,
            size: 320,
            cities: true,
            tooltips: `floating-top-center`,
            responsive: `auto`,
            fitHeight: false,
            mobileSupport: true,
            activateOnLoad: ['eu33', 'eu20', 'eu17'],
            visibleList: {
                enable: true,
                columns: 2,
                hideItems: ['eu4', 'eu15', 'eu38', 'eu45', 'eu46'],
            },
            multipleClick: {
                enable: true,
            },
            formSupport: {
                enable: true,
                inputId: `#eu_sel`,
                value: `name`,
            },
        });
    },
    show: function(sc) {
        return this.comp.state.getstate('list') == sc && sc in this.enabled;
    },
    init: function(sc) {
        if (sc in this.enabled) {
            this._html(sc);
            this._dressup(sc);
        }
    },
    process: function(sc) {
    },
    apply: function(sc) {
        if (this.show(sc)) {
            this.comp.container[sc].show();
        }
        else {
            this.comp.container[sc].hide();
        }
    }
};
