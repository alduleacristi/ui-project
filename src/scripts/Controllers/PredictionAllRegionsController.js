app.controller("PredictionAllRegionsController", function ($scope, $uibModal, $location, Region, uiGridConstants) {
    var buildMap = function (minLat, maxLat, minLon, maxLon) {
        var map = {
            center: {
                latitude: (maxLat+minLat) / 2 , longitude: (minLon+maxLon)/2
            },
            zoom: 5,
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
        
        Region.getList({type: "prediction"}).then(function (result) {
            var resultData = result.plain();

            for (var i = 0; i < resultData.length; i++) {
                resultData[i].map = buildMap(resultData[i].minLat, resultData[i].maxLat, resultData[i].minLon, resultData[i].maxLon);
                resultData[i].map.polygons = buildPolygons(resultData[i].minLat, resultData[i].maxLat, resultData[i].minLon, resultData[i].maxLon);
                resultData[i].map.markers = buildMarkers(resultData[i].minLat, resultData[i].maxLat, resultData[i].minLon, resultData[i].maxLon);
                console.log(resultData[i]);
            }
            $scope.grid.data = resultData;
            //$scope.$apply();
            console.info( $scope.grid.data)
        });
    });

    $scope.grid = {
        data: $scope.regions,
        expandableRowTemplate: 'resources/templates/RegionGridExpandable.html',
        expandableRowHeight: 100,
        paginationPageSizes: [10, 15, 20],
        paginationPageSize: 10,

        columnDefs: [{
            name: 'name', displayName: 'Name', width: '30%'
        }, {
            name: 'startYear', displayName: 'First Year', width: '20%'
        }, {
            name: 'endYear', displayName: 'Last Year', width: '20%'
        },{
            name: 'map',
            displayName: 'Map',
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-primary" ng-click="grid.appScope.openMap(row.entity)">Open</button></div>'
        }, {
            name: 'id',
            displayName: 'Statistics',
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-primary" ng-click="grid.appScope.openStatistics(row.entity)">View</button></div>'
        }]
};

$scope.openMap = function (region) {
    console.log("Open map was called: ",region);

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

$scope.openStatistics = function (region) {
    console.log("Try to open new region: ",region.idRegion)
    $location.path('/prediction/'+region.idRegion)
}
});