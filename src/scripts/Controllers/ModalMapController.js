app.controller("ModalMapController", function ($scope, $uibModalInstance, region) {
    $scope.region = region;
    $scope.render = true;

    $scope.close = function () {
        console.log("Region: ",$scope.region);

        $uibModalInstance.dismiss('cancel');
    };
});