var app = angular.module('mainApp', [ 'ngRoute', 'ngResource', 'ui.grid',
		'ui.grid.pagination', 'crumble', 'uiGmapgoogle-maps', 'ui.bootstrap',
		'highcharts-ng', 'restModule', 'angularSpinner', 'ui.grid.expandable',
		'restangular', 'ui-listView', 'rzModule', 'angular-encryption' ]);

app.config([ '$routeProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl : 'resources/templates/Home.html',
		controller : '',
		label : 'Home',
	}).when('/login', {
		templateUrl : 'resources/templates/Login.html',
		controller : 'SecurityController',
		label : 'Login',
	}).when('/register', {
		templateUrl : 'resources/templates/Register.html',
		controller : 'SecurityController',
		label : 'Register',
	}).when('/notAuthorized', {
		templateUrl : 'resources/templates/notAuthorized.html',
		controller : '',
		label : '',
	}).when('/turism', {
		templateUrl : 'resources/templates/Turism.html',
		label : 'Turism',
	/*
	 * resolve: { //Here we would use all the hardwork we have done //above and
	 * make call to the authorization Service //resolve is a great feature in
	 * angular, which ensures that a route //controller (in this case
	 * superUserController ) is invoked for a route //only after the promises
	 * mentioned under it are resolved. permission: function
	 * (authorizationService, $route) { return
	 * authorizationService.permissionCheck([roles.USER]); }, }
	 */
	}).when('/prediction', {
		templateUrl : 'resources/templates/Prediction.html',
		label : 'Prediction',
	}).when('/prediction/searchForRegion', {
		templateUrl : 'resources/templates/PredictionSearchForRegion.html',
		controller : 'PredictionSearchForRegionController',
		label : 'Search for region'
	}).when('/prediction/allRegions', {
		templateUrl : 'resources/templates/PredictionAllRegions.html',
		controller : 'PredictionAllRegionsController',
		label : 'All regions',
	}).when('/prediction/:regionId', {
		templateUrl : 'resources/templates/PredictionRegion.html',
		controller : 'PredictionRegionController',
		label : 'Region'
	}).when('/turism/allRegions', {
		templateUrl : 'resources/templates/TurismAllRegions.html',
		controller : 'TurismAllRegionsController',
		label : 'All regions',
	}).when('/turism/searchForRegion', {
		templateUrl : 'resources/templates/TurismSearchForRegion.html',
		controller : 'TurismSearchForRegionController',
		label : 'Search for region'
	}).when('/turism/:regionId', {
		templateUrl : 'resources/templates/TurismRegion.html',
		controller : 'TurismRegionController',
		label : 'Region'
	}).when('/platform', {
		templateUrl : 'resources/templates/Platform.html',
		controller : 'PlatformStatusController',
		label : 'Platform',
		resolve : {
			permission : function(authorizationService, $route) {
				return authorizationService.permissionCheck([ roles.ADMIN ]);
			},
		}
	}).when('/platform/status', {
		templateUrl : 'resources/templates/PlatformStatus.html',
		controller : 'PlatformStatusController',
		label : 'Status'
	}).when('/platform/newRegion', {
		templateUrl : 'resources/templates/PlatformNewRegion.html',
		controller : 'PlatformNewRegionController',
		label : 'Add new region'
	}).when('/platform/queryManager', {
		templateUrl : 'resources/templates/QueryManager.html',
		controller : 'QueryManagerController',
		label : 'Query manager'
	}).when('/platform/queryManager/:regionId', {
		templateUrl : 'resources/templates/QueryManagerRegion.html',
		controller : 'QueryManagerRegionController',
		label : '{{region.name}}'
	}).otherwise({
		redirectTo : '/'
	});
	// $locationProvider.html5Mode(true);permissionModel
} ]);

var verifyIfContains = function(roles, role) {
	for (var i = 0; i < roles.length; i++) {
		if (roles[i] == role) {
			return true;
		}
	}

	return false;
}

app.factory(
				'authorizationService',
				function($q, $rootScope, $location, Auth) {
					return {
						permissionModel : {
							permission : {},
							isPermissionLoaded : false
						},

						permissionCheck : function(roleCollection) {
							var deferred = $q.defer();
							var parentPointer = this;

							if (this.permissionModel.isPermissionLoaded) {
								this.getPermission(this.permissionModel,
										roleCollection, deferred);
							} else {
								Auth
										.get("permission")
										.then(
												function(result) {
													parentPointer.permissionModel.permission = result.roles;
													parentPointer.permissionModel.isPermissionLoaded = true;

													// Check if the current user
													// has required role to
													// access the route
													parentPointer
															.getPermission(
																	parentPointer.permissionModel,
																	roleCollection,
																	deferred);
												},
												function(response) {
													console
															.error(
																	"Failed to get permissions",
																	response.status,
																	response.statusText);
													if (response.status == "401") {
														$location
																.path(loginRoute);
													}

												});
							}
							return deferred.promise;
						},
						getPermission : function(permissionModel,
								roleCollection, deferred) {
							var ifPermissionPassed = false;

							angular.forEach(roleCollection, function(role) {
								console
										.log("Role collection: ",
												roleCollection);
								console.log("Permission model: ",
										permissionModel.permission);
								permissionModel
								if (verifyIfContains(
										permissionModel.permission, role)) {
									ifPermissionPassed = true;
								}

								switch (role) {
								case roles.GUEST:
									if (verifyIfContains(
											permissionModel.permission, role)) {
										ifPermissionPassed = true;
									}
									break;
								case roles.ADMIN:
									if (permissionModel.permission.isADMIN) {
										ifPermissionPassed = true;
									}
									break;
								case roles.USER:
									if (permissionModel.permission.isUUSER) {
										ifPermissionPassed = true;
									}
									break;
								default:
									ifPermissionPassed = false;
								}
							});
							if (!ifPermissionPassed) {
								$location.path(routeForUnauthorizedAccess);
								$rootScope.$on('$locationChangeSuccess',
										function(next, current) {
											deferred.resolve();
										});
							} else {
								deferred.resolve();
							}
						},
						
						resetPermission: function(){
							console.log("Reset permission was called...");
							
							this.permissionModel = {
								permission : {},
								isPermissionLoaded : false
							}
							
							console.log("Reset permission was called...", this.permissionModel);
						}
					};
				});

app.run(function($rootScope, crumble) {
	$rootScope.$on('$routeChangeSuccess', function() {
		crumble.update();http://192.168.171.133:8083/#/platform
		$rootScope.crumble = crumble
	});
})

app.controller("MainController", function($scope, Restangular, Auth, authorizationService) {

	$scope.isAutheticated = function() {
		if (sessionStorage.getItem('user') != null) {
			$scope.user = JSON.parse(sessionStorage.getItem('user'));
			//console.log("User: ", $scope.user);
			return true;
		} else {
			return false;
		}
	}

	$scope.logout = function() {
		Restangular.one("auth").customPOST({}, "logout").then(function(result) {
			authorizationService.resetPermission();
			sessionStorage.removeItem('user')
		}, function(response) {
			console.log("Logout: ", response);
		});
	};
});

var DATABASE_NAME = "turism";
var roles = {
	ADMIN : "admin",
	USER : "USER",
	GUEST : "GUEST"
};
var routeForUnauthorizedAccess = '/notAuthorized';
var loginRoute = '/login'