!function(e){e.config(["$locationProvider","$routeProvider",function(e,t){t.when("/",{redirectTo:"/baseline"}).otherwise({redirectTo:"/error"}),e.html5Mode(!1)}]),e.config(["$compileProvider",function(e){e.debugInfoEnabled(!1)}])}(angular.module("Scholar",["baseline","snapshot","user","loader","user-dropdown","error"])),function(e){e.config(["$routeProvider",function(e){e.when("/baseline",{templateUrl:"app/baseline/list.html",controller:"ListBaselineController as list",authenticate:!0,resolve:{baselines:["BaselineService",function(e){return e.listAllBaselines()}],outstandingCandidates:["BaselineService",function(e){return e.getOutstandingCandidates()}],preAppliedTags:["$location",function(e){var t=e.search(),n=[];return Array.isArray(t.tag)?n=n.concat(t.tag):t.tag&&n.push(t.tag),n}]}}).when("/baseline/:name",{templateUrl:"app/baseline/view.html",controller:"ViewBaselineController as baseline",authenticate:!0,resolve:{results:["BaselineService","$route",function(e,t){return e.fetchBaseline(t.current.params.name)}]}})}])}(angular.module("baseline.config",["ngRoute"])),function(e){e.controller("ListBaselineController",["BaselineService","baselines","outstandingCandidates","preAppliedTags","$filter",function(e,t,n,a,s){var i=this;i.filters=[],i.baselines=t,i.outstandingCandidates=n,i.filtering=!1,i.outstandingFilter=!1,i.labelFilters={},i.nameFilter="",i.filter=function(){i.baselines=s("filter")(t,function(e){var t=r.map(function(t){return t(e)});return _.every(t,function(e){return e})})},i.updateFilters=function(){i.filtering=!1,i.filters=[],i.outstandingFilter&&i.filters.push("Outstanding Only"),i.nameFilter&&i.filters.push("Name: "+i.nameFilter),angular.forEach(i.labelFilters,function(e,t){i.filters.push("Label: "+t)}),i.filters.length>0&&(i.filtering=!0),i.filter()};var r=[];r.push(function(e){return!i.outstandingFilter||i.outstandingCandidates.indexOf(e._id)!==-1}),r.push(function(e){return!i.nameFilter||e._id.indexOf(i.nameFilter)!==-1}),r.push(function(e){var t=Object.keys(i.labelFilters);return!(t.length>0)||_.every(t.map(function(t){return e.labels.indexOf(t)!==-1}),function(e){return e})}),n.length>0&&(i.outstandingFilter=!0,i.updateFilters()),a.length>0&&(a.forEach(function(e){i.labelFilters[e]=!0}),i.updateFilters()),i.showOutstanding=function(){e.getOutstandingCandidates().then(function(e){i.outstandingCandidates=e,i.outstandingFilter=!0,i.updateFilters()})},i.showAll=function(){i.outstandingFilter=!1,i.updateFilters()},i.getBrowsers=function(e){return e.results.map(function(e){return e.browser+" ("+(e.resolution||"N/A")+")"}).join(", ")},i.toggleLabelToFilter=function(e){i.labelFilters[e]?delete i.labelFilters[e]:i.labelFilters[e]=!0,i.updateFilters()}}]),e.controller("ViewBaselineController",["BaselineService","results","$routeParams","$location","toastr",function(e,t,n,a,s){var i=this;i.name=n.name,i.results=t,i.remove=function(t){e.deleteScreenshot(t).then(function(e){i.results=_.reject(i.results,{_id:t._id}),s.info("Successfully removed Screenshot.",{timeOut:5e3,progressBar:!0}),0===i.results.length&&a.url("/baseline")})}}])}(angular.module("baseline.controller",[])),angular.module("baseline",["baseline.controller","baseline.service","baseline.config"]),function(e){e.service("BaselineService",["$http",function(e){return{listAllBaselines:function(){return e.get("/api/baseline").then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},fetchBaseline:function(t){return e.get("/api/baseline/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},getOutstandingCandidates:function(){return e.get("/api/candidate").then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},deleteScreenshot:function(t){return e["delete"]("/api/screenshot/"+t.name+"/"+t._id).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})}}}])}(angular.module("baseline.service",[])),function(e){e.config(["$routeProvider",function(e){e.when("/login",{templateUrl:"app/authentication/auth.html",controller:"AuthController as auth",resolve:{}}).when("/logout",{resolve:{logout:["Authentication","$location",function(e,t){e.logout(),t.path("/login")}]}})}]),e.factory("authenticationInterceptor",["$q","$location","$injector",function(e,t,n){return{responseError:function(a){return 401===a.status&&(n.get("Authentication").logout(a.data.error),t.path("/login")),e.reject(a)}}}]),e.config(["$httpProvider","jwtInterceptorProvider",function(e,t){t.tokenGetter=["config","Authentication",function(e,t){return"/api"==e.url.substr(0,4)?t.getRawToken():null}],e.interceptors.push("authenticationInterceptor"),e.interceptors.push("jwtInterceptor")}]),e.run(["$rootScope","Authentication","$location",function(e,t,n){e.$on("$routeChangeStart",function(e,a,s){var i=a.$$route;if("/login"===i.originalPath&&t.isLoggedIn())return e.preventDefault(),n.path("/");if(i.authenticate&&!t.isLoggedIn()){e.preventDefault();var s=n.path();n.path("/login").search({returnTo:s})}})}])}(angular.module("authentication.config",["ngRoute","angular-jwt"])),function(e){e.controller("AuthController",["Authentication","$location",function(e,t){function n(){t.search({}),r.returnTo?t.path(r.returnTo):t.path("/")}function a(){e.clearReason(),delete i.authReason}var s="login",i=this,r=t.search();this.loginData={},this.registerData={},this.authReason=e.reason,this.isActive=function(e){return e===s},this.checkPasswords=function(){i.passwordError=i.registerData.password!==i.registerData.password2},this.switchTo=function(e){delete i.error,i.submissionDisabled=!1,s=e},this.submitLogin=function(){i.submissionDisabled=!0,a(),e.login(this.loginData).then(function(e){n()})["catch"](function(e){i.error=e.data.error})["finally"](function(){i.submissionDisabled=!1})},this.submitRegistration=function(){i.submissionDisabled=!0,e.register(this.registerData).then(function(e){n()})["catch"](function(e){i.error=e.data.error})["finally"](function(){i.submissionDisabled=!1})}}])}(angular.module("authentication.controller",["authentication.service"])),function(e){e.directive("requireLogin",["Authentication",function(e){return{restrict:"A",link:function(t,n,a){n.addClass("hidden"),t.$watch(e.isLoggedIn,function(e){n.toggleClass("hidden",!e)})}}}])}(angular.module("authentication.directive",["authentication.service"])),angular.module("authentication",["authentication.config","authentication.controller","authentication.directive","authentication.service","ngMessages","angular-jwt"]),function(e){e.service("Authentication",["jwtHelper","$window","$http",function(e,t,n){function a(e){function t(){var e={iss:document.location.hostname,exp:Date.now()+15e3};return btoa(JSON.stringify(e))}var n=[];return n.push(btoa(JSON.stringify(e))),n.push(t()),n.push(btoa(n[0]+n[1])),n.join(".")}var s=this,i="scholar-token";this.getRawToken=function(){return t.localStorage.getItem(i)};var r=_.memoize(function(t){var n;try{n=e.decodeToken(t)}catch(a){n=null}return n});this.login=function(e){return n.post("/api/user/token",{credentials:a(e)}).then(function(e){return s.setToken(e.data.token),e.data})},this.register=function(e){return n.post("/api/user",e).then(function(t){return s.login(e)})},this.getToken=function(){var e=s.getRawToken(),t=r(e);return e&&!t&&s.logout(),t},this.isLoggedIn=function(){var t,n=s.getRawToken();if(n){try{t=e.isTokenExpired(n)}catch(a){t=!0}t&&s.logout()}return!!n&&!t},this.logout=function(e){this.reason=e,t.localStorage.removeItem(i)},this.setToken=function(e){t.localStorage.setItem(i,e)},this.clearReason=function(){delete this.reason}}])}(angular.module("authentication.service",[])),function(e){e.config(["$routeProvider",function(e){e.when("/error",{templateUrl:"app/error/template.html"})}])}(angular.module("error.config",["ngRoute"])),angular.module("error",["error.config"]),function(e){e.directive("loader",function(){return{restrict:"E",controller:"LoaderController",bindToController:!0,controllerAs:"ctrl",templateUrl:"app/loader/template.html"}}),e.controller("LoaderController",["$rootScope","$timeout",function(e,t){var n=this;n.displayed=!0,e.$on("$routeChangeStart",function(){n.displayed=!0,t(function(){n.displayed&&(n.displayed=!1)},8e3)}),e.$on("$routeChangeSuccess",function(){n.displayed=!1}),e.$on("$routeChangeError",function(){n.displayed=!1})}])}(angular.module("loader",[])),function(e){e.config(["$routeProvider",function(e){e.when("/snapshot/:name",{templateUrl:"app/snapshot/template.html",controller:"SnapshotController",authenticate:!0,resolve:{}})}])}(angular.module("snapshot.config",["ngRoute","toastr"])),function(e){e.controller("SnapshotController",["$scope","SnapshotService","$routeParams","$location","$timeout","toastr",function(e,t,n,a,s,i){e.name=n.name,e.baselined=!1,t.listDiffs(e.name).then(function(t){e.snapshots=t}),e.promoteCandidate=function(n){e.baselined=!0,e.baselinedCandidate=n,t.promoteCandidate(e.name,n).then(function(){s(function(){a.url("/baseline?refresh="+e.name)},1e3)})},e.removeSnapshot=function(n){t.deleteSnapshot(e.name,n).then(function(){_.remove(e.snapshots,{_id:n}),i.info("Successfully removed candidate.",{timeOut:5e3,progressBar:!0})})},e.isHidden=function(t){return e.baselined&&e.baselinedCandidate!==t}}])}(angular.module("snapshot.controller",[])),angular.module("snapshot",["snapshot.controller","snapshot.service","snapshot.config"]),function(e){e.service("SnapshotService",["$http",function(e){var t={listDiffs:function(t){return e.get("/api/diff/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},deleteSnapshot:function(t,n){return e["delete"]("/api/screenshot/"+t+"/diff/"+n).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})},promoteCandidate:function(t,n){return e.put("/api/screenshot/"+t+"/promote/"+n).then(function(e){return e.data},function(e){throw e.status+" : "+e.data})}};return t}])}(angular.module("snapshot.service",[])),function(e){e.directive("tag",function(){return{restrict:"E",controller:angular.noop,replace:!0,bindToController:!0,controllerAs:"ctrl",templateUrl:"app/tag/template.html",scope:{value:"="}}})}(angular.module("loader",[])),angular.module("Scholar").run(["$templateCache",function(e){e.put("app/authentication/auth.html",'\n<div class="container">\n    <div class="authentication">\n        <div class="auth-panel login" ng-class="{\'active\': auth.isActive(\'login\')}">\n            <form name="loginForm" novalidate ng-submit="auth.submitLogin()">\n                <h3>Login</h3>\n                <span ng-if="auth.authReason" class="validation">{{auth.authReason}}</span>\n                <span ng-if="auth.error" class="validation">{{auth.error}}</span>\n                <input placeholder="Username" type="text" ng-model="auth.loginData.username" required>\n                <input placeholder="Password" type="password" ng-model="auth.loginData.password" required>\n                <button type="submit" ng-disabled="loginForm.$invalid || auth.submissionDisabled">Login</button>\n            </form>\n            <div class="switch">\n                <div class="message">Already have an account?</div>\n                <button ng-click=\'auth.switchTo("login")\'>Login</button>\n            </div>\n        </div>\n        <div class="auth-panel register" ng-class="{\'active\': auth.isActive(\'register\')}">\n                <form name="registerForm" autocomplete="off" novalidate ng-submit="auth.submitRegistration()">\n                <h3>Register</h3>\n                <span ng-if="auth.error" class="validation">{{auth.error}}</span>\n                <input name="username" ng-model="auth.registerData.username" placeholder="Username" type="text" ng-minlength="6" ng-maxlength="64" ng-pattern="/^[a-zA-Z0-9_\\-\\.]+$/" required>\n                <div ng-if="registerForm.username.$dirty" ng-messages="registerForm.username.$error">\n                    <div class="validation" ng-message="required">Please enter a username</div>\n                    <div class="validation" ng-message="minlength">Please enter a longer username</div>\n                    <div class="validation" ng-message="maxlength">Please enter a shorter username</div>\n                    <div class="validation" ng-message="pattern">Please use only alphanumerics, ".", "-" or "_"</div>\n                </div>\n                <input name="firstName" ng-model="auth.registerData.firstName" placeholder="First Name" type="text" required>\n                <input name="lastName" ng-model="auth.registerData.lastName" placeholder="Last Name" type="text" required>\n                <input name="email" ng-model="auth.registerData.email" placeholder="Email" type="email" required>\n                <div ng-if="registerForm.email.$dirty" ng-messages="registerForm.email.$error">\n                    <div class="validation" ng-message="required">Please enter an email</div>\n                    <div class="validation" ng-message="email">Please enter a valid email</div>\n                </div>\n                <input name="password" ng-model="auth.registerData.password" placeholder="Password" type="password" ng-minlength="8" required>\n                <div ng-if="registerForm.password.$dirty" ng-messages="registerForm.password.$error">\n                    <div class="validation" ng-message="required">Please enter a password</div>\n                    <div class="validation" ng-message="minlength">Please enter a longer password</div>\n                </div>\n                <input name="password2" ng-model="auth.registerData.password2" ng-model-options="{ debounce: 200 }" ng-change="auth.checkPasswords()" placeholder="Confirm Password" type="password" required>\n                <div class="validation" ng-if="registerForm.password2.$dirty && auth.passwordError">Passwords must match</div>\n                <button type="submit" ng-disabled="registerForm.$invalid || auth.submissionDisabled || auth.passwordError">Register</button>\n            </form>\n            <div class="switch">\n                <div class="message">Don\'t have an account?</div>\n                <button ng-click=\'auth.switchTo("register")\'>Register</button>\n            </div>\n        </div>\n    </div>\n\n</div>\n'),e.put("app/baseline/list.html",'<div class="search">\n    <div class="actions">\n        <input class="input" type="text" ng-model="list.nameFilter" ng-model-options="{debounce: 150}" ng-change="list.updateFilters()" placeholder="Search">\n\n        <div class="buttons">\n            <button ng-click="list.showOutstanding()">Filter By Outstanding</button>\n            <button ng-click="list.showAll()">Show All</button>\n        </div>\n    </div>\n    <div class="filter">\n        Currently filtering on:\n        <div class="terms">\n            {{ list.filters.join(\', \') || \'Nothing\'}}\n        </div>\n    </div>\n</div>\n\n<ul class="baseline-list">\n    <div class="baseline-item"\n         ng-repeat="baseline in list.baselines track by baseline._id">\n        <div class="snapshot">\n            <img class="snapshot-image" ng-src={{::"/api/baseline/"+baseline.results[0]._id+"/raw"}}></img>\n            <div class="snapshot-info">\n                <h2 class="name">{{:: baseline._id }}</h2>\n                <ul class="meta">\n                    <li>Created: {{:: ( baseline.dateCreated | date:"dd/MM/yyyy \'at\' h:mma") || \'N/A\' }}</li>\n                    <li>Last Updated By: {{:: baseline.lastUpdatedBy || \'N/A\' }}</li>\n                    <li>Last Updated: {{:: (baseline.lastUpdated | date:"dd/MM/yyyy \'at\' h:mma") || \'N/A\'}}</li>\n                    <li>Browser(s): {{:: list.getBrowsers(baseline) || \'N/A\'}}</li>{{list.test}}\n                    <li>Labels: <tag ng-repeat="label in baseline.labels track by label" value="label" ng-click="list.toggleLabelToFilter(label)"></tag></li>\n                </ul>\n                <div class="snapshot-actions">\n                    <a href="#/snapshot/{{:: baseline._id }}">View Candidates</a>\n                    <a href="#/baseline/{{:: baseline._id }}">View Results</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</ul>\n\n<div ng-show="!list.baselines.length">\n    <div class="error">\n        <div class="face">:)</div>\n        <div class="message">No {{list.filtering ? "matching" : null}} baselines. <span class="highlight">Get out there and find some!</span></div>\n    </div>\n</div>'),e.put("app/baseline/view.html",'<h1 class="title">{{::baseline.name}}</h1>\n<ul class="baseline-list">\n    <div class="baseline-item"\n         ng-repeat="result in baseline.results">\n        <div class="snapshot">\n            <img class="snapshot-image" ng-src={{::"/api/baseline/"+result._id+"/raw"}}></img>\n            <div class="snapshot-info">\n                <h2 class="name">{{:: result.meta.browser }}</h2>\n                <div class="snapshot-actions">\n                    <a href="{{::\'/api/baseline/\'+result._id+\'/raw\'}}">View On Screen</a>\n                    <a ng-click="baseline.remove(result)">Remove Baseline</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</ul>'),e.put("app/error/template.html",'<div class="row">\n    <div class="error">\n        <div class="face">:(</div>\n        <div class="message">Some error happened. Probably a <span class="highlight">404</span>.</div>\n    </div>\n</div>\n'),e.put("app/loader/template.html",'<div class="loader-container" title="Loading" ng-class="{visible: ctrl.displayed}">\n    <div class="loader"></div>\n</div>\n'),e.put("app/snapshot/template.html",'<h1 class="title">{{::name}}</h1>\n<ul>\n  <div class="comparison" ng-repeat="snapshot in snapshots track by snapshot._id">\n    <div class="taken">\n        <div>Date Taken: <span class="highlight">{{snapshot.dateCreated | date:"dd/MM/yyyy \'at\' h:mma"}}</span></div>\n        <div>Browser: <span class="highlight">{{snapshot.meta.browser}}</span></div>\n        <div class="comparison-actions">\n            <a class="button delete" ng-click="removeSnapshot(snapshot._id)">Remove This Candidate</a>\n            <a class="button promote" ng-click="promoteCandidate(snapshot.candidate)">Baseline This Candidate</a>\n        </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/baseline/{{::snapshot.baseline}}/raw" alt="{{::snapshot.name}} Baseline"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Baseline</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/baseline/{{::snapshot.baseline}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/diff/{{::snapshot.name}}/{{::snapshot._id}}/raw" alt="{{::snapshot.name}} Diff"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Difference</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/diff/{{::snapshot.name}}/{{::snapshot._id}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n    <div class="snapshot">\n      <img class="snapshot-image" ng-src="/api/candidate/{{::snapshot.name}}/{{::snapshot.candidate}}/raw" alt="{{::snapshot.name}} Candidate"></img>\n      <div class="snapshot-info">\n        <h2 class="name">Candidate</h2>\n        <div class="snapshot-actions">\n          <a target="_blank" ng-href="/api/candidate/{{::snapshot.name}}/{{::snapshot.candidate}}/raw">Open in tab</a>\n        </div>\n      </div>\n    </div>\n\n\n  </div>\n</ul>\n\n<div ng-show="!snapshots.length">\n    <div class="error">\n        <div class="face">:)</div>\n        <div class="message">No differences. Either every snapshot passes <span class="highlight ">the acceptance threshold</span>, you recently\n            <span class="highlight ">baselined a candidate</span> or you <span class="highlight ">haven\'t sent any</span>.</div>\n    </div>\n</div>\n'),e.put("app/tag/template.html",'<span class="tag" title="{{:: ctrl.value }}">\n    {{:: ctrl.value}}\n</span>\n'),e.put("app/user/list.html",'<div class="container">\n    <h1 class="title">Users List</h1>\n    <table class="table">\n        <thead>\n            <tr>\n                <th>User ID</th>\n                <th>First Name</th>\n                <th>Last Name</th>\n                <th>Email</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr ng-repeat="user in list.users track by user._id">\n                <td data-label="User ID"><a href="/#/user/{{::user._id}}">{{::user._id}}</a></td>\n                <td data-label="First Name">{{::user.firstName}}</td>\n                <td data-label="Last Name">{{::user.lastName}}</td>\n                <td data-label="Email">{{::user.email}}</td>\n            </tr>\n        </tbody>\n\n    </table>\n</div>\n'),e.put("app/user/manage.html",'<div class="container">\n    <div class="profile">\n        <div class="profile-cover">\n            <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none">\n             <defs>\n              <path\n                id="wave"\n                 d="m -160,44.4 c 30,0 58,\n                    -18 87.7,-18 30.3,0 58.3,\n                    18 87.3,18 30,0 58,-18 88,\n                    -18 30,0 58,18 88,18 l 0,\n                    34.5 -351,0 z" />\n             </defs>\n              <g class="parallax">\n               <use class="wave" xlink:href="#wave" x="0" y="0" fill="#3461c1"/>\n               <use class="wave" xlink:href="#wave" x="50" y="0" fill="#2d55aa"/>\n              </g>\n            </svg>\n        </div>\n        <img class="profile-image" src="{{::\'/api/user/\'+ctrl.user._id+\'/avatar\'}}" alt="Avatar">\n        <div class="profile-main">\n            <h2 class="profile-title">\n        {{::ctrl.user.firstName}}\n        {{::ctrl.user.lastName}}\n      </h2>\n            <div class="profile-social">\n                <a ng-if="::ctrl.user.social.github" href="http://github.com/{{::ctrl.user.social.github}}"><i class="fa fa-github" aria-hidden="true"></i> {{::ctrl.user.social.github}}</a>\n                <a ng-if="::ctrl.user.social.website" href="{{::ctrl.user.social.website}}"><i class="fa fa-code" aria-hidden="true"></i>  {{::ctrl.user.social.website}}</a>\n                <a ng-if="::ctrl.user.email" href="{{::ctrl.user.email}}"><i class="fa fa-envelope" aria-hidden="true"></i> {{::ctrl.user.email}}</a>\n            </div>\n        </div>\n        <div class="profile-info">\n            <h3>Some More Information</h3>\n            <h3>Recent Images</h3>\n        </div>\n    </div>\n\n</div>\n'),e.put("app/user-dropdown/template.html",'<div class="nav">\n    <div class="nav-icon">\n        <a><i class="fa fa-user fa-2x"></i> </a>\n    </div>\n    <div class="nav-dropdown">\n        <div class="user-info" ng-if="user.loggedIn">\n            <img class="user-avatar" ng-src="{{::user.profile.avatar}}" alt="Avatar">\n            <div class="user-name">{{::user.profile.firstName}} {{::user.profile.lastName}}</div>\n        </div>\n        <ul class="nav-actions">\n            <li><a href="/#/baseline">Baselines</a></li>\n            <li ng-if="user.loggedIn"><a href="/#/user">Users</a></li>\n            <li ng-if="!user.loggedIn"><a href="/#/login">Login</a></li>\n            <li ng-if="user.loggedIn"><a href="/#/logout">Logout</a></li>\n        </ul>\n    </div>\n</div>\n')}]),function(e){e.config(["$routeProvider",function(e){e.when("/user",{templateUrl:"app/user/list.html",controller:"UserListController as list",bindToController:!0,authenticate:!0,resolve:{users:["UserService",function(e){return e.listUsers()}]}}).when("/user/:id",{templateUrl:"app/user/manage.html",controller:"UserController as ctrl",bindToController:!0,authenticate:!0,resolve:{user:["UserService","$route",function(e,t){return e.fetchUser(t.current.params.id)}]}})}])}(angular.module("user.config",["ngRoute"])),function(e){e.controller("UserListController",["users",function(e){var t=this;t.users=e}]),e.controller("UserController",["user",function(e){var t=this;t.user=e}])}(angular.module("user.controller",[])),angular.module("user",["user.controller","user.service","user.config","authentication"]),function(e){e.service("UserService",["$http",function(e){var t={listUsers:function(){return e.get("/api/user").then(function(e){return e.data},function(e){throw e.status+" : "+e.data.error})},fetchUser:function(t){return e.get("/api/user/"+t).then(function(e){return e.data},function(e){throw e.status+" : "+e.data.error})}};return t}])}(angular.module("user.service",[])),function(e){e.directive("userDropdown",function(){return{restrict:"E",controller:"UserDropdownController",bindToController:!0,controllerAs:"user",templateUrl:"app/user-dropdown/template.html"}}),e.controller("UserDropdownController",["Authentication","$scope",function(e,t){var n=this;t.$watch(e.isLoggedIn,function(t){n.loggedIn=t,t?(n.profile=e.getToken().user,n.profile.avatar||(n.profile.avatar="/api/user/"+n.profile._id+"/avatar")):delete this.profile})}])}(angular.module("user-dropdown",["authentication"])),!function(){"use strict";function e(e,t,n,a,s,i,r){function o(e){if(e)p(e.toastId);else for(var t=0;t<w.length;t++)p(w[t].toastId)}function l(e,t,n){var a=h().iconClasses.error;return g(a,e,t,n)}function u(e,t,n){var a=h().iconClasses.info;return g(a,e,t,n)}function c(e,t,n){var a=h().iconClasses.success;return g(a,e,t,n)}function d(e,t,n){var a=h().iconClasses.warning;return g(a,e,t,n)}function p(t,n){function a(e){for(var t=0;t<w.length;t++)if(w[t].toastId===e)return w[t]}function s(){return!w.length}var o=a(t);o&&!o.deleting&&(o.deleting=!0,o.isOpened=!1,e.leave(o.el).then(function(){o.scope.options.onHidden&&o.scope.options.onHidden(n),o.scope.$destroy();var e=w.indexOf(o);delete y[o.scope.message],w.splice(e,1);var t=i.maxOpened;t&&w.length>=t&&w[t-1].open.resolve(),s()&&(v.remove(),v=null,$=r.defer())}))}function g(e,t,n,a){return angular.isObject(n)&&(a=n,n=null),f({iconClass:e,message:t,optionsOverride:a,title:n})}function h(){return angular.extend({},i)}function m(t){if(v)return $.promise;v=angular.element("<div></div>"),v.attr("id",t.containerId),v.css({"pointer-events":"auto"});var n=angular.element(document.querySelector(t.target));if(!n||!n.length)throw"Target for toasts doesn't exist";return e.enter(v,n).then(function(){$.resolve()}),$.promise}function f(n){function i(e,t,n){n.allowHtml?(e.scope.allowHtml=!0,e.scope.title=s.trustAsHtml(t.title),e.scope.message=s.trustAsHtml(t.message)):(e.scope.title=t.title,e.scope.message=t.message),e.scope.toastType=e.iconClass,e.scope.toastId=e.toastId,e.scope.options={extendedTimeOut:n.extendedTimeOut,messageClass:n.messageClass,onHidden:n.onHidden,onShown:n.onShown,progressBar:n.progressBar,tapToDismiss:n.tapToDismiss,timeOut:n.timeOut,titleClass:n.titleClass,toastClass:n.toastClass},n.closeButton&&(e.scope.options.closeHtml=n.closeHtml)}function o(){function e(e){for(var t=["containerId","iconClasses","maxOpened","newestOnTop","preventDuplicates","preventOpenDuplicates","templates"],n=0,a=t.length;a>n;n++)delete e[t[n]];return e}var t={toastId:b++,isOpened:!1,scope:a.$new(),open:r.defer()};return t.iconClass=n.iconClass,n.optionsOverride&&(d=angular.extend(d,e(n.optionsOverride)),t.iconClass=n.optionsOverride.iconClass||t.iconClass),i(t,n,d),t.el=l(t.scope),t}function l(e){var n=angular.element("<div toast></div>"),a=t.get("$compile");return a(n)(e)}function u(){return d.maxOpened&&w.length<=d.maxOpened||!d.maxOpened}function c(){var e=d.preventDuplicates&&n.message===C,t=d.preventOpenDuplicates&&y[n.message];return!(!e&&!t)||(C=n.message,y[n.message]=!0,!1)}var d=h();if(!c()){var g=o();if(w.push(g),d.autoDismiss&&d.maxOpened>0)for(var f=w.slice(0,w.length-d.maxOpened),$=0,O=f.length;O>$;$++)p(f[$].toastId);return u()&&g.open.resolve(),g.open.promise.then(function(){m(d).then(function(){if(g.isOpened=!0,d.newestOnTop)e.enter(g.el,v).then(function(){g.scope.init()});else{var t=v[0].lastChild?angular.element(v[0].lastChild):null;e.enter(g.el,v,t).then(function(){g.scope.init()})}})}),g}}var v,b=0,w=[],C="",y={},$=r.defer(),O={clear:o,error:l,info:u,remove:p,success:c,warning:d};return O}angular.module("toastr",[]).factory("toastr",e),e.$inject=["$animate","$injector","$document","$rootScope","$sce","toastrConfig","$q"]}(),function(){"use strict";angular.module("toastr").constant("toastrConfig",{allowHtml:!1,autoDismiss:!1,closeButton:!1,closeHtml:"<button>&times;</button>",containerId:"toast-container",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},maxOpened:0,messageClass:"toast-message",newestOnTop:!0,onHidden:null,onShown:null,preventDuplicates:!1,preventOpenDuplicates:!1,progressBar:!1,tapToDismiss:!0,target:"body",templates:{toast:"directives/toast/toast.html",progressbar:"directives/progressbar/progressbar.html"},timeOut:5e3,titleClass:"toast-title",toastClass:"toast"})}(),function(){"use strict";function e(e){function t(e,t,n,a){function s(){var e=(o-(new Date).getTime())/r*100;t.css("width",e+"%")}var i,r,o;a.progressBar=e,e.start=function(e){i&&clearInterval(i),r=parseFloat(e),o=(new Date).getTime()+r,i=setInterval(s,10)},e.stop=function(){i&&clearInterval(i)},e.$on("$destroy",function(){clearInterval(i)})}return{replace:!0,require:"^toast",templateUrl:function(){return e.templates.progressbar},link:t}}angular.module("toastr").directive("progressBar",e),e.$inject=["toastrConfig"]}(),function(){"use strict";function e(){this.progressBar=null,this.startProgressBar=function(e){this.progressBar&&this.progressBar.start(e)},this.stopProgressBar=function(){this.progressBar&&this.progressBar.stop()}}angular.module("toastr").controller("ToastController",e)}(),function(){"use strict";function e(e,t,n,a){function s(n,s,i,r){function o(e){return r.startProgressBar(e),t(function(){r.stopProgressBar(),a.remove(n.toastId)},e,1)}function l(){n.progressBar=!1,r.stopProgressBar()}function u(){return n.options.closeHtml}var c;if(n.toastClass=n.options.toastClass,n.titleClass=n.options.titleClass,n.messageClass=n.options.messageClass,n.progressBar=n.options.progressBar,u()){var d=angular.element(n.options.closeHtml),p=e.get("$compile");d.addClass("toast-close-button"),d.attr("ng-click","close()"),p(d)(n),s.prepend(d)}n.init=function(){n.options.timeOut&&(c=o(n.options.timeOut)),n.options.onShown&&n.options.onShown()},s.on("mouseenter",function(){l(),c&&t.cancel(c)}),n.tapToast=function(){n.options.tapToDismiss&&n.close(!0)},n.close=function(e){a.remove(n.toastId,e)},s.on("mouseleave",function(){(0!==n.options.timeOut||0!==n.options.extendedTimeOut)&&(n.$apply(function(){n.progressBar=n.options.progressBar}),c=o(n.options.extendedTimeOut))})}return{replace:!0,templateUrl:function(){return n.templates.toast},controller:"ToastController",link:s}}angular.module("toastr").directive("toast",e),e.$inject=["$injector","$interval","toastrConfig","toastr"]}(),angular.module("toastr").run(["$templateCache",function(e){e.put("directives/progressbar/progressbar.html",'<div class="toast-progress"></div>\n'),e.put("directives/toast/toast.html",'<div class="{{toastClass}}" ng-click="tapToast()">\n  <div ng-switch on="allowHtml">\n    <div ng-switch-default ng-if="title" class="{{titleClass}}">{{title}}</div>\n    <div ng-switch-default class="{{messageClass}}">{{message}}</div>\n    <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>\n    <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>\n  </div>\n  <progress-bar ng-if="progressBar"></progress-bar>\n</div>\n')}]);