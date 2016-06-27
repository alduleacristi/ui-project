app.controller("QueryManagerRegionController", function ($scope,$routeParams, RegionById,Query,UsedQuery, crumble, Restangular) {
    var params = { regionId: $routeParams.regionId}
    RegionById.getList(params).then(function (result) {
        var array = result.plain();
        if (array == null || array == undefined || array.length <= 0) {
            $scope.noDataIsAvailable = true;
            crumble.update({ region: $scope.region });
        } else {
            $scope.noDataIsAvailable = false;
            $scope.region = array[0];
            crumble.update({ region: $scope.region });
        }
    }, function (result) {
        console.error("Failed to get data about region.", result);
    });

    $scope.grid = {
        data: $scope.usedQuerys,
        expandableRowTemplate: '<did><h4>Description of query:</h4><div>{{row.entity.query.description}}</div></div>',
        expandableRowHeight: 100,
        columnDefs: [{
            name: 'query.name', displayName: 'Name', width: '45%'
        }, {
            name: 'successed',
            width: '110',
            displayName: 'Successed'
        }, {
            name: 'timeDuration',
            width: '130',
            displayName: 'Running time',
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.timeDuration}} min</div>'
        }, {
            name: 'running', width: '110',
            displayName: 'Running',
            cellTemplate: '/resources/templates/SpinnerTemplate.html'
        }, {
            name: 'idQuery',
            displayName: 'Run',
            cellTemplate: '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-primary" ng-click="grid.appScope.startQuery(row.entity)" ng-disabled="row.entity.running">Start query</button></div>'
        }]
    }

    $scope.startQuery = function (query) {
        query.running = true;
        var url = query.query.path + "?dbName=" + DATABASE_NAME + "&regionId=" + $scope.region.idRegion + "&eachYear=true";
        Restangular.one(url).getList().then(function (result) {
            console.log("Result of the query: ", result);
            $scope.getDataForGrid();
        }, function (result) {
            console.error("Failed to get data about region.", result);
        });
    };
    
    $scope.verifyIfQueryWasUsed = function (usedQuerys, query) {
        console.info("Query: ", query.idQuery)
        for (var i = 0; i < usedQuerys.length; i++) {
            console.info("UsedQuery: ", usedQuerys[i].query.idQuery)
            if (usedQuerys[i].query.idQuery == query.idQuery) {
                return true;
            }
        }

        return false;
    }
    
    $scope.prepareDataForGrid = function(){
        console.info("In call prepareDataForGrid");
        var data = $scope.usedQuerys;
        
        for(var i=0;i<data.length;i++){
        	data[i].timeDuration = (data[i].timeDuration / 1000) / 60;
        }
        
        for (var i = 0; i < $scope.querys.length; i++) {
            var query = $scope.querys[i];

            if (!$scope.verifyIfQueryWasUsed(data, query)) {
                var enhancedQuery = {
                    query: query,
                    running: false,
                    successed: null,
                    timeDuration: 0
                }
                data.push(enhancedQuery);
                console.info(enhancedQuery);
            }
        }

        return data;
    }
    
    $scope.getDataForGrid = function(){
    	$scope.queryComes = false;
        $scope.usedQueryComes = false;
        $scope.usedQuerys = [];
    	
    	Query.getList().then(function (result) {
    		$scope.queryComes = true;
            $scope.querys = result.plain();

            if ($scope.usedQueryComes == true) {
                $scope.grid.data = $scope.prepareDataForGrid();
                console.info("Query: ", $scope.querys);
            }
            //$scope.grid.data = $scope.querys;
        }, function (result) {
            console.error("Failed to get data about region.", result);
        });

        UsedQuery.getList(params).then(function (result) {
        	$scope.usedQueryComes = true;
            $scope.usedQuerys = result.plain();

            if($scope.queryComes == true){
                $scope.grid.data = $scope.prepareDataForGrid();
                console.info("UsedQuerys: ", $scope.usedQuerys);
            }
            //$scope.grid.data = $scope.usedQuerys;
        }, function (result) {
            console.error("Failed to get data about region.", result);
        });
    }

    $scope.$on('$viewContentLoaded', function () {
    	 $scope.getDataForGrid();    
    });
});