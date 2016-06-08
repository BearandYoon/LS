/**
 * Created by dreamsoft on 12/3/15.
 */


(function() {
    'use strict';

    angular
        .module('temptationApp')
        .service('$round', function($rootScope, $http, $q, $localStorage, $state){
            var service = {
                save_result: save_result
            };

            return service;

            function save_result(myinputs){
                var deferred = $q.defer();
                var loginRequest = {
                    method: 'POST',
                    url: $rootScope.baseUrl + 'me/save_result',
                    data: myinputs
                }
                $http(loginRequest).success(function(data){
                    deferred.resolve(data)
                }).error(function(err){
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        })
})();