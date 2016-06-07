app.controller("QueryManagerController", function ($scope, $uibModal, $location, Region, uiGridConstants) {
    var buildMap = function (minLat, maxLat, minLon, maxLon) {
        var map = {
            center: {
                latitude: (maxLat + minLat) / 2, longitude: (minLon + maxLon) / 2
            },
            zoom: 10,
            bounds: {},
        }

        return map;
    };

    var buildPolygons = function (minLat, maxLat, minLon, maxLon) {
        var polygons = [{
            id: 1,
            path: []
        }];
        var polygonPoint1 = {
            latitude: minLat,
            longitude: minLon
        };
        var polygonPoint2 = {
            latitude: minLat,
            longitude: maxLon
        };
        var polygonPoint3 = {
            latitude: maxLat,
            longitude: maxLon
        };
        var polygonPoint4 = {
            latitude: maxLat,
            longitude: minLon
        };

        polygons[0].path.push(polygonPoint1);
        polygons[0].path.push(polygonPoint2);
        polygons[0].path.push(polygonPoint3);
        polygons[0].path.push(polygonPoint4);

        return polygons;
    };

    var buildMarkers = function (minLat, maxLat, minLon, maxLon) {
        var markers = [];

        var marker1 = {
            id: Date.now(),
            coords: {
                latitude: minLat,
                longitude: minLon
            }
        };
        var marker2 = {
            id: Date.now(),
            coords: {
                latitude: minLat,
                longitude: maxLon
            }
        };
        var marker3 = {
            id: Date.now(),
            coords: {
                latitude: maxLat,
                longitude: minLon
            }
        };
        var marker4 = {
            id: Date.now(),
            coords: {
                latitude: maxLat,
                longitude: maxLon
            }
        };

        markers.push(marker1);
        markers.push(marker2);
        markers.push(marker3);
        markers.push(marker4);

        return markers;
    };

    $scope.$on('$viewContentLoaded', function () {

        Region.getList().then(function (result) {
            var resultData = result.plain();

            for (var i = 0; i < resultData.length; i++) {
                resultData[i].map = buildMap(resultData[i].minLat, resultData[i].maxLat, resultData[i].minLon, resultData[i].maxLon);
                resultData[i].map.polygons = buildPolygons(resultData[i].minLat, resultData[i].maxLat, resultData[i].minLon, resultData[i].maxLon);
                resultData[i].map.markers = buildMarkers(resultData[i].minLat, resultData[i].maxLat, resultData[i].minLon, resultData[i].maxLon);
                console.log(resultData[i]);
            }
            $scope.grid.data = resultData;
            //$scope.$apply();
            console.info($scope.grid.data)
        });
    });

    $scope.grid = {
        data: $scope.regions,
        paginationPageSizes: [10, 15, 20],
        paginationPageSize: 10,
        enableFiltering: true,
        columnDefs: [{
            name: 'name', displayName: 'Name', width: '20%'
        }, {
            name: 'startYear', displayName: 'First Year', width: '10%',
            enableFiltering: false
        }, {
            name: 'endYear', displayName: 'Last Year', width: '10%',
            enableFiltering: false
        }, {
            name: 'maxLat',
            displayName: 'Max lat',
            enableFiltering: false
        }, {
            name: 'minLat',
            displayName: 'Min lat',
            enableFiltering: false
        }, {
            name: 'maxLon',
            displayName: 'Max lon',
            enableFiltering: false
        }, {
            name: 'minLon',
            displayName: 'Min lon',
            enableFiltering: false
        }, {
            name: 'map',
            displayName: 'Map',
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-primary" ng-click="grid.appScope.openMap(row.entity)">Open map</button></div>',
            enableFiltering: false
        }, {
            name: 'id',
            displayName: 'Query manager',
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-primary" ng-click="grid.appScope.openQueryManager(row.entity)">View</button></div>',
            enableFiltering: false
        }]
    };

    $scope.openMap = function (region) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'resources/templates/UiGridMap.html',
            controller: 'ModalMapController',
            size: 'lg',
            resolve: {
                region: region
            }
        });
    };

    $scope.openQueryManager = function (region) {
        console.log(region.idRegion)
        $location.path('/platform/queryManager/' + region.idRegion)
    }
});