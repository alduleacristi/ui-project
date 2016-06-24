app.controller("TurismRegionController", function($scope, $routeParams, Restangular, ChartsService, Region) {
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

	$scope.history = {
		precipitations : {
			firstYear : 0,
			lastYear : 0,
			values : []
		},
		tem_max : [],
		temp_min : []
	};
	$scope.prediction = {
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
		subtype: "precipitations"
	}

	$scope.$on('$viewContentLoaded', function() {
		var regionId = $routeParams.regionId;
		var param = {
			"regionId": regionId
		}
		
		Restangular.all("region?regionId="+regionId).get("").then(function(result) {
			$scope.regionName = result.plain()[0].name;
			$scope.chartConfig.series[0].name = $scope.regionName;
		}, function(result) {
			console.error("Failed to get region", result);
		})
		
		var url = "results/precipitations/avgEachYears?regionId="+regionId;
		Restangular.one(url).getList().then(function(result) {
			precipitationData = result;
			var precipitations = ChartsService.getHistoryAverage(result);
			
			$scope.history.precipitations = precipitations;
			$scope.avgSlider.options.floor = precipitations.firstYear;
			$scope.avgSlider.options.ceil = precipitations.lastYear;

			var firstYearData = $scope.history.precipitations.values[precipitations.firstYear];
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

	$scope.selectHistoryPrecipitations = function() {
		var precipitations = ChartsService.getHistoryAverage(precipitationData);
		
		$scope.history = precipitations;
		$scope.avgSlider.options.floor = precipitations.firstYear;
		$scope.avgSlider.options.ceil = precipitations.lastYear;
		$scope.avgSlider.value = precipitations.firstYear;

		var firstYearData = $scope.history.values[precipitations.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName; 
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   l/m^2";
		$scope.chartConfig.yAxis[0].labels.format = "{value} l/m^2";
		$scope.chartConfig.title.text = "Average of precipitation"
			
		$scope.chartModel.subtype = "precipitations";
		$scope.chartModel.type = "history";
		$scope.chartModel.year = precipitations.firstYear;
		
		updateSecondSeries();
	}
	
	$scope.selectHistoryTempMax = function() {
		var tempMax = ChartsService.getHistoryAverage(tempMaxData);
		
		$scope.history = tempMax;
		$scope.avgSlider.options.floor = tempMax.firstYear;
		$scope.avgSlider.options.ceil = tempMax.lastYear;
		$scope.avgSlider.value = tempMax.firstYear;

		var firstYearData = $scope.history.values[tempMax.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.title.text = "Average of max temperature";
		
		$scope.chartModel.subtype = "tempMax";
		$scope.chartModel.type = "history";
		$scope.chartModel.year = tempMax.firstYear;
		
		updateSecondSeries();
	}
	
	$scope.selectHistoryTempMin = function() {
		var tempMin = ChartsService.getHistoryAverage(tempMinData);
		
		$scope.history = tempMin;
		$scope.avgSlider.options.floor = tempMin.firstYear;
		$scope.avgSlider.options.ceil = tempMin.lastYear;
		$scope.avgSlider.value = tempMin.firstYear;

		var firstYearData = $scope.history.values[tempMin.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.title.text = "Average of min temperature";
		
		$scope.chartModel.subtype = "tempMin";
		$scope.chartModel.type = "history";
		$scope.chartModel.year = tempMin.firstYear;
		
		updateSecondSeries();
	}
	
	$scope.selectPredictionPrecipitations = function() {
		var precipitations = ChartsService.getPredictionAverage(precipitationData);
		
		$scope.prediction = precipitations;
		$scope.avgSlider.options.floor = precipitations.firstYear;
		$scope.avgSlider.options.ceil = precipitations.lastYear;
		$scope.avgSlider.value = precipitations.firstYear;

		var firstYearData = $scope.prediction.values[precipitations.firstYear];
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
		
		$scope.chartModel.subtype = "precipitations";
		$scope.chartModel.type = "predictions";
		$scope.chartModel.year = precipitations.firstYear;
		
		updateSecondSeries();
	}
	
	$scope.selectPredictionTempMax = function() {
		var tempMax = ChartsService.getPredictionAverage(tempMaxData);
		
		$scope.prediction = tempMax;
		$scope.avgSlider.options.floor = tempMax.firstYear;
		$scope.avgSlider.options.ceil = tempMax.lastYear;
		$scope.avgSlider.value = tempMax.firstYear;

		var firstYearData = $scope.prediction.values[tempMax.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.title.text = "Average of max temp";
		
		$scope.chartModel.subtype = "tempMax";
		$scope.chartModel.type = "predictions";
		$scope.chartModel.year = tempMax.firstYear;
		
		updateSecondSeries();
	}
	
	$scope.selectPredictionTempMin = function() {
		var tempMin = ChartsService.getPredictionAverage(tempMinData);
		
		$scope.prediction = tempMin;
		$scope.avgSlider.options.floor = tempMin.firstYear;
		$scope.avgSlider.options.ceil = tempMin.lastYear;
		$scope.avgSlider.value = tempMin.firstYear;

		var firstYearData = $scope.prediction.values[tempMin.firstYear];
		var avgSeries = [];
		for(var i=0;i<firstYearData.length;i++){
			avgSeries.push(firstYearData[i].avg);
		}
		
		$scope.chartConfig.series[0].data = avgSeries;
		$scope.chartConfig.series[0].name = $scope.regionName;
		$scope.chartConfig.series[0].tooltip.valueSuffix = "   °C";
		$scope.chartConfig.yAxis[0].labels.format = "{value} °C";
		$scope.chartConfig.title.text = "Average of min temp";
		
		$scope.chartModel.subtype = "tempMin";
		$scope.chartModel.type = "predictions";
		$scope.chartModel.year = tempMin.firstYear;
		
		updateSecondSeries();
	}
	
	sliderChanged = function(){
		var year = $scope.avgSlider.value;
		var currentYear = new Date().getFullYear();
		
		var yearData = null;
		if(year <  currentYear){
			yearData = $scope.history.values[year];
		}else{
			yearData = $scope.prediction.values[year];
		}
		var avgSeries = [];
		for(var i=0;i<yearData.length;i++){
			avgSeries.push(yearData[i].avg);
		}
		
		console.log("First year data: ", avgSeries);
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
			onChange: sliderChanged
		}
	};
	
	//Compare section
	$scope.changeCompare = function(region){
		if($scope.compareRegionChecked == true){
			$scope.compareRegionChecked = false;
			$scope.alerts = [];
			removeSeriesChart();
		}else{
			$scope.compareRegionChecked = true;		
			addSeriesChart(region);
			$scope.compareRegion = region;
		}
	}
	
	$scope.compareRegionChecked = "false";
	var sameRegionAlert = {
	        type: 'danger', msg: "You try to compare the same region", id:"sameRegionAlert"
	};
	
	var updatePrecipitations = function(region){
		console.log(region);
		
		var url = "results/precipitations/avgEachYears?regionId="+region.idRegion;
		Restangular.one(url).getList().then(function(result) {
			precipitationData = result;
			$scope.comparePrecipitations = result;
			var precipitations = null;
			
			if($scope.chartModel.type == "history"){
				precipitations = ChartsService.getHistoryAverage(result);
			}else{
				precipitations = ChartsService.getPredictionAverage(result);
			}

			var yearData = precipitations.values[$scope.chartModel.year];
			var avgSeries = [];
			for(var i=0;i<yearData.length;i++){
				avgSeries.push(yearData[i].avg);
			}
			
			var compareSeries = {
							name : region.name,
							type : 'column',
							data : avgSeries,
							tooltip : {
								valueSuffix : 'l/m^2'
							},
							id : 'compareSeries'
						}; 
			
			$scope.chartConfig.series.push(compareSeries);
			console.log($scope.chartConfig.series);
			//$scope.chartModel.year = precipitations.firstYear;
		}, function(result) {
			console.error("Failed to get results of the query", result);
		});
	}
	
	var updateTempMax = function(region){
		console.log(region);
		
		var url = "results/tempMax/avgEachYears?regionId="+region.idRegion;
		Restangular.one(url).getList().then(function(result) {
			tempMaxData = result;
			$scope.compareTempMax = result;
			var tempMax = null;
			
			if($scope.chartModel.type == "history"){
				tempMax = ChartsService.getHistoryAverage(result);
			}else{
				tempMax = ChartsService.getPredictionAverage(result);
			}

			var yearData = tempMax.values[$scope.chartModel.year];
			var avgSeries = [];
			for(var i=0;i<yearData.length;i++){
				avgSeries.push(yearData[i].avg);
			}
			
			var compareSeries = {
							name : region.name,
							type : 'column',
							data : avgSeries,
							tooltip : {
								valueSuffix : '°C'
							},
							id : 'compareSeries'
						}; 
			
			$scope.chartConfig.series.push(compareSeries);
			//console.log($scope.chartConfig.series);
			//$scope.chartModel.year = precipitations.firstYear;
		}, function(result) {
			console.error("Failed to get results of the query", result);
		});
	}
	
	var updateTempMin = function(region){
		console.log("Update temp min history");
		var url = "results/tempMin/avgEachYears?regionId="+region.idRegion;
		Restangular.one(url).getList().then(function(result) {
			tempMinData = result;
			$scope.compareTempMin = result;
			var tempMin = null;
			
			if($scope.chartModel.type == "history"){
				tempMin = ChartsService.getHistoryAverage(result);
			}else{
				tempMin = ChartsService.getPredictionAverage(result);
			}

			var yearData = tempMin.values[$scope.chartModel.year];
			var avgSeries = [];
			for(var i=0;i<yearData.length;i++){
				avgSeries.push(yearData[i].avg);
			}
			
			var compareSeries = {
							name : region.name,
							type : 'column',
							data : avgSeries,
							tooltip : {
								valueSuffix : '°C'
							},
							id : 'compareSeries'
						}; 
			
			$scope.chartConfig.series.push(compareSeries);
			//console.log($scope.chartConfig.series);
			//$scope.chartModel.year = precipitations.firstYear;
		}, function(result) {
			console.error("Failed to get results of the query", result);
		});
	}
	
	var addSeriesChart = function(region){
		console.log("Change compare was called: ",$scope.chartModel);
		
		$scope.alerts = [];
//        if (region.name == $scope.regionName) {
//            $scope.alerts.push(sameRegionAlert);
//            return;
//        };
		
		if($scope.chartModel.subtype == "precipitations"){
			updatePrecipitations(region);
		}else if($scope.chartModel.subtype == "tempMax"){
			updateTempMax(region);
		}else if($scope.chartModel.subtype == "tempMin"){
			updateTempMin(region);
		}
	}
	
	var removeSeriesChart = function(){
		$scope.chartConfig.series.splice(1, 1);
	}
});