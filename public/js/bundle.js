!function(e){e.config(["$locationProvider","$routeProvider",function(e,n){n.when("/",{redirectTo:"/baseline"}).otherwise({redirectTo:"/error"}),e.html5Mode(!1)}]),e.config(["$compileProvider",function(e){e.debugInfoEnabled(!1)}])}(angular.module("Scholar",["baseline","snapshot","error","ngAnimate"])),function(e){e.config(["$routeProvider",function(e){e.when("/baseline",{templateUrl:"app/baseline/list.html",controller:"BaselineController as list",resolve:{}})}])}(angular.module("baseline.config",["ngRoute"])),function(e){e.controller("BaselineController",["$scope","BaselineService","$routeParams",function(e,n,t){var s=this;s.images={};var a=!1,o=[];n.listAllBaselines().then(function(e){s.baselines=e,e.forEach(function(e){t.refresh===e.name?s.images[e.name]=e.raw+"?"+(new Date).getTime():s.images[e.name]=e.raw})}),s.showOutstanding=function(){n.getOutstandingCandidates().then(function(e){a=!0,o=e})},s.showAll=function(){a=!1},s.filterByOutstanding=function(e){return a?-1!==o.indexOf(e.name):!0}}])}(angular.module("baseline.controller",[])),angular.module("baseline",["baseline.controller","baseline.service","baseline.config"]),function(e){e.service("BaselineService",["$http",function(e){var n={listAllBaselines:function(){return e.get("/api/baseline").then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},getOutstandingCandidates:function(){return e.get("/api/candidate").then(function(e){return e.data},function(e){throw e.status+" : "+e.data})}};return n}])}(angular.module("baseline.service",[])),function(e){e.config(["$routeProvider",function(e){e.when("/error",{templateUrl:"app/error/template.html"})}])}(angular.module("error.config",["ngRoute"])),angular.module("error",["error.config"]),function(e){e.config(["$routeProvider",function(e){e.when("/snapshot/:name",{templateUrl:"app/snapshot/template.html",controller:"SnapshotController",resolve:{}})}])}(angular.module("snapshot.config",["ngRoute","toastr"])),function(e){e.controller("SnapshotController",["$scope","SnapshotService","$routeParams","$location","$timeout","toastr",function(e,n,t,s,a,o){e.name=t.name,e.baselined=!1,n.listDiffs(e.name).then(function(n){e.snapshots=n}),e.promoteCandidate=function(t){e.baselined=!0,e.baselinedCandidate=t,n.promoteCandidate(e.name,t).then(function(){a(function(){s.url("/baseline?refresh="+e.name)},1e3)})},e.removeSnapshot=function(t){n.deleteSnapshot(e.name,t).then(function(){_.remove(e.snapshots,{_id:t}),o.info("Successfully removed candidate.",{timeOut:5e3,progressBar:!0})})},e.isHidden=function(n){return e.baselined&&e.baselinedCandidate!==n}}])}(angular.module("snapshot.controller",[])),angular.module("snapshot",["snapshot.controller","snapshot.service","snapshot.config"]),function(e){e.service("SnapshotService",["$http",function(e){var n={listDiffs:function(n){return e.get("/api/diff/"+n).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},deleteSnapshot:function(n,t){return e["delete"]("/api/screenshot/"+n+"/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},promoteCandidate:function(n,t){return e.put("/api/screenshot/"+n+"/promote/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})}};return n}])}(angular.module("snapshot.service",[])),angular.module("Scholar").run(["$templateCache",function(e){e.put("app/baseline/list.html",'<div class="search">\n  <input class="input" type="text" ng-model="list.nameFilter" placeholder="Search">\n  <a class="button" ng-click="list.showOutstanding()">Filter By Outstanding</a>\n  <a class="button" ng-click="list.showAll()">Show All</a>\n</div>\n\n<ul class="baseline-list">\n  <div class="baseline-item" ng-repeat="baseline in list.baselines | filter:{ name: list.nameFilter } | filter: list.filterByOutstanding track by baseline._id">\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src={{::list.images[baseline.name]}}></img>\n      <div class="snapshot-info">\n        <h2 class="name">{{:: baseline.name }}</h2>\n        <ul class="meta">\n          <li>Created: {{:: baseline.dateCreated | date:"dd/MM/yyyy \'at\' h:mma" }}</li>\n          <li>Browser: {{:: baseline.meta.browser || "N/A"}}</li>\n          <li>Resolution: {{:: baseline.meta.resolution || "N/A"}}</li>\n        </ul>\n        <div class="snapshot-actions">\n          <a href="#/snapshot/{{:: baseline.name }}">View Candidates</a>\n          <a href="{{:: baseline.raw}}">View On Screen</a>\n        </div>\n      </div>\n    </div>\n  </div>\n</ul>\n\n<div ng-show="!list.baselines.length">\n    <div class="error">\n        <div class="face">:)</div>\n        <div class="message">No baselines. <span class="highlight ">Get out there an make some!</span>\n    </div>\n</div>\n'),e.put("app/error/template.html",'<div class="row">\n    <div class="error">\n        <div class="face">:(</div>\n        <div class="message">Some error happened. Probably a <span class="highlight">404</span>.</div>\n    </div>\n</div>\n'),e.put("app/snapshot/template.html",'<h1 class="title">{{::name}}</h1>\n<ul>\n  <div class="comparison" ng-repeat="snapshot in snapshots track by snapshot._id">\n    <div class="taken">\n        <div>Date Taken: <span class="highlight">{{snapshot.dateCreated | date:"dd/MM/yyyy \'at\' h:mma"}}</span></div>\n        <div class="comparison-actions">\n            <a class="button delete" ng-click="removeSnapshot(snapshot._id)">Remove This Candidate</a>\n            <a class="button promote" ng-click="promoteCandidate(snapshot.candidate)">Baseline This Candidate</a>\n        </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/baseline/{{::snapshot.name}}/raw" alt="{{::snapshot.name}} Baseline"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Baseline</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/baseline/{{::snapshot.name}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/diff/{{::snapshot.name}}/{{::snapshot._id}}/raw" alt="{{::snapshot.name}} Diff"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Difference</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/diff/{{::snapshot.name}}/{{::snapshot._id}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/candidate/{{::snapshot.name}}/{{::snapshot.candidate}}/raw" alt="{{::snapshot.name}} Candidate"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Candidate</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/candidate/{{::snapshot.name}}/{{::snapshot.candidate}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n\n  </div>\n</ul>\n\n<div ng-show="!snapshots.length">\n    <div class="error">\n        <div class="face">:)</div>\n        <div class="message">No differences. Either every snapshot passes <span class="highlight ">the acceptance threshold</span>, you recently\n            <span class="highlight ">baselined a candidate</span> or you <span class="highlight ">haven\'t sent any</span>.</div>\n    </div>\n</div>\n')}]),!function(){"use strict";function e(e,n,t,s,a,o,i){function r(e){if(e)p(e.toastId);else for(var n=0;n<C.length;n++)p(C[n].toastId)}function l(e,n,t){var s=h().iconClasses.error;return m(s,e,n,t)}function c(e,n,t){var s=h().iconClasses.info;return m(s,e,n,t)}function u(e,n,t){var s=h().iconClasses.success;return m(s,e,n,t)}function d(e,n,t){var s=h().iconClasses.warning;return m(s,e,n,t)}function p(n,t){function s(e){for(var n=0;n<C.length;n++)if(C[n].toastId===e)return C[n]}function a(){return!C.length}var r=s(n);r&&!r.deleting&&(r.deleting=!0,r.isOpened=!1,e.leave(r.el).then(function(){r.scope.options.onHidden&&r.scope.options.onHidden(t),r.scope.$destroy();var e=C.indexOf(r);delete O[r.scope.message],C.splice(e,1);var n=o.maxOpened;n&&C.length>=n&&C[n-1].open.resolve(),a()&&(v.remove(),v=null,B=i.defer())}))}function m(e,n,t,s){return angular.isObject(t)&&(s=t,t=null),f({iconClass:e,message:n,optionsOverride:s,title:t})}function h(){return angular.extend({},o)}function g(n){if(v)return B.promise;v=angular.element("<div></div>"),v.attr("id",n.containerId),v.css({"pointer-events":"auto"});var t=angular.element(document.querySelector(n.target));if(!t||!t.length)throw"Target for toasts doesn't exist";return e.enter(v,t).then(function(){B.resolve()}),B.promise}function f(t){function o(e,n,t){t.allowHtml?(e.scope.allowHtml=!0,e.scope.title=a.trustAsHtml(n.title),e.scope.message=a.trustAsHtml(n.message)):(e.scope.title=n.title,e.scope.message=n.message),e.scope.toastType=e.iconClass,e.scope.toastId=e.toastId,e.scope.options={extendedTimeOut:t.extendedTimeOut,messageClass:t.messageClass,onHidden:t.onHidden,onShown:t.onShown,progressBar:t.progressBar,tapToDismiss:t.tapToDismiss,timeOut:t.timeOut,titleClass:t.titleClass,toastClass:t.toastClass},t.closeButton&&(e.scope.options.closeHtml=t.closeHtml)}function r(){function e(e){for(var n=["containerId","iconClasses","maxOpened","newestOnTop","preventDuplicates","preventOpenDuplicates","templates"],t=0,s=n.length;s>t;t++)delete e[n[t]];return e}var n={toastId:b++,isOpened:!1,scope:s.$new(),open:i.defer()};return n.iconClass=t.iconClass,t.optionsOverride&&(d=angular.extend(d,e(t.optionsOverride)),n.iconClass=t.optionsOverride.iconClass||n.iconClass),o(n,t,d),n.el=l(n.scope),n}function l(e){var t=angular.element("<div toast></div>"),s=n.get("$compile");return s(t)(e)}function c(){return d.maxOpened&&C.length<=d.maxOpened||!d.maxOpened}function u(){var e=d.preventDuplicates&&t.message===w,n=d.preventOpenDuplicates&&O[t.message];return e||n?!0:(w=t.message,O[t.message]=!0,!1)}var d=h();if(!u()){var m=r();if(C.push(m),d.autoDismiss&&d.maxOpened>0)for(var f=C.slice(0,C.length-d.maxOpened),B=0,$=f.length;$>B;B++)p(f[B].toastId);return c()&&m.open.resolve(),m.open.promise.then(function(){g(d).then(function(){if(m.isOpened=!0,d.newestOnTop)e.enter(m.el,v).then(function(){m.scope.init()});else{var n=v[0].lastChild?angular.element(v[0].lastChild):null;e.enter(m.el,v,n).then(function(){m.scope.init()})}})}),m}}var v,b=0,C=[],w="",O={},B=i.defer(),$={clear:r,error:l,info:c,remove:p,success:u,warning:d};return $}angular.module("toastr",[]).factory("toastr",e),e.$inject=["$animate","$injector","$document","$rootScope","$sce","toastrConfig","$q"]}(),function(){"use strict";angular.module("toastr").constant("toastrConfig",{allowHtml:!1,autoDismiss:!1,closeButton:!1,closeHtml:"<button>&times;</button>",containerId:"toast-container",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},maxOpened:0,messageClass:"toast-message",newestOnTop:!0,onHidden:null,onShown:null,preventDuplicates:!1,preventOpenDuplicates:!1,progressBar:!1,tapToDismiss:!0,target:"body",templates:{toast:"directives/toast/toast.html",progressbar:"directives/progressbar/progressbar.html"},timeOut:5e3,titleClass:"toast-title",toastClass:"toast"})}(),function(){"use strict";function e(e){function n(e,n,t,s){function a(){var e=(r-(new Date).getTime())/i*100;n.css("width",e+"%")}var o,i,r;s.progressBar=e,e.start=function(e){o&&clearInterval(o),i=parseFloat(e),r=(new Date).getTime()+i,o=setInterval(a,10)},e.stop=function(){o&&clearInterval(o)},e.$on("$destroy",function(){clearInterval(o)})}return{replace:!0,require:"^toast",templateUrl:function(){return e.templates.progressbar},link:n}}angular.module("toastr").directive("progressBar",e),e.$inject=["toastrConfig"]}(),function(){"use strict";function e(){this.progressBar=null,this.startProgressBar=function(e){this.progressBar&&this.progressBar.start(e)},this.stopProgressBar=function(){this.progressBar&&this.progressBar.stop()}}angular.module("toastr").controller("ToastController",e)}(),function(){"use strict";function e(e,n,t,s){function a(t,a,o,i){function r(e){return i.startProgressBar(e),n(function(){i.stopProgressBar(),s.remove(t.toastId)},e,1)}function l(){t.progressBar=!1,i.stopProgressBar()}function c(){return t.options.closeHtml}var u;if(t.toastClass=t.options.toastClass,t.titleClass=t.options.titleClass,t.messageClass=t.options.messageClass,t.progressBar=t.options.progressBar,c()){var d=angular.element(t.options.closeHtml),p=e.get("$compile");d.addClass("toast-close-button"),d.attr("ng-click","close()"),p(d)(t),a.prepend(d)}t.init=function(){t.options.timeOut&&(u=r(t.options.timeOut)),t.options.onShown&&t.options.onShown()},a.on("mouseenter",function(){l(),u&&n.cancel(u)}),t.tapToast=function(){t.options.tapToDismiss&&t.close(!0)},t.close=function(e){s.remove(t.toastId,e)},a.on("mouseleave",function(){(0!==t.options.timeOut||0!==t.options.extendedTimeOut)&&(t.$apply(function(){t.progressBar=t.options.progressBar}),u=r(t.options.extendedTimeOut))})}return{replace:!0,templateUrl:function(){return t.templates.toast},controller:"ToastController",link:a}}angular.module("toastr").directive("toast",e),e.$inject=["$injector","$interval","toastrConfig","toastr"]}(),angular.module("toastr").run(["$templateCache",function(e){e.put("directives/progressbar/progressbar.html",'<div class="toast-progress"></div>\n'),e.put("directives/toast/toast.html",'<div class="{{toastClass}}" ng-click="tapToast()">\n  <div ng-switch on="allowHtml">\n    <div ng-switch-default ng-if="title" class="{{titleClass}}">{{title}}</div>\n    <div ng-switch-default class="{{messageClass}}">{{message}}</div>\n    <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>\n    <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>\n  </div>\n  <progress-bar ng-if="progressBar"></progress-bar>\n</div>\n')}]);