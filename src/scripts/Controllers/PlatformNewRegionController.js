app.controller("PlatformNewRegionController", function ($scope, $rootScope, Region, IngestRegion, usSpinnerService) {
    $scope.map = {
        center: {
            latitude: 45.65288, longitude: 25.61184
        },
        zoom: 11,
        bounds: {},
        events: {
            click: function (map, eventName, originalEventArgs) {
                console.info("Click pressed...")
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(), lon = e.latLng.lng();
                console.log(lat)
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: lat,
                        longitude: lon
                    }
                };
                var polygonPoint = {
                    latitude: lat,
                    longitude: lon
                };
                $scope.polygons[0].path.push(polygonPoint);
                $scope.markers.push(marker)
                $scope.region.coords.points.push(polygonPoint);
                $scope.$apply();
            }
        }
    }
 
    $scope.polygons = [{
        id: 1,
        path: []
    }];
   
    $scope.markers = [];
    $scope.markerOptions = { draggable: true }
    $scope.markerEvents = {
        drag: function (map, eventName, originalEventArgs) {
            console.info("Marker moved...", originalEventArgs.getGMarker().key, originalEventArgs.getGMarker().position.lat(), originalEventArgs.getGMarker().position.lng())
            $scope.polygons[0].path = [];
            $scope.markers.forEach(function (marker, index, array) {
                console.log(marker.coords);
                $scope.polygons[0].path.push(marker.coords);
            });
            $scope.$apply();
        }
    }

    $scope.region = {
        name: "",
        coords: {
            points: []
        }
    };
    $scope.alerts = [];

    $scope.saveRegion = function () {
        $scope.alerts = [];
        if ($scope.region.name == "") {
            $scope.alerts.push(nmeIsEmptyAlert);
            return;
        };

        $scope.region.id = null;

        var getParams = function (points) {
            var params = { regionName: "", year: new Date().getFullYear(), dbName: "turism" };
            var minLat = 999999999, minLon = 999999999;
            var maxLat = -999999999, maxLon = -999999999;
            for (var i = 0; i < points.length; i++) {
                if (points[i].latitude < minLat) {
                    minLat = points[i].latitude;
                }
                if (points[i].latitude > maxLat) {
                    maxLat = points[i].latitude;
                }
                if (points[i].longitude < minLon) {
                    minLon = points[i].longitude;
                }
                if (points[i].longitude > maxLon) {
                    maxLon = points[i].longitude;
                }
            }

            params.minLon = minLon;
            params.maxLon = maxLon;
            params.minLat = minLat;
            params.maxLat = maxLat;

            return params;
        }

        $scope.startSpin();

        var params = getParams($scope.region.coords.points);
        params.regionName = $scope.region.name;
        if ($scope.region.coords.points.length < 3) {
            var notEnoughpointsAlert = {
                type: 'danger', msg: "You must have at least 3 points selected.", id: "NotEnoughPoints"
            };
            $scope.alerts.push(notEnoughpointsAlert);
            $scope.stopSpin();
            return;
        };

        IngestRegion.post({}, params).then(function (result) {
            $scope.stopSpin();
            var successAlert = {
                type: 'info', msg: "Data about this new region was ingested with success.", id: "Success"
            };
            $scope.alerts.push(successAlert);
        }, function (response) {
            var msg = "Failed to ingest data. ";
            if (response.data != null && response.data != undefined) {
                msg = msg + response.data;
            }
            var failedAlert = {
                type: 'danger', msg: msg, id: "Failed"
            };
            $scope.stopSpin();
            $scope.alerts.push(failedAlert);
        });
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    var nmeIsEmptyAlert = {
        type: 'danger', msg: "You must give a name to the region.", id:"NameIsEmpty"
    };

    $scope.startSpin = function () {
        usSpinnerService.spin('spinner-1');
    }
    $scope.stopSpin = function () {
        usSpinnerService.stop('spinner-1');
    }
});