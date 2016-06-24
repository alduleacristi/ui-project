app.controller("TurismSearchForRegionController", function($scope, $location, Region) {
	$scope.openStatistics = function (region) {
	    $location.path('/turism/'+region.idRegion)
	}
});

app.directive('typeahead', function($timeout, $http, Restangular) {
	return {
		restrict : 'AEC',
		scope : {
			title : '@',
			retkey : '@',
			displaykey : '@',
			region : '=',
			subtitle : '@',
			modelret : '='
		},
		link : function(scope, elem, attrs) {
			scope.current = 0;
			scope.selected = false;

			scope.da = function(txt) {
				scope.ajaxClass = 'loadImage';

				// $http({method: 'Get', url: 'Account_JSON?AccName='+txt}).
				// success(function(data, status) {
				// scope.TypeAheadData = data;
				// scope.ajaxClass = '';
				// }) ;
				console.log("Call for: ", scope.regionName);
				Restangular.all("searchRegion?name=" + txt).get("").then(
						function(result) {
							console.log("Result comes: ", result.plain());
							scope.TypeAheadData = result.plain();
							scope.ajaxClass = '';
						}, function(result) {
							console.error("Failed search region", result);
						})

			}

			scope.handleSelection = function(region) {
				console.log("Handle selection was called...")

				scope.region = region;
				scope.regionName = region.name;
				scope.current = 0;
				scope.selected = true;
			}

			scope.isCurrent = function(index) {
				return scope.current == index;
			}

			scope.setCurrent = function(index) {
				scope.current = index;
			}
		},
		templateUrl : '/resources/templates/Search.html'
	};
});
