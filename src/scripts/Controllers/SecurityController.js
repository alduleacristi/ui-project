app.controller("SecurityController", function ($scope, $location, Auth, Authentication, Restangular) {
    $scope.login = function () {
        console.log("Login was called...", $scope.vm.username, $scope.vm.password);
        var authObj = {
            email: $scope.vm.username,
            password: $scope.vm.password
        }

        Restangular.one("auth").customPOST(authObj, "authentication").then(function (result) {
            console.log("Authentication: ", result);
            $scope.$emit("authOK", result.plain());
            $location.path("/home");
        }, function (response) {
            console.log("Authentication: ", response);
        });
    };
});