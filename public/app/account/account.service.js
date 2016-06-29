/**
 * Created by dreamsoft on 12/3/15.
 */


(function() {
    'use strict';

    angular
        .module('temptationApp')
        .service('$account', function($rootScope, $http, $q, $localStorage, $state){
            var service = {
                login: login,
                signup: signup,
                logout: logout,
                close: close,
                isAuthenticated: isAuthenticated,
                changePassword: changePassword
            };

            return service;

            function changePassword(password){
                var deferred = $q.defer();
                var changeRequest = {
                    method: 'PUT',
                    url: $rootScope.baseUrl + 'me/password',
                    data: {"oldpassword":password.oldpassword, "password": password.password}
                };

                $http(changeRequest).success(function(data){
                    deferred.resolve(data)
                }).error(function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function logout() {
                delete $localStorage.currentUser;
                $state.go('login');
            }

            function close(){
                var deferred = $q.defer();
                var deleteRequest = {
                    method: 'DELETE',
                    url: $rootScope.baseUrl + 'me'
                };
                $http(deleteRequest).success(function(data){
                    deferred.resolve(data)
                }).error(function(err){
                    deferred.reject(err);
                });
                return deferred.promise;
            }

            function login(user){
                var deferred = $q.defer();
                var loginRequest = {
                    method: 'POST',
                    url: $rootScope.baseUrl + 'auth/login',
                    data: user
                };

                $http(loginRequest).success(function(data){
                    deferred.resolve(data)
                }).error(function(err){
                    console.log('login-error = ', err);
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function signup(user){
                var deferred = $q.defer();
                var loginRequest = {
                    method: 'POST',
                    url: $rootScope.baseUrl + 'register',
                    data: user
                };

                $http(loginRequest).success(function(data){
                    deferred.resolve(data)
                }).error(function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            }

            function isAuthenticated(user){
                var deferred = $q.defer();
                var profileRequest = {
                    method: 'GET',
                    url: $rootScope.baseUrl + 'me',
                    data: user
                };

                $http(profileRequest).success(function(data){
                    deferred.resolve(data)
                }).error(function(err){
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        })
})();