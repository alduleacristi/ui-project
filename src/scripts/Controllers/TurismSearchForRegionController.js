app.controller("TurismSearchForRegionController", function($scope, $location,
		Region) {
	$scope.openStatistics = function(region) {
		$location.path('/turism/' + region.idRegion)
	}
});
