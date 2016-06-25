app.controller("PredictionSearchForRegionController", function($scope, $location,
		Region) {
	$scope.openStatistics = function(region) {
		$location.path('/prediction/' + region.idRegion)
	}
});

