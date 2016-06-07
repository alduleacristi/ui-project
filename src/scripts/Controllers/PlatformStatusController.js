app.controller("PlatformStatusController", function ($scope, Cluster) {
    Cluster.get("info").then(function (result) {
        $scope.clusterInfo = [{
            key: "Started on",
            value: result.plain().clusterInfo.startedOn
        }, {
            key: "State",
            value: result.plain().clusterInfo.state
        }, {
            key: "Resource manager version",
            value: result.plain().clusterInfo.resourceManagerVersion
        }, {
            key: "Hadoop version",
            value: result.plain().clusterInfo.hadoopVersion
        }]
        $scope.clusterInfoOk = true;
        console.info("Cluster info: ", $scope.clusterInfo);
    }, function (status) {
        console.error("Failed to get data about cluster");
        $scope.clusterInfo = [{
            key: "Started on",
            value: "Unknown"
        }, {
            key: "State",
            value: "Unknown"
        }, {
            key: "Resource manager version",
            value: "Unknown"
        }, {
            key: "Hadoop version",
            value: "Unknown"
        }]
        $scope.clusterInfoOk = false;
    });

    Cluster.get("metrics").then(function (result) {
        $scope.clusterMetrics = [{
            key: "Active nodes",
            value: result.plain().clusterMetrics.activeNodes
        }, {
            key: "Apps completed",
            value: result.plain().clusterMetrics.appsCompleted
        }, {
            key: "Apps failed",
            value: result.plain().clusterMetrics.appsFailed
        }, {
            key: "Apps killed",
            value: result.plain().clusterMetrics.appsKilled
        }, {
            key: "Apps pending",
            value: result.plain().clusterMetrics.appsPending
        }, {
            key: "Apps running",
            value: result.plain().clusterMetrics.appsRunning
        }]
        $scope.clusterMetricsOk = true;
        console.info("Cluster metrics: ", $scope.clusterMetrics);
    }, function (status) {
        console.error("Failed to get data about cluster");
        $scope.clusterMetricsOk = false;
        $scope.clusterMetrics = [{
            key: "Active nodes",
            value: "Unknown"
        }, {
            key: "Apps completed",
            value: "Unknown"
        }, {
            key: "Apps failed",
            value: "Unknown"
        }, {
            key: "Apps killed",
            value: "Unknown"
        }, {
            key: "Apps pending",
            value: "Unknown"
        }, {
            key: "Apps running",
            value: "Unknown"
        }]
    });

    Cluster.get("nodes").then(function (result) {
        $scope.clusterNodes = result.plain().nodes.node;

        console.info("Cluster nodes: ", $scope.clusterNodes);
        $scope.clusterNodesOk = true;
    }, function (status) {
        console.error("Failed to get data about cluster");
        $scope.clusterNodesOk = false;
    });
});

app.filter('split', function () {
    return function (input, splitChar, splitIndex) {
        return input.split(splitChar)[splitIndex];
    }
})