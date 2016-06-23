app.controller("TurismRegionController", function($scope, Restangular) {
	$scope.series = [ {
		data : [ 0.5, 1.9, 2.3, 4.8, 5.6 ]
	} ];

	$scope.regionId = "Brasov";

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
						name : 'Average of precipitations',
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
			text : 'Average of precipitation in ' + $scope.regionId
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
			width : 900,
			height : 400
		},
		// function (optional)
		func : function(chart) {
			// setup some logic for the chart
		}
	};

	$scope.changeCompare = function() {
		console.log("Compare to check box was changed...")
	}

	$scope.compareModel = "";

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

	$scope.$on('$viewContentLoaded', function() {
		console.log("View content was load for turism charts");

		var url = "results/precipitations/avgEachYears?regionId=1";
		Restangular.one(url).getList().then(function(result) {
			var currentYear = new Date().getFullYear();
			console.log("Current year is: ", currentYear);
			var historyValues = [];
			var predictionValues = [];

			var firstYear = 3000;
			var lastYear = 0;
			for (var i = 0; i < result.length; i++) {
				if (firstYear > result[i].year) {
					firstYear = result[i].year
				}
				if (lastYear < result[i].year) {
					lastYear = result[i].year
				}
			}
			$scope.avgSlider.options.floor = firstYear;
			$scope.avgSlider.options.ceil = lastYear;

			for (var i = firstYear; i < currentYear; i++) {
				historyValues[i] = [];
			}
			for (var i = currentYear; i <= lastYear; i++) {
				predictionValues[i] = [];
			}

			for (var i = 0; i < result.length; i++) {
				var obj = {
					regionId : result[i].regionId,
					avg : result[i].avg,
					max : result[i].max
				}

				if (result[i].year < currentYear) {
					historyValues[result[i].year].push(obj);
				} else {
					predictionValues[result[i].year].push(obj);
				}
			}
			$scope.history.precipitations.values = historyValues;
			$scope.prediction.precipitations.values = predictionValues;
			$scope.history.precipitations.firstYear = firstYear;
			$scope.history.precipitations.lastYear = lastYear;

			console.log("History: ", $scope.history);
			console.log("Prediction: ", $scope.prediction);

			var firstYearData = $scope.history.precipitations.values[firstYear];
			var avgSeries = [];
			for(var i=0;i<firstYearData.length;i++){
				avgSeries.push(firstYearData[i].avg);
			}
			
			console.log("First year data: ", avgSeries);
			$scope.chartConfig.series[0].data = avgSeries;
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

	$scope.selectHistoryPrecipitations = function() {
		$scope.chartConfig.series[0].data = $scope.history.precipitations;
		// $scope.chartConfig.series[0].data = [1,2,3];
		// $scope.data = [];
		// $scope.chartConfig.series[0] = {name: 'foo', data: [1,2,3]}

		// $scope.chartConfig.series[0].update({
		// data: [1,2,3,4,5,6]
		// }, true);
		// var dataS = $scope.series[0];
		// console.log(dataS);
		// dataS.data = [1,2,3,4,5,6];

		// $scope.addSeries();
		// $scope.chartConfig.series = $scope.series;
		// data.push(1000);
		console.log("Pressesd", $scope.chartConfig.series[0].data);
	}
	
	sliderChanged = function(){
		var year = $scope.avgSlider.value;
		var currentYear = new Date().getFullYear();
		
		var yearData = null;
		if(year <  currentYear){
			yearData = $scope.history.precipitations.values[year];
		}else{
			yearData = $scope.prediction.precipitations.values[year];
		}
		var avgSeries = [];
		for(var i=0;i<yearData.length;i++){
			avgSeries.push(yearData[i].avg);
		}
		
		console.log("First year data: ", avgSeries);
		$scope.chartConfig.series[0].data = avgSeries;
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
});