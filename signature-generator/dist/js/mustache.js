!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Mustache=t()}(this,function(){"use strict";var e=Object.prototype.toString,t=Array.isArray||function(t){return"[object Array]"===e.call(t)};function n(e){return"function"==typeof e}function r(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function i(e,t){return null!=e&&"object"==typeof e&&t in e}var o=RegExp.prototype.test;var a=/\S/;function s(e){return!function(e,t){return o.call(e,t)}(a,e)}var c={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};var u=/\s*/,p=/\s+/,l=/\s*=/,h=/\s*\}/,f=/#|\^|\/|>|\{|&|=|!/;function d(e){this.string=e,this.tail=e,this.pos=0}function v(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function g(){this.templateCache={_cache:{},set:function(e,t){this._cache[e]=t},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}d.prototype.eos=function(){return""===this.tail},d.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},d.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},v.prototype.push=function(e){return new v(e,this)},v.prototype.lookup=function(e){var t,r,o,a=this.cache;if(a.hasOwnProperty(e))t=a[e];else{for(var s,c,u,p=this,l=!1;p;){if(e.indexOf(".")>0)for(s=p.view,c=e.split("."),u=0;null!=s&&u<c.length;)u===c.length-1&&(l=i(s,c[u])||(r=s,o=c[u],null!=r&&"object"!=typeof r&&r.hasOwnProperty&&r.hasOwnProperty(o))),s=s[c[u++]];else s=p.view[e],l=i(p.view,e);if(l){t=s;break}p=p.parent}a[e]=t}return n(t)&&(t=t.call(this.view)),t},g.prototype.clearCache=function(){void 0!==this.templateCache&&this.templateCache.clear()},g.prototype.parse=function(e,n){var i=this.templateCache,o=e+":"+(n||y.tags).join(":"),a=void 0!==i,c=a?i.get(o):void 0;return null==c&&(c=function(e,n){if(!e)return[];var i,o,a,c=!1,v=[],g=[],w=[],m=!1,b=!1,k="",x=0;function C(){if(m&&!b)for(;w.length;)delete g[w.pop()];else w=[];m=!1,b=!1}function E(e){if("string"==typeof e&&(e=e.split(p,2)),!t(e)||2!==e.length)throw new Error("Invalid tags: "+e);i=new RegExp(r(e[0])+"\\s*"),o=new RegExp("\\s*"+r(e[1])),a=new RegExp("\\s*"+r("}"+e[1]))}E(n||y.tags);for(var U,j,T,S,P,V,O=new d(e);!O.eos();){if(U=O.pos,T=O.scanUntil(i))for(var A=0,I=T.length;A<I;++A)s(S=T.charAt(A))?(w.push(g.length),k+=S):(b=!0,c=!0,k+=" "),g.push(["text",S,U,U+1]),U+=1,"\n"===S&&(C(),k="",x=0,c=!1);if(!O.scan(i))break;if(m=!0,j=O.scan(f)||"name",O.scan(u),"="===j?(T=O.scanUntil(l),O.scan(l),O.scanUntil(o)):"{"===j?(T=O.scanUntil(a),O.scan(h),O.scanUntil(o),j="&"):T=O.scanUntil(o),!O.scan(o))throw new Error("Unclosed tag at "+O.pos);if(P=">"==j?[j,T,U,O.pos,k,x,c]:[j,T,U,O.pos],x++,g.push(P),"#"===j||"^"===j)v.push(P);else if("/"===j){if(!(V=v.pop()))throw new Error('Unopened section "'+T+'" at '+U);if(V[1]!==T)throw new Error('Unclosed section "'+V[1]+'" at '+U)}else"name"===j||"{"===j||"&"===j?b=!0:"="===j&&E(T)}if(C(),V=v.pop())throw new Error('Unclosed section "'+V[1]+'" at '+O.pos);return function(e){for(var t,n=[],r=n,i=[],o=0,a=e.length;o<a;++o)switch((t=e[o])[0]){case"#":case"^":r.push(t),i.push(t),r=t[4]=[];break;case"/":i.pop()[5]=t[2],r=i.length>0?i[i.length-1][4]:n;break;default:r.push(t)}return n}(function(e){for(var t,n,r=[],i=0,o=e.length;i<o;++i)(t=e[i])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(r.push(t),n=t));return r}(g))}(e,n),a&&i.set(o,c)),c},g.prototype.render=function(e,t,n,r){var i=this.parse(e,r),o=t instanceof v?t:new v(t,void 0);return this.renderTokens(i,o,n,e,r)},g.prototype.renderTokens=function(e,t,n,r,i){for(var o,a,s,c="",u=0,p=e.length;u<p;++u)s=void 0,"#"===(a=(o=e[u])[0])?s=this.renderSection(o,t,n,r):"^"===a?s=this.renderInverted(o,t,n,r):">"===a?s=this.renderPartial(o,t,n,i):"&"===a?s=this.unescapedValue(o,t):"name"===a?s=this.escapedValue(o,t):"text"===a&&(s=this.rawValue(o)),void 0!==s&&(c+=s);return c},g.prototype.renderSection=function(e,r,i,o){var a=this,s="",c=r.lookup(e[1]);if(c){if(t(c))for(var u=0,p=c.length;u<p;++u)s+=this.renderTokens(e[4],r.push(c[u]),i,o);else if("object"==typeof c||"string"==typeof c||"number"==typeof c)s+=this.renderTokens(e[4],r.push(c),i,o);else if(n(c)){if("string"!=typeof o)throw new Error("Cannot use higher-order sections without the original template");null!=(c=c.call(r.view,o.slice(e[3],e[5]),function(e){return a.render(e,r,i)}))&&(s+=c)}else s+=this.renderTokens(e[4],r,i,o);return s}},g.prototype.renderInverted=function(e,n,r,i){var o=n.lookup(e[1]);if(!o||t(o)&&0===o.length)return this.renderTokens(e[4],n,r,i)},g.prototype.indentPartial=function(e,t,n){for(var r=t.replace(/[^ \t]/g,""),i=e.split("\n"),o=0;o<i.length;o++)i[o].length&&(o>0||!n)&&(i[o]=r+i[o]);return i.join("\n")},g.prototype.renderPartial=function(e,t,r,i){if(r){var o=n(r)?r(e[1]):r[e[1]];if(null!=o){var a=e[6],s=e[5],c=e[4],u=o;return 0==s&&c&&(u=this.indentPartial(o,c,a)),this.renderTokens(this.parse(u,i),t,r,u,i)}}},g.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},g.prototype.escapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return"number"==typeof n?String(n):y.escape(n)},g.prototype.rawValue=function(e){return e[1]};var y={name:"mustache.js",version:"4.0.1",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(e){w.templateCache=e},get templateCache(){return w.templateCache}},w=new g;return y.clearCache=function(){return w.clearCache()},y.parse=function(e,t){return w.parse(e,t)},y.render=function(e,n,r,i){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+(t(o=e)?"array":typeof o)+'" was given as the first argument for mustache#render(template, view, partials)');var o;return w.render(e,n,r,i)},y.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,function(e){return c[e]})},y.Scanner=d,y.Context=v,y.Writer=g,y});