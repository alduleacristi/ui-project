app.service('ChartsService', function() {
	var precipitationData = null;
	var tempMaxData = null;
	var tempMinData = null;

	this.getHistoryAverage = function(data) {
		console.log("Service was called...");
		
		var currentYear = new Date().getFullYear();
		console.log("Current year is: ", currentYear);
		var historyValues = [];

		var firstYear = 3000;
		for (var i = 0; i < data.length; i++) {
			if (firstYear > data[i].year) {
				firstYear = data[i].year
			}
		}

		for (var i = firstYear; i < currentYear; i++) {
			historyValues[i] = [];
		}

		for (var i = 0; i < data.length; i++) {
			var obj = {
				regionId : data[i].regionId,
				avg : data[i].avg,
				max : data[i].max
			}

			if (data[i].year < currentYear) {
				historyValues[data[i].year].push(obj);
			} 
		}
		
		var response = {
			firstYear: firstYear,
			lastYear: currentYear - 1,
			values: historyValues
		}
		
		return response;
	}
	
	this.getPredictionAverage = function(data) {
		var currentYear = new Date().getFullYear();
		var predictionValues = [];

		var lastYear = 0;
		for (var i = 0; i < data.length; i++) {
			if (lastYear < data[i].year) {
				lastYear = data[i].year
			}
		}

		for (var i = currentYear; i <= lastYear; i++) {
			predictionValues[i] = [];
		}

		console.log("Last year: ", predictionValues);
		for (var i = 0; i < data.length; i++) {
			var obj = {
				regionId : data[i].regionId,
				avg : data[i].avg,
				max : data[i].max
			}

			if (data[i].year >= currentYear) {
				predictionValues[data[i].year].push(obj);
			} 
		}
		
		var response = {
			firstYear: currentYear,
			lastYear: lastYear,
			values: predictionValues
		}
		
		return response;
	}
});