app.controller("GoogleMapsController", ["$scope", function ($scope) {
    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });

    $scope.changeInput = function () {
        console.info("Bau")
        console.info($scope.input.lat);
    }
}]);