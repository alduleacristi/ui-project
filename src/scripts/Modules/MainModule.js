var app = angular.module('mainApp', ['ngRoute', 'ngResource', 'ui.grid', 'ui.grid.pagination', 'crumble', 'uiGmapgoogle-maps', 'ui.bootstrap', 'highcharts-ng', 'restModule', 'angularSpinner', 'ui.grid.expandable', 'restangular', 'ui-listView', 'rzModule']);

app.config(['$routeProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
     .when('/', {
            templateUrl: 'resources/templates/Home.html',
            controller: '',
            label: 'Home',
      })
      .when('/login', {
            templateUrl: 'resources/templates/Login.html',
            controller: 'SecurityController',
            label: 'Login',
      })
      .when('/notAuthorized', {
            templateUrl: 'resources/templates/notAuthorized.html',
            controller: '',
            label: '',
      })
      .when('/turism', {
          templateUrl: 'resources/templates/Turism.html',
          label: 'Turism',
          /*resolve: { //Here we would use all the hardwork we have done
              //above and make call to the authorization Service
              //resolve is a great feature in angular, which ensures that a route
              //controller (in this case superUserController ) is invoked for a route
              //only after the promises mentioned under it are resolved.
              permission: function (authorizationService, $route) {
                  return authorizationService.permissionCheck([roles.USER]);
              },
          }*/
      })
      .when('/prediction', {
          templateUrl: 'resources/templates/Prediction.html',
          label: 'Prediction',
      })
      .when('/prediction/searchForRegion', {
             templateUrl: 'resources/templates/PredictionSearchForRegion.html',
             controller: 'PredictionSearchForRegionController',
             label: 'Search for region'
       })
       .when('/prediction/allRegions', {
          templateUrl: 'resources/templates/PredictionAllRegions.html',
          controller: 'PredictionAllRegionsController',
          label: 'All regions',
      })
      .when('/prediction/:regionId', {
             templateUrl: 'resources/templates/PredictionRegion.html',
             controller: 'PredictionRegionController',
             label: 'Region'
       })
      .when('/turism/allRegions', {
          templateUrl: 'resources/templates/TurismAllRegions.html',
          controller: 'TurismAllRegionsController',
          label: 'All regions',
      })
      .when('/turism/searchForRegion', {
             templateUrl: 'resources/templates/TurismSearchForRegion.html',
             controller: 'TurismSearchForRegionController',
             label: 'Search for region'
       })
      .when('/turism/:regionId', {
             templateUrl: 'resources/templates/TurismRegion.html',
             controller: 'TurismRegionController',
             label: 'Region'
       })
      .when('/platform', {
            templateUrl: 'resources/templates/Platform.html',
            controller: 'PlatformStatusController',
            label: 'Platform',
      })
      .when('/platform/status', {
            templateUrl: 'resources/templates/PlatformStatus.html',
            controller: 'PlatformStatusController',
            label: 'Status'
      })
      .when('/platform/newRegion', {
          templateUrl: 'resources/templates/PlatformNewRegion.html',
          controller: 'PlatformNewRegionController',
          label: 'Add new region'
      })
      .when('/platform/queryManager', {
             templateUrl: 'resources/templates/QueryManager.html',
             controller: 'QueryManagerController',
             label: 'Query manager'
      })
      .when('/platform/queryManager/:regionId', {
            templateUrl: 'resources/templates/QueryManagerRegion.html',
            controller: 'QueryManagerRegionController',
            label: '{{region.name}}'
        })
      .otherwise({
          redirectTo: '/'
      });
    //$locationProvider.html5Mode(true);
}]);

var verifyIfContains = function(roles, role){
    for (var i = 0; i < roles.length; i++) {
        if (roles[i] == role) {
            return true;
        }
    }

    return false;
}

app.factory('authorizationService', function ($q, $rootScope, $location, Auth) {
    return {
        // We would cache the permission for the session,
        //to avoid roundtrip to server
        //for subsequent requests

        permissionModel: {
            permission: {},
            isPermissionLoaded: false
        },

        permissionCheck: function (roleCollection) {

            // we will return a promise .
            var deferred = $q.defer();

            //this is just to keep a pointer to parent scope from within promise scope.
            var parentPointer = this;

            //Checking if permission object(list of roles for logged in user) 
            //is already filled from service
            if (this.permissionModel.isPermissionLoaded) {
                //Check if the current user has required role to access the route
                this.getPermission(this.permissionModel, roleCollection, deferred);
            } else {
                //if permission is not obtained yet, we will get it from  server.
                // 'api/permissionService' is the path of server web service , used for this example.

                /*$resource('/api/permission').get().$promise.then(function (response) {
                    //when server service responds then we will fill the permission object
                    parentPointer.permissionModel.permission = response;

                    //Indicator is set to true that permission object is filled and 
                    //can be re-used for subsequent route request for the session of the user
                    parentPointer.permissionModel.isPermissionLoaded = true;

                    //Check if the current user has required role to access the route
                    parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
                });*/

                Auth.get("permission").then(function (result) {
                    //when server service responds then we will fill the permission object
                    console.log("Result: ", result);
                    parentPointer.permissionModel.permission = result.roles;

                    //Indicator is set to true that permission object is filled and 
                    //can be re-used for subsequent route request for the session of the user
                    parentPointer.permissionModel.isPermissionLoaded = true;

                    //Check if the current user has required role to access the route
                    parentPointer.getPermission(parentPointer.permissionModel, roleCollection, deferred);
                }, function (response) {
                    console.error("Failed to get permissions", response.status, response.statusText);
                    if (response.status == "401") {
                        $location.path(loginRoute);
                    }
                    
                });
            }
            return deferred.promise;
        },

        //Method to check if the current user has required role to access the route
        //'permissionModel' has permission information obtained from server for current user
        //'roleCollection' is the list of roles which are authorized to access route
        //'deferred' is the object through which we shall resolve promise
        getPermission: function (permissionModel, roleCollection, deferred) {
            var ifPermissionPassed = false;

            angular.forEach(roleCollection, function (role) {
                console.log("Role collection: ", roleCollection);
                console.log("Permission model: ", permissionModel.permission);

                if (verifyIfContains(permissionModel.permission, role)) {
                    ifPermissionPassed = true;
                }

                /*switch (role) {
                    case roles.GUEST:
                        if (verifyIfContains(permissionModel.permission, role)) {
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
                }*/
            });
            if (!ifPermissionPassed) {
                //If user does not have required access, 
                //we will route the user to unauthorized access page
                $location.path(routeForUnauthorizedAccess);
                //As there could be some delay when location change event happens, 
                //we will keep a watch on $locationChangeSuccess event
                // and would resolve promise when this event occurs.
                $rootScope.$on('$locationChangeSuccess', function (next, current) {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
        }
    };
});

app.run(function ($rootScope, crumble) {
    $rootScope.$on('$routeChangeSuccess', function () {
        crumble.update();
        $rootScope.crumble = crumble
    });
})

app.controller("MainController", function ($scope, Restangular, Auth) {
//    $scope.$on('$viewContentLoaded', function () {        
//        Auth.get("permission").then(function (result) {
//            
//            console.log("Permissions: ", result);
//            $scope.authenticated = true;
//        }, function (response) {
//            console.error("Failed to get permissions", response.status, response.statusText);
//            $scope.authenticated = false;
//
//        });
//    });

    $scope.authenticated = false;
    $scope.$on("authOK", function (event, data) {
        console.log("authOK was fired...", data);
        $scope.authenticated = true;
        $scope.user = data;
    })

    $scope.logout = function () {
        Restangular.one("auth").customPOST({}, "logout").then(function (result) {
            console.log("Logout: ", result);
            $scope.authenticated = false;
        }, function (response) {
            console.log("Authentication: ", response);
        });
    };
});

var DATABASE_NAME = "turism";
var roles = {
    ADMIN: "ADMIN",
    USER: "USER",
    GUEST: "GUEST"
};
var routeForUnauthorizedAccess = '/notAuthorized';
var loginRoute = '/login'