app.controller("SecurityController", function($scope, $location, Auth,
		Authentication, Restangular, sha256) {
	$scope.login = function() {
		console.log("Login was called...", $scope.vm.username,
				$scope.vm.password);
		var authObj = {
			email : $scope.vm.username,
			password : sha256.convertToSHA256($scope.vm.password)
		// password : $scope.vm.password
		}

		Restangular.one("auth").customPOST(authObj, "authentication").then(
				function(result) {
					console.log("Authentication: ", result);
					sessionStorage.setItem('user', JSON.stringify(result
							.plain()));
					$scope.$emit("authOK", result.plain());
					$location.path("/platform");
				}, function(response) {
					console.log("Authentication: ", response.status);

					var failedAlert = {
						type : 'danger',
						msg : "Invalid username or password",
						id : "Failed"
					};

					$scope.alerts = [];
					$scope.alerts.push(failedAlert);
				});
	};
});