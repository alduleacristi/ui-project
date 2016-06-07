app.controller("TurismRegionController", function ($scope) {
    $scope.series = [{
        data: [0.5,1.9,2.3,4.8,5.6]
    }];

    $scope.regionId="Brasov";
    
    $scope.chartConfig = {

        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
            chart: {
                zoomType: 'xy'
            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            }
        },
        //The below properties are watched separately for changes.

        //Series object (optional) - a list of series using normal Highcharts series options.
        //series: $scope.series,
        series: [{
            name: 'Rainfall',
            type: 'column',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            tooltip: {
                valueSuffix: ' mm'
            }
        },
            {
                name: 'Rainfall2',
                type: 'column',
            data: [59.9, 71.5, 86.4, 129.2, 144.0, 176.0, 135.6, 58.5, 216.4, 194.1, 95.6, 54.4],
            tooltip: {
                valueSuffix: ' mm'
            }
        }],
        //Title configuration (optional)
        title: {
            text: 'Average of precipitation in ' + $scope.regionId
        },
        //Boolean to control showing loading status on chart (optional)
        //Could be a string if you want to show specific loading text.
        loading: false,
        //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
        //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
        /*xAxis: {
            currentMin: 0,
            currentMax: 10,
            title: { text: 'values' }
        },*/
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                
            },
            title: {
                text: 'Temperature',
                
            }
        }],
        //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
        useHighStocks: false,
        //size (optional) if left out the chart will default to size of the div or something sensible.
        size: {
            width: 400,
            height: 300
        },
        //function (optional)
        func: function (chart) {
            //setup some logic for the chart
        }
    };

    $scope.changeCompare = function () {
        console.log("Compare to check box was changed...")
    }

    $scope.compareModel = "";
});