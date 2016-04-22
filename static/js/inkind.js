 var List={contrib:List_contrib,country:List_country,};function Component(dest,name,source,methods,page){this.dest=$(`#${dest}`);this.name=name;this.page=page;if(typeof source=='string'){this.fetch_url=url_tpl.replace(/_c_/,`data`).replace(/_f_/,source)+`.json`;this.data=null;}else{this.fetch_url=null;this.data=source;}this.loaded=false;this.methods=new methods(this);};Component.prototype={loaded:null,init:function(){this.container=$(`#${this.name}`);if(this.container.length==0){this.dest.append(`<div id="msg_${this.name}"></div>`);this.dest.append(`<div id="${this.name}"></div>`);this.container=$(`#${this.name}`);}this.msg=new Msg(`msg_${this.name}`);this.loaded=false;},apply:function(){if(this.methods.show()){this.container.show();if(!this.loaded){this.fetch();}}else{this.container.hide();}this.methods.apply();},fetch:function(){var that=this;if(this.fetch_url !=null){this.msg.msg(`fetching data ...`);$.post(this.fetch_url,{},function(json){that.loaded=true;that.msg.clear();json.msgs.forEach(function(m){that.msg.msg(m);});if(json.good){that.data=json.data;that.process();}},`json`);}else{this.process();}},process:function(){this.methods.process();},};var escapeHTML=(function(){`use strict`;var chr={'&':`&amp;`,'<':`&lt;`,'>':`&gt;`};return function(text){return text.replace(/[&<>]/g,function(a){return chr[a];});};}());var Request={parameter:function(name){return this.parameters()[name];},parameters:function(uri){var i,parameter,params,query,result;result={};if(!uri){uri=window.location.search;}if(uri.indexOf("?")===-1){return{};}query=uri.slice(1);params=query.split("&");i=0;while(i < params.length){parameter=params[i].split("=");result[parameter[0]]=parameter[1];i++;}return result;}};var rvars=Request.parameters();var nslvars=$.initNamespaceStorage(`req`);var lvars=nslvars.localStorage;function List_contrib(comp){this.comp=comp};List_contrib.prototype={show:function(){return this.comp.page.state.data.list==this.comp.name;},genhtml:function(){var h=``;h +=`<table id="table_${this.comp.name}">`;for(var i in this.comp.data){r=this.comp.data[i];h +=`<tr><td class="cc">${r[2]}<td><td class="cn">${r[3]}<td><td><a href="#" cid="${r[0]}">${r[1]}</a></td></tr>`;}h +=`</table>`;this.comp.container.html(h);},process:function(){this.genhtml();},apply:function(){},};function List_country(comp){this.comp=comp};List_country.prototype={show:function(){return this.comp.page.state.data.list==this.comp.name;},genhtml:function(){var h=``;h +=`<table id="table_${this.comp.name}">`;for(var i in this.comp.data){r=this.comp.data[i];h +=`<tr><td class="cc">${r[0]}<td><td class="cn">${r[1]}<td></tr>`;}h +=`</table>`;this.comp.container.html(h);},process:function(){this.genhtml();},apply:function(){},};function Lists(comp){this.comp=comp};Lists.prototype={show:function(){return true;},genhtml:function(){var showas=this.comp.page.state.showas;var h=``;for(var itm in this.comp.data){var show_itm=(itm in showas)? showas[itm].pl:itm;h +=`<a class="ctrl radio" href="#" itm="${itm}">${show_itm}</a> `;}this.comp.container.html(h);},dressup:function(){var that=this;this.comp.container.find(`.radio`).each(function(){$(this).click(function(e){e.preventDefault();that.comp.page.state.setstate(`list`,$(this).attr(`itm`));})})},process:function(){this.genhtml();this.dressup();},apply:function(){this.comp.container.find(`.radio`).removeClass(`ison`);this.comp.container.find(`a[itm="${this.comp.page.state.data.list}"]`).addClass(`ison`);}};$(function(){(new Page()).apply()});function Msg(dest,on_clear){var that=this;this.dest=$(`#${dest}`);this.trashc=$(`#trash_${dest}`);this.trashp=this.trashc.closest(`p`);this.trashc.click(function(e){e.preventDefault();that.clear();});this.trashp.hide();this.on_clear=on_clear;};Msg.prototype={clear:function(){this.dest.html(``);if(this.on_clear !=undefined){this.on_clear();}this.trashp.hide();this.dest.hide();},hide:function(){this.dest.hide();this.trashp.hide();},show:function(){this.dest.show();if(this.dest.html()!=``){this.trashp.show();}},msg:function(text,kind){if(kind==undefined){kind=`info`;}var mtext=this.dest.html();this.dest.html(`${mtext}<p class="${kind}">${text}</p>`);this.dest.show();this.trashp.show();},};function Page(){this.name='page';this.msg=new Msg(`msg_${this.name}`);this.state=new ViewState(this);var main_lists=this.state.specs.list.values;this.components=[['left','lists',main_lists,Lists],];this.compobjects=[];this.compindex={};for(ml in main_lists){this.components.push(['middle',ml,ml,List[ml]]);}this.init();};Page.prototype={init:function(){this.compobjects=[];this.compindex={};for(var i in this.components){var c=this.components[i];var co=new Component(c[0],c[1],c[2],c[3],this);this.compobjects.push(co);this.compindex[c[1]]=co;co.init();}History.Adapter.bind(window,`statechange`,this.state.goback(this.state));},apply:function(){for(var i in this.compobjects){var co=this.compobjects[i];co.apply();}},};function ViewState(page){this.page=page;this.msg=page.msg;this.data={};this.init();};ViewState.prototype={specs:{list:{type:`string`,values:{contrib:1,country:1},def:`contrib`},greet:{type:`string`,values:null,def:`hallo`},id:{type:`integer`,values:{min:-1,max:1000000},def:0},sort:{type:`boolean`,values:{v:true,x:false},def:true},},showas:{contrib:{sg:'contribution',pl:'contributions'},country:{sg:'country',pl:'countries'},},validate:function(name,val){var newval,message;if(name in this.specs){var s=this.specs[name];if(s.type==`string`){if(s.values){if(val in s.values){newval=val;}else{newval=s.def;this.msg.msg(`illegal string value for ${name}: "${val}" is replaced by "${s.def}"`,`warning`);}}else{newval=val;}}else if(s.type==`integer`){if(/^(\-|\+)?[0-9]+$/.test(val)){newval=Number(val);}else{newval=s.def;this.msg.msg(`not a number value for ${name}: "${val}" is replaced by "${s.def}"`,`warning`);}}else if(s.type==`boolean`){if(val in s.values){newval=s.values[val];}else{newval=s.def;this.msg.msg(`illegal boolean value for ${name}: "${val}" is replaced by "${s.def}"`,`warning`);}}}else{newval=null;this.msg.msg(`unknown parameter: ${name}=${val}`,`warning`);}return newval;},getvars:function(){vars=[];for(var name in this.data){var val=this.data[name];var spec=this.specs[name];if(spec.type==`string` || spec.type==`integer`){vars.push(`${name}=${val}`)}else if(spec.type==`boolean`){for(z in spec.values){if(spec.values[z]==val){vars.push(`${name}=${z}`)}}}}return vars.join('&')},setstate:function(name,val){this.data[name]=val;lvars.set(name,val);this.addHist();},getinitstate:function(){for(var name in rvars){if(!(name in this.specs)){this.msg.msg(`unknown parameter: ${name}=${val}`,`warning`);}}for(var name in this.specs){var val=null;if(name in rvars){var raw_val=rvars[name];val=this.validate(name,raw_val);lvars.set(name,val);}else if(lvars.isSet(name)){val=lvars.get(name);}else{val=this.specs[name].def;lvars.set(name,val);}this.data[name]=val;}},goback:function(ob){return function(){var state=History.getState();if(state && state.data){ob.apply(state);}}},addHist:function(title,view_url){var tit=`DARIAH contribution tool`;var this_url=`${app_url}?${this.getvars()}`;History.pushState(this.data,tit,this_url);},apply:function(state){if(state.data !=undefined){this.data=state.data;}this.page.apply();},init:function(){this.getinitstate();this.addHist();},};