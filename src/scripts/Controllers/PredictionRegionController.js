app.controller("PredictionRegionController", function($scope, $routeParams, Restangular, ChartsService, Region) {
	var precipitationData = null;
	var tempMaxData = null;
	var tempMinData = null;
	
	$scope.series = [ {
		data : [ 0.5, 1.9, 2.3, 4.8, 5.6 ]
	} ];

	$scope.regionName = "";

	$scope.chartConfig = {

		options : {
			// This is the Main Highcharts chart config. Any Highchart options
			// are valid here.
			// will be overriden by values specified below.
			chart : {
				zoomType : 'xy'
			},
			tooltip : {
				style : {
					padding : 10,
					fontWeight : 'bold'
				}
			}
		},
		// The below properties are watched separately for changes.

		// Series object (optional) - a list of series using normal Highcharts
		// series options.
		series : [
					{
						name : '',
						type : 'column',
						data : [],
						tooltip : {
							valueSuffix : 'l/m^2'
						},
						id : 'series-0'
					} ],
		// series : $scope.series,
		// Title configuration (optional)
		title : {
			text : 'Average of precipitation'
		},
		// Boolean to control showing loading status on chart (optional)
		// Could be a string if you want to show specific loading text.
		loading : false,
		// Configuration for the xAxis (optional). Currently only one x axis can
		// be dynamically controlled.
		// properties currentMin and currentMax provided 2-way binding to the
		// chart's maximum and minimum
		/*
		 * xAxis: { currentMin: 0, currentMax: 10, title: { text: 'values' } },
		 */
		xAxis : [ {
			categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
					'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
			crosshair : true
		} ],
		yAxis : [ { // Primary yAxis
			labels : {
				format : '{value} l/m^2',
			},
			title : {
				text : 'Precipiataions',

			}
		} ],
		// Whether to use Highstocks instead of Highcharts (optional). Defaults
		// to false.
		useHighStocks : false,
		// size (optional) if left out the chart will default to size of the div
		// or something sensible.
		size : {
			width : 800,
			height : 400
		},
		// function (optional)
		func : function(chart) {
			// setup some logic for the chart
		}
	};

//	$scope.history = {
//		precipitations : {
//			firstYear : 0,
//			lastYear : 0,
//			values : []
//		},
//		tem_max : [],
//		temp_min : []
//	};
	$scope.predictionUsecase = {
		precipitations : {
			firstYear : 0,
			lastYear : 0,
			values : []
		},
		tem_max : [],
		temp_min : []
	}
	$scope.chartModel = {
		type: "history",
		subtype: "precipitations",
		withSlider: true
	}

	$scope.$on('$viewContentLoaded', function() {
		var regionId = $routeParams.regionId;
		var param = {
			"regionId": regionId
		}
		
		Restangular.all("regionById?regionId="+regionId).get("").then(function(result) {
			$scope.regionName = result.plain()[0].name;
			$scope.chartConfig.series[0].name = $scope.regionName;
		}, function(result) {
			console.error("Failed to get region", result);
		})
		
		var url = "results/precipitations/avgEachYears?regionId="+regionId;
		Restangular.one(url).getList().then(function(result) {
			precipitationData = result;
			var precipitations = ChartsService.getPredictionUsecaseAverage(result);
			console.log(precipitations);
			
			$scope.predictionUsecase = precipitations;
			$scope.predictionUsecase.precipitations = precipitations;
			$scope.avgSlider.options.floor = precipitations.firstYear;
			$scope.avgSlider.options.ceil = precipitations.lastYear;
			$scope.avgSlider.options.stepsArray = precipitations.steps;

			var firstYearData = $scope.predictionUsecase.precipitations.values[precipitations.firstYear];
			var avgSeries = [];
			for(var i=0;i<firstYearData.length;i++){
				avgSeries.push(firstYearData[i].avg);
			}
			
			$scope.chartConfig.series[0].data = avgSeries;
			$scope.chartModel.year = precipitations.firstYear;
		}, function(result) {
			console.error("Failed to get results of the query", result);
		});
		
		var url = "results/tempMax/avgEachYears?regionId="+regionId;
		Restangular.one(url).getList().then(function(result) {
			tempMaxData = result.plain();
		}, function(result) {
			console.error("Failed to get results of the query", result);
		});
		
		var url = "results/tempMin/avgEachYears?regionId="+regionId;
		Restangular.one(url).getList().then(function(result) {
			tempMinData = result.plain();
		}, function(result) {
			console.error("Failed to get results of the query", result);
		});
	});

	// First time open history accordion
	$scope.statusHistory = {
		open : true
	};
	$scope.selectedStatistics = {
		section : "history",
		type : "precipitations"
	}
	
	var updateSecondSeries = function(){
		console.log($scope.chartConfig.series);
		if($scope.chartConfig.series.length == 2){
			$scope.chartConfig.series = $scope.chartConfig.series.slice(0,1);
			addSeriesChart($scope.compareRegion);
		}
	}
	
	$scope.selectPredictionUsescasePrecipitations = function() {
		var precipitations = ChartsService.getPredictionUsecaseAverage(precipitationData);
		
		$scope.predictionUsecase = precipitations;
		$scope.avgSlider.options.floor = precipitations.firstYear;
		$scope.avgSlider.options.ceil = precipitations.lastYear;
		$scope.avgSlider.value = precipitations.firstYear;
		$scope.avgSlider.options.stepsArray = precipitations.steps;

		var firstYearData = $scope.predictionUsecase.values[precipitations.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   l/m^2";
		$scope.chartConfig.yAxis[0].labels.format = "{value} l/m^2";
		console.log($scope.chartConfig.yAxis);
		$scope.chartConfig.title.text = "Average of precipitation";
		$scope.chartConfig.series[0].type = "column"; 
		$scope.chartConfig.xAxis[0].categories = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
		                            					'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		
		$scope.chartModel.subtype = "precipitations";
		$scope.chartModel.type = "predictions";
		$scope.chartModel.year = precipitations.firstYear;
		$scope.chartModel.withSlider = true;
		
		updateSecondSeries();
	}
	
	$scope.selectPredictionUseCaseTempMax = function() {
		var tempMax = ChartsService.getPredictionUsecaseAverage(tempMaxData);
		
		$scope.predictionUsecase = tempMax;
		$scope.avgSlider.options.floor = tempMax.firstYear;
		$scope.avgSlider.options.ceil = tempMax.lastYear;
		$scope.avgSlider.value = tempMax.firstYear;
		$scope.avgSlider.options.stepsArray = tempMax.steps;

		var firstYearData = $scope.predictionUsecase.values[tempMax.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
	
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.title.text = "Average of max temp";
		$scope.chartConfig.series[0].type = "column"; 
		$scope.chartConfig.xAxis[0].categories = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
		                            					'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		
		$scope.chartModel.subtype = "tempMax";
		$scope.chartModel.type = "predictions";
		$scope.chartModel.year = tempMax.firstYear;
		$scope.chartModel.withSlider = true;
		
		updateSecondSeries();
	}
	
	$scope.selectPredictionUsecaseTempMin = function() {
		var tempMin = ChartsService.getPredictionUsecaseAverage(tempMinData);
		
		$scope.predictionUsecase = tempMin;
		$scope.avgSlider.options.floor = tempMin.firstYear;
		$scope.avgSlider.options.ceil = tempMin.lastYear;
		$scope.avgSlider.value = tempMin.firstYear;
		$scope.avgSlider.options.stepsArray = tempMin.steps;

		var firstYearData = $scope.predictionUsecase.values[tempMin.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.title.text = "Average of min temp";
		$scope.chartConfig.series[0].type = "column"; 
		$scope.chartConfig.xAxis[0].categories = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
		                            					'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		
		
		$scope.chartModel.subtype = "tempMin";
		$scope.chartModel.type = "predictions";
		$scope.chartModel.year = tempMin.firstYear;
		$scope.chartModel.withSlider = true;
		
		updateSecondSeries();
	}
	
	sliderChanged = function(){
		var year = $scope.avgSlider.value;
		var currentYear = new Date().getFullYear();
		
		console.log("Rediction usecase: ",$scope.predictionUsecase)
		var	yearData = $scope.predictionUsecase.values[year];
		
		var avgSeries = [];
		for(var i=0;i<yearData.length;i++){
			avgSeries.push(yearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartModel.year = year;
		
		updateSecondSeries();
	}

	$scope.avgSlider = {
		options : {
			floor : 0,
			ceil : 0,
			vertical : true,
			showTicksValues : true,
			onChange: sliderChanged,
			stepsArray: []
		}
	};
	
	$scope.evolutionAllYearsPrecipitations = function(){
		var precipitationsEvolution = ChartsService.getPredictionEvolution(precipitationData);
		
		$scope.chartConfig.series[0].data = precipitationsEvolution.values;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].type = "line";
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   l/m^2";
		$scope.chartConfig.yAxis[0].labels.format = "{value} l/m^2";
		$scope.chartConfig.xAxis[0].categories = precipitationsEvolution.steps;
		$scope.chartConfig.title.text = "Evolution of precipitations";
		
		$scope.chartModel.withSlider = false;
		console.log("Data: ", precipitationsEvolution);
	}
	
	$scope.evolutionAllYearsTempMax = function(){
		var tempMaxEvolution = ChartsService.getPredictionEvolution(tempMaxData);
		
		$scope.chartConfig.series[0].data = tempMaxEvolution.values;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].type = "line";
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.xAxis[0].categories = tempMaxEvolution.steps;
		$scope.chartConfig.title.text = "Evolution of temp max";
		
		$scope.chartModel.withSlider = false;
	}
	
	$scope.evolutionAllYearsTempMin = function(){
		var tempMinEvolution = ChartsService.getPredictionEvolution(tempMinData);
		
		$scope.chartConfig.series[0].data = tempMinEvolution.values;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].type = "line";
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.xAxis[0].categories = tempMinEvolution.steps;
		$scope.chartConfig.title.text = "Evolution of temp min";
		
		$scope.chartModel.withSlider = false;
	}
	
});