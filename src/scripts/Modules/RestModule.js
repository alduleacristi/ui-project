var restModule = angular.module('restModule', [ 'restangular' ]);

restModule.config(function(RestangularProvider) {
	RestangularProvider
			.setBaseUrl('http://192.168.171.133:8082/platform-server/api');

	RestangularProvider.setDefaultHttpFields({
		withCredentials : true
	});
});

restModule.factory('Region', function(Restangular) {
	return Restangular.service('region');
});
restModule.factory('RegionById', function(Restangular) {
	return Restangular.service('regionById');
});

restModule.factory('IngestRegion', function(Restangular) {
	return Restangular.service('ingest/region');
});

restModule.factory('Query', function(Restangular) {
	return Restangular.service('hive/query');
});
restModule.factory('UsedQuery', function(Restangular) {
	return Restangular.service('hive/usedQuery');
});
restModule.factory('PrecipitationQuery', function(Restangular) {
	return Restangular.service('db/precipitations/month/avg');
});

restModule.factory('Cluster', function(Restangular) {
	return Restangular.all('cluster');
});

restModule.factory('Auth', function(Restangular) {
	return Restangular.all('auth');
});
restModule.factory('Authentication', function(Restangular) {
	return Restangular.service('auth/authentication');
});

// Query resuts
restModule.factory('PrecipitationQueryResults', function(Restangular) {
	return Restangular.service('/results/precipitations/avgEachYears');
});
