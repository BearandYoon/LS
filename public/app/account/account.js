(function(){
    'use strict';

    angular.module('temptationApp')
        .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

            //$locationProvider.html5Mode(true);
            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "app/account/login/login.html",
                    controller: 'LoginController',
                    controllerAs: 'loginCtrl'
                })
                .state('signup', {
                    url: "/signup",
                    templateUrl: "app/account/signup/signup.html",
                    controller: 'SignupController',
                    controllerAs: 'signupCtrl'
                })
                .state('logout', {
                    url: '/logout?referrer',
                    referrer: 'main',
                    template: '',
                    controller: function($account) {
                        $account.logout();
                    }
                })

        });

})();
