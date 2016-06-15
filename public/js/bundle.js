!function(e){e.config(["$locationProvider","$routeProvider",function(e,n){n.when("/",{redirectTo:"/baseline"}).otherwise({redirectTo:"/error"}),e.html5Mode(!1)}]),e.config(["$compileProvider",function(e){e.debugInfoEnabled(!1)}])}(angular.module("Scholar",["baseline","snapshot","user","loader","user-dropdown","error"])),function(e){e.config(["$routeProvider",function(e){e.when("/login",{templateUrl:"app/authentication/auth.html",controller:"AuthController as auth",resolve:{}}).when("/logout",{resolve:{logout:["Authentication","$location",function(e,n){e.logout(),n.path("/login")}]}})}]),e.factory("authenticationInterceptor",["$q","$location","$injector",function(e,n,t){return{responseError:function(s){return 401===s.status&&(t.get("Authentication").logout(s.data.error),n.path("/login")),e.reject(s)}}}]),e.config(["$httpProvider","jwtInterceptorProvider",function(e,n){n.tokenGetter=["config","Authentication",function(e,n){return"/api"==e.url.substr(0,4)?n.getRawToken():null}],e.interceptors.push("authenticationInterceptor"),e.interceptors.push("jwtInterceptor")}]),e.run(["$rootScope","Authentication","$location",function(e,n,t){e.$on("$routeChangeStart",function(e,s,a){var i=s.$$route;if("/login"===i.originalPath&&n.isLoggedIn())return e.preventDefault(),t.path("/");if(i.authenticate&&!n.isLoggedIn()){e.preventDefault();var a=t.path();t.path("/login").search({returnTo:a})}})}])}(angular.module("authentication.config",["ngRoute","angular-jwt"])),function(e){e.controller("AuthController",["Authentication","$location",function(e,n){function t(){n.search({}),r.returnTo?n.path(r.returnTo):n.path("/")}function s(){e.clearReason(),delete i.authReason}var a="login",i=this,r=n.search();this.loginData={},this.registerData={},this.authReason=e.reason,this.isActive=function(e){return e===a},this.checkPasswords=function(){i.passwordError=i.registerData.password!==i.registerData.password2},this.switchTo=function(e){delete i.error,i.submissionDisabled=!1,a=e},this.submitLogin=function(){i.submissionDisabled=!0,s(),e.login(this.loginData).then(function(e){t()})["catch"](function(e){i.error=e.data.error})["finally"](function(){i.submissionDisabled=!1})},this.submitRegistration=function(){i.submissionDisabled=!0,e.register(this.registerData).then(function(e){t()})["catch"](function(e){i.error=e.data.error})["finally"](function(){i.submissionDisabled=!1})}}])}(angular.module("authentication.controller",["authentication.service"])),function(e){e.directive("requireLogin",["Authentication",function(e){return{restrict:"A",link:function(n,t,s){t.addClass("hidden"),n.$watch(e.isLoggedIn,function(e){t.toggleClass("hidden",!e)})}}}])}(angular.module("authentication.directive",["authentication.service"])),angular.module("authentication",["authentication.config","authentication.controller","authentication.directive","authentication.service","ngMessages","angular-jwt"]),function(e){e.service("Authentication",["jwtHelper","$window","$http",function(e,n,t){function s(e){function n(){var e={iss:document.location.hostname,exp:Date.now()+15e3};return btoa(JSON.stringify(e))}var t=[];return t.push(btoa(JSON.stringify(e))),t.push(n()),t.push(btoa(t[0]+t[1])),t.join(".")}var a=this,i="scholar-token";this.getRawToken=function(){return n.localStorage.getItem(i)};var r=_.memoize(function(n){var t;try{t=e.decodeToken(n)}catch(s){t=null}return t});this.login=function(e){return t.post("/api/user/token",{credentials:s(e)}).then(function(e){return a.setToken(e.data.token),e.data})},this.register=function(e){return t.post("/api/user",e).then(function(n){return a.login(e)})},this.getToken=function(){var e=a.getRawToken(),n=r(e);return e&&!n&&a.logout(),n},this.isLoggedIn=function(){var n,t=a.getRawToken();if(t){try{n=e.isTokenExpired(t)}catch(s){n=!0}n&&a.logout()}return!!t&&!n},this.logout=function(e){this.reason=e,n.localStorage.removeItem(i)},this.setToken=function(e){n.localStorage.setItem(i,e)},this.clearReason=function(){delete this.reason}}])}(angular.module("authentication.service",[])),function(e){e.config(["$routeProvider",function(e){e.when("/baseline",{templateUrl:"app/baseline/list.html",controller:"ListBaselineController as list",authenticate:!0,resolve:{baselines:["BaselineService",function(e){return e.listAllBaselines()}],outstandingCandidates:["BaselineService",function(e){return e.getOutstandingCandidates()}]}}).when("/baseline/:name",{templateUrl:"app/baseline/view.html",controller:"ViewBaselineController as baseline",authenticate:!0,resolve:{results:["BaselineService","$route",function(e,n){return e.fetchBaseline(n.current.params.name)}]}})}])}(angular.module("baseline.config",["ngRoute"])),function(e){e.controller("ListBaselineController",["BaselineService","baselines","outstandingCandidates",function(e,n,t){function s(e){a.filtering=!0,a.baselines=_.filter(n,function(n){return-1!==e.indexOf(n._id)})}var a=this;a.baselines=n,t.length>0&&s(t),a.showOutstanding=function(){e.getOutstandingCandidates().then(function(e){s(e)})},a.showAll=function(){a.filtering=!1,a.baselines=n},a.getBrowsers=function(e){return e.results.map(function(e){return e.browser+" ("+e.resolution+")"}).join(", ")},a.getLabels=function(e){var n=e.results.map(function(e){return e.labels.join(", ")});return _.uniq(n).join(", ")}}]),e.controller("ViewBaselineController",["results","$routeParams",function(e,n){this.name=n.name,this.results=e}])}(angular.module("baseline.controller",[])),angular.module("baseline",["baseline.controller","baseline.service","baseline.config"]),function(e){e.service("BaselineService",["$http",function(e){return{listAllBaselines:function(){return e.get("/api/baseline").then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},fetchBaseline:function(n){return e.get("/api/baseline/"+n).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},getOutstandingCandidates:function(){return e.get("/api/candidate").then(function(e){return e.data},function(e){throw e.status+" : "+e.data})}}}])}(angular.module("baseline.service",[])),function(e){e.config(["$routeProvider",function(e){e.when("/error",{templateUrl:"app/error/template.html"})}])}(angular.module("error.config",["ngRoute"])),angular.module("error",["error.config"]),function(e){e.directive("loader",function(){return{restrict:"E",controller:"LoaderController",bindToController:!0,controllerAs:"ctrl",templateUrl:"app/loader/template.html"}}),e.controller("LoaderController",["$rootScope","$timeout",function(e,n){var t=this;t.displayed=!0,e.$on("$routeChangeStart",function(){t.displayed=!0,n(function(){t.displayed&&(t.displayed=!1)},8e3)}),e.$on("$routeChangeSuccess",function(){t.displayed=!1}),e.$on("$routeChangeError",function(){t.displayed=!1})}])}(angular.module("loader",[])),function(e){e.config(["$routeProvider",function(e){e.when("/snapshot/:name",{templateUrl:"app/snapshot/template.html",controller:"SnapshotController",authenticate:!0,resolve:{}})}])}(angular.module("snapshot.config",["ngRoute","toastr"])),function(e){e.controller("SnapshotController",["$scope","SnapshotService","$routeParams","$location","$timeout","toastr",function(e,n,t,s,a,i){e.name=t.name,e.baselined=!1,n.listDiffs(e.name).then(function(n){e.snapshots=n}),e.promoteCandidate=function(t){e.baselined=!0,e.baselinedCandidate=t,n.promoteCandidate(e.name,t).then(function(){a(function(){s.url("/baseline?refresh="+e.name)},1e3)})},e.removeSnapshot=function(t){n.deleteSnapshot(e.name,t).then(function(){_.remove(e.snapshots,{_id:t}),i.info("Successfully removed candidate.",{timeOut:5e3,progressBar:!0})})},e.isHidden=function(n){return e.baselined&&e.baselinedCandidate!==n}}])}(angular.module("snapshot.controller",[])),angular.module("snapshot",["snapshot.controller","snapshot.service","snapshot.config"]),function(e){e.service("SnapshotService",["$http",function(e){var n={listDiffs:function(n){return e.get("/api/diff/"+n).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},deleteSnapshot:function(n,t){return e["delete"]("/api/screenshot/"+n+"/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},promoteCandidate:function(n,t){return e.put("/api/screenshot/"+n+"/promote/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})}};return n}])}(angular.module("snapshot.service",[])),angular.module("Scholar").run(["$templateCache",function(e){e.put("app/authentication/auth.html",'\n<div class="container">\n    <div class="authentication">\n        <div class="auth-panel login" ng-class="{\'active\': auth.isActive(\'login\')}">\n            <form name="loginForm" novalidate ng-submit="auth.submitLogin()">\n                <h3>Login</h3>\n                <span ng-if="auth.authReason" class="validation">{{auth.authReason}}</span>\n                <span ng-if="auth.error" class="validation">{{auth.error}}</span>\n                <input placeholder="Username" type="text" ng-model="auth.loginData.username" required>\n                <input placeholder="Password" type="password" ng-model="auth.loginData.password" required>\n                <button type="submit" ng-disabled="loginForm.$invalid || auth.submissionDisabled">Login</button>\n            </form>\n            <div class="switch">\n                <div class="message">Already have an account?</div>\n                <button ng-click=\'auth.switchTo("login")\'>Login</button>\n            </div>\n        </div>\n        <div class="auth-panel register" ng-class="{\'active\': auth.isActive(\'register\')}">\n                <form name="registerForm" autocomplete="off" novalidate ng-submit="auth.submitRegistration()">\n                <h3>Register</h3>\n                <span ng-if="auth.error" class="validation">{{auth.error}}</span>\n                <input name="username" ng-model="auth.registerData.username" placeholder="Username" type="text" ng-minlength="6" ng-maxlength="64" ng-pattern="/^[a-zA-Z0-9_\\-\\.]+$/" required>\n                <div ng-if="registerForm.username.$dirty" ng-messages="registerForm.username.$error">\n                    <div class="validation" ng-message="required">Please enter a username</div>\n                    <div class="validation" ng-message="minlength">Please enter a longer username</div>\n                    <div class="validation" ng-message="maxlength">Please enter a shorter username</div>\n                    <div class="validation" ng-message="pattern">Please use only alphanumerics, ".", "-" or "_"</div>\n                </div>\n                <input name="firstName" ng-model="auth.registerData.firstName" placeholder="First Name" type="text" required>\n                <input name="lastName" ng-model="auth.registerData.lastName" placeholder="Last Name" type="text" required>\n                <input name="email" ng-model="auth.registerData.email" placeholder="Email" type="email" required>\n                <div ng-if="registerForm.email.$dirty" ng-messages="registerForm.email.$error">\n                    <div class="validation" ng-message="required">Please enter an email</div>\n                    <div class="validation" ng-message="email">Please enter a valid email</div>\n                </div>\n                <input name="password" ng-model="auth.registerData.password" placeholder="Password" type="password" ng-minlength="8" required>\n                <div ng-if="registerForm.password.$dirty" ng-messages="registerForm.password.$error">\n                    <div class="validation" ng-message="required">Please enter a password</div>\n                    <div class="validation" ng-message="minlength">Please enter a longer password</div>\n                </div>\n                <input name="password2" ng-model="auth.registerData.password2" ng-model-options="{ debounce: 200 }" ng-change="auth.checkPasswords()" placeholder="Confirm Password" type="password" required>\n                <div class="validation" ng-if="registerForm.password2.$dirty && auth.passwordError">Passwords must match</div>\n                <button type="submit" ng-disabled="registerForm.$invalid || auth.submissionDisabled || auth.passwordError">Register</button>\n            </form>\n            <div class="switch">\n                <div class="message">Don\'t have an account?</div>\n                <button ng-click=\'auth.switchTo("register")\'>Register</button>\n            </div>\n        </div>\n    </div>\n\n</div>\n'),e.put("app/baseline/list.html",'<div class="search">\n    <input class="input" type="text" ng-model="list.nameFilter" placeholder="Search">\n    <a class="button" ng-click="list.showOutstanding()">Filter By Outstanding</a>\n    <a class="button" ng-click="list.showAll()">Show All</a>\n</div>\n\n<ul class="baseline-list">\n    <div class="baseline-item"\n         ng-repeat="baseline in list.baselines | filter:{ _id: list.nameFilter } track by baseline._id">\n        <div class="snapshot">\n            <img class="snapshot-image" ng-src={{::"/api/baseline/"+baseline.results[0]._id+"/raw"}}></img>\n            <div class="snapshot-info">\n                <h2 class="name">{{:: baseline._id }}</h2>\n                <ul class="meta">\n                    <li>Created: {{:: baseline.dateCreated | date:"dd/MM/yyyy \'at\' h:mma" }}</li>\n                    <li>Last Updated By: {{:: baseline.lastUpdatedBy || \'N/A\' }}</li>\n                    <li>Last Updated: {{:: (baseline.lastUpdated | date:"dd/MM/yyyy \'at\' h:mma") || \'N/A\'}}</li>\n                    <li>Browser(s): {{:: list.getBrowsers(baseline) || \'N/A\'}}</li>\n                    <li>Labels: {{:: list.getLabels(baseline) || \'N/A\'}}</li>\n                </ul>\n                <div class="snapshot-actions">\n                    <a href="#/snapshot/{{:: baseline._id }}">View Candidates</a>\n                    <a href="#/baseline/{{:: baseline._id }}">View Results</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</ul>\n\n<div ng-show="!list.baselines.length">\n    <div class="error">\n        <div class="face">:)</div>\n        <div class="message">No {{list.filtering? "matching" : null}} baselines. <span class="highlight">Get out there and find some!</span>\n        </div>\n    </div>\n'),e.put("app/baseline/view.html",'<h1 class="title">{{::baseline.name}}</h1>\n<ul class="baseline-list">\n    <div class="baseline-item"\n         ng-repeat="result in baseline.results">\n        <div class="snapshot">\n            <img class="snapshot-image" ng-src={{::"/api/baseline/"+result._id+"/raw"}}></img>\n            <div class="snapshot-info">\n                <h2 class="name">{{:: result.meta.browser }}</h2>\n                <div class="snapshot-actions">\n                    <a href="{{::\'/api/baseline/\'+result._id+\'/raw\'}}">View On Screen</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</ul>'),e.put("app/error/template.html",'<div class="row">\n    <div class="error">\n        <div class="face">:(</div>\n        <div class="message">Some error happened. Probably a <span class="highlight">404</span>.</div>\n    </div>\n</div>\n'),e.put("app/loader/template.html",'<div class="loader-container" title="Loading" ng-class="{visible: ctrl.displayed}">\n    <div class="loader"></div>\n</div>\n'),e.put("app/snapshot/template.html",'<h1 class="title">{{::name}}</h1>\n<ul>\n  <div class="comparison" ng-repeat="snapshot in snapshots track by snapshot._id">\n    <div class="taken">\n        <div>Date Taken: <span class="highlight">{{snapshot.dateCreated | date:"dd/MM/yyyy \'at\' h:mma"}}</span></div>\n        <div>Browser: <span class="highlight">{{snapshot.meta.browser}}</span></div>\n        <div class="comparison-actions">\n            <a class="button delete" ng-click="removeSnapshot(snapshot._id)">Remove This Candidate</a>\n            <a class="button promote" ng-click="promoteCandidate(snapshot.candidate)">Baseline This Candidate</a>\n        </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/baseline/{{::snapshot.baseline}}/raw" alt="{{::snapshot.name}} Baseline"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Baseline</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/baseline/{{::snapshot.baseline}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/diff/{{::snapshot.name}}/{{::snapshot._id}}/raw" alt="{{::snapshot.name}} Diff"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Difference</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/diff/{{::snapshot.name}}/{{::snapshot._id}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/candidate/{{::snapshot.name}}/{{::snapshot.candidate}}/raw" alt="{{::snapshot.name}} Candidate"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Candidate</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/candidate/{{::snapshot.name}}/{{::snapshot.candidate}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n\n  </div>\n</ul>\n\n<div ng-show="!snapshots.length">\n    <div class="error">\n        <div class="face">:)</div>\n        <div class="message">No differences. Either every snapshot passes <span class="highlight ">the acceptance threshold</span>, you recently\n            <span class="highlight ">baselined a candidate</span> or you <span class="highlight ">haven\'t sent any</span>.</div>\n    </div>\n</div>\n'),e.put("app/user/list.html",'<div class="container">\n    <h1 class="title">Users List</h1>\n    <table class="table">\n        <thead>\n            <tr>\n                <th>User ID</th>\n                <th>First Name</th>\n                <th>Last Name</th>\n                <th>Email</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="user in list.users track by user._id">\n                <td data-label="User ID"><a href="/#/user/{{::user._id}}">{{::user._id}}</a></td>\n                <td data-label="First Name">{{::user.firstName}}</td>\n                <td data-label="Last Name">{{::user.lastName}}</td>\n                <td data-label="Email">{{::user.email}}</td>\n            </tr>\n        </tbody>\n\n    </table>\n</div>\n'),e.put("app/user/manage.html",'<div class="container">\n    <div class="profile">\n        <img class="profile-image" src="{{::\'/api/user/\'+ctrl.user._id+\'/avatar\'}}" alt="Avatar">\n        <div class="profile-info">\n            <h2 class="profile-title">{{::ctrl.user.firstName}} {{::ctrl.user.lastName}}</h2>\n            <div>\n                <h3>Some More Information</h3>\n            </div>\n            <div>\n                <h3>Recent Images</h3>\n            </div>\n        </div>\n    </div>\n\n\n\n</div>\n'),e.put("app/user-dropdown/template.html",'<div class="nav">\n    <div class="nav-icon">\n        <a><i class="fa fa-user fa-2x"></i> </a>\n    </div>\n    <div class="nav-dropdown">\n        <div class="user-info" ng-if="user.loggedIn">\n            <img class="user-avatar" ng-src="{{::user.profile.avatar}}" alt="Avatar">\n            <div class="user-name">{{::user.profile.firstName}} {{::user.profile.lastName}}</div>\n        </div>\n        <ul class="nav-actions">\n            <li><a href="/#/baseline">Baselines</a></li>\n            <li ng-if="user.loggedIn"><a href="/#/user">Users</a></li>\n            <li ng-if="!user.loggedIn"><a href="/#/login">Login</a></li>\n            <li ng-if="user.loggedIn"><a href="/#/logout">Logout</a></li>\n        </ul>\n    </div>\n</div>\n')}]),function(e){e.config(["$routeProvider",function(e){e.when("/user",{templateUrl:"app/user/list.html",controller:"UserListController as list",bindToController:!0,authenticate:!0,resolve:{users:["UserService",function(e){return e.listUsers()}]}}).when("/user/:id",{templateUrl:"app/user/manage.html",controller:"UserController as ctrl",bindToController:!0,authenticate:!0,resolve:{user:["UserService","$route",function(e,n){return e.fetchUser(n.current.params.id)}]}})}])}(angular.module("user.config",["ngRoute"])),function(e){e.controller("UserListController",["users",function(e){var n=this;n.users=e}]),e.controller("UserController",["user",function(e){var n=this;n.user=e}])}(angular.module("user.controller",[])),angular.module("user",["user.controller","user.service","user.config","authentication"]),function(e){e.service("UserService",["$http",function(e){var n={listUsers:function(){return e.get("/api/user").then(function(e){return e.data},function(e){throw e.status+" : "+e.data.error})},fetchUser:function(n){return e.get("/api/user/"+n).then(function(e){return e.data},function(e){throw e.status+" : "+e.data.error})}};return n}])}(angular.module("user.service",[])),function(e){e.directive("userDropdown",function(){return{restrict:"E",controller:"UserDropdownController",bindToController:!0,controllerAs:"user",templateUrl:"app/user-dropdown/template.html"}}),e.controller("UserDropdownController",["Authentication","$scope",function(e,n){var t=this;n.$watch(e.isLoggedIn,function(n){t.loggedIn=n,n?(t.profile=e.getToken().user,t.profile.avatar||(t.profile.avatar="/api/user/"+t.profile._id+"/avatar")):delete this.profile})}])}(angular.module("user-dropdown",["authentication"])),!function(){"use strict";function e(e,n,t,s,a,i,r){function o(e){if(e)p(e.toastId);else for(var n=0;n<w.length;n++)p(w[n].toastId)}function l(e,n,t){var s=g().iconClasses.error;return h(s,e,n,t)}function u(e,n,t){var s=g().iconClasses.info;return h(s,e,n,t)}function c(e,n,t){var s=g().iconClasses.success;return h(s,e,n,t)}function d(e,n,t){var s=g().iconClasses.warning;return h(s,e,n,t)}function p(n,t){function s(e){for(var n=0;n<w.length;n++)if(w[n].toastId===e)return w[n]}function a(){return!w.length}var o=s(n);o&&!o.deleting&&(o.deleting=!0,o.isOpened=!1,e.leave(o.el).then(function(){o.scope.options.onHidden&&o.scope.options.onHidden(t),o.scope.$destroy();var e=w.indexOf(o);delete $[o.scope.message],w.splice(e,1);var n=i.maxOpened;n&&w.length>=n&&w[n-1].open.resolve(),a()&&(v.remove(),v=null,y=r.defer())}))}function h(e,n,t,s){return angular.isObject(t)&&(s=t,t=null),f({iconClass:e,message:n,optionsOverride:s,title:t})}function g(){return angular.extend({},i)}function m(n){if(v)return y.promise;v=angular.element("<div></div>"),v.attr("id",n.containerId),v.css({"pointer-events":"auto"});var t=angular.element(document.querySelector(n.target));if(!t||!t.length)throw"Target for toasts doesn't exist";return e.enter(v,t).then(function(){y.resolve()}),y.promise}function f(t){function i(e,n,t){t.allowHtml?(e.scope.allowHtml=!0,e.scope.title=a.trustAsHtml(n.title),e.scope.message=a.trustAsHtml(n.message)):(e.scope.title=n.title,e.scope.message=n.message),e.scope.toastType=e.iconClass,e.scope.toastId=e.toastId,e.scope.options={extendedTimeOut:t.extendedTimeOut,messageClass:t.messageClass,onHidden:t.onHidden,onShown:t.onShown,progressBar:t.progressBar,tapToDismiss:t.tapToDismiss,timeOut:t.timeOut,titleClass:t.titleClass,toastClass:t.toastClass},t.closeButton&&(e.scope.options.closeHtml=t.closeHtml)}function o(){function e(e){for(var n=["containerId","iconClasses","maxOpened","newestOnTop","preventDuplicates","preventOpenDuplicates","templates"],t=0,s=n.length;s>t;t++)delete e[n[t]];return e}var n={toastId:b++,isOpened:!1,scope:s.$new(),open:r.defer()};return n.iconClass=t.iconClass,t.optionsOverride&&(d=angular.extend(d,e(t.optionsOverride)),n.iconClass=t.optionsOverride.iconClass||n.iconClass),i(n,t,d),n.el=l(n.scope),n}function l(e){var t=angular.element("<div toast></div>"),s=n.get("$compile");return s(t)(e)}function u(){return d.maxOpened&&w.length<=d.maxOpened||!d.maxOpened}function c(){var e=d.preventDuplicates&&t.message===C,n=d.preventOpenDuplicates&&$[t.message];return e||n?!0:(C=t.message,$[t.message]=!0,!1)}var d=g();if(!c()){var h=o();if(w.push(h),d.autoDismiss&&d.maxOpened>0)for(var f=w.slice(0,w.length-d.maxOpened),y=0,D=f.length;D>y;y++)p(f[y].toastId);return u()&&h.open.resolve(),h.open.promise.then(function(){m(d).then(function(){if(h.isOpened=!0,d.newestOnTop)e.enter(h.el,v).then(function(){h.scope.init()});else{var n=v[0].lastChild?angular.element(v[0].lastChild):null;e.enter(h.el,v,n).then(function(){h.scope.init()})}})}),h}}var v,b=0,w=[],C="",$={},y=r.defer(),D={clear:o,error:l,info:u,remove:p,success:c,warning:d};return D}angular.module("toastr",[]).factory("toastr",e),e.$inject=["$animate","$injector","$document","$rootScope","$sce","toastrConfig","$q"]}(),function(){"use strict";angular.module("toastr").constant("toastrConfig",{allowHtml:!1,autoDismiss:!1,closeButton:!1,closeHtml:"<button>&times;</button>",containerId:"toast-container",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},maxOpened:0,messageClass:"toast-message",newestOnTop:!0,onHidden:null,onShown:null,preventDuplicates:!1,preventOpenDuplicates:!1,progressBar:!1,tapToDismiss:!0,target:"body",templates:{toast:"directives/toast/toast.html",progressbar:"directives/progressbar/progressbar.html"},timeOut:5e3,titleClass:"toast-title",toastClass:"toast"})}(),function(){"use strict";function e(e){function n(e,n,t,s){function a(){var e=(o-(new Date).getTime())/r*100;n.css("width",e+"%")}var i,r,o;s.progressBar=e,e.start=function(e){i&&clearInterval(i),r=parseFloat(e),o=(new Date).getTime()+r,i=setInterval(a,10)},e.stop=function(){i&&clearInterval(i)},e.$on("$destroy",function(){clearInterval(i)})}return{replace:!0,require:"^toast",templateUrl:function(){return e.templates.progressbar},link:n}}angular.module("toastr").directive("progressBar",e),e.$inject=["toastrConfig"]}(),function(){"use strict";function e(){this.progressBar=null,this.startProgressBar=function(e){this.progressBar&&this.progressBar.start(e)},this.stopProgressBar=function(){this.progressBar&&this.progressBar.stop()}}angular.module("toastr").controller("ToastController",e)}(),function(){"use strict";function e(e,n,t,s){function a(t,a,i,r){function o(e){return r.startProgressBar(e),n(function(){r.stopProgressBar(),s.remove(t.toastId)},e,1)}function l(){t.progressBar=!1,r.stopProgressBar()}function u(){return t.options.closeHtml}var c;if(t.toastClass=t.options.toastClass,t.titleClass=t.options.titleClass,t.messageClass=t.options.messageClass,t.progressBar=t.options.progressBar,u()){var d=angular.element(t.options.closeHtml),p=e.get("$compile");d.addClass("toast-close-button"),d.attr("ng-click","close()"),p(d)(t),a.prepend(d)}t.init=function(){t.options.timeOut&&(c=o(t.options.timeOut)),t.options.onShown&&t.options.onShown()},a.on("mouseenter",function(){l(),c&&n.cancel(c)}),t.tapToast=function(){t.options.tapToDismiss&&t.close(!0)},t.close=function(e){s.remove(t.toastId,e)},a.on("mouseleave",function(){(0!==t.options.timeOut||0!==t.options.extendedTimeOut)&&(t.$apply(function(){t.progressBar=t.options.progressBar}),c=o(t.options.extendedTimeOut))})}return{replace:!0,templateUrl:function(){return t.templates.toast},controller:"ToastController",link:a}}angular.module("toastr").directive("toast",e),e.$inject=["$injector","$interval","toastrConfig","toastr"]}(),angular.module("toastr").run(["$templateCache",function(e){e.put("directives/progressbar/progressbar.html",'<div class="toast-progress"></div>\n'),e.put("directives/toast/toast.html",'<div class="{{toastClass}}" ng-click="tapToast()">\n  <div ng-switch on="allowHtml">\n    <div ng-switch-default ng-if="title" class="{{titleClass}}">{{title}}</div>\n    <div ng-switch-default class="{{messageClass}}">{{message}}</div>\n    <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>\n    <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>\n  </div>\n  <progress-bar ng-if="progressBar"></progress-bar>\n</div>\n')}]);