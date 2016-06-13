(function(){
    'use strict';

    angular.module('temptationApp', ['ui.router',  'ui.bootstrap', 'ngStorage', 'ngCookies', 'angular.filter'])
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
                .state('main', {
                    url: "/main",
                    templateUrl: "app/main/main.html",
                    controller: 'MainController',
                    controllerAs: 'mainCtrl'
                })
                .state('round', {
                    url: "/round/:mins/:input1/:input2",
                    templateUrl: "app/round/round.html",
                    controller: 'RoundController',
                    controllerAs: 'roundCtrl'
                })
                .state('demo', {
                    url: "/demo",
                    templateUrl: "app/demo/demo.html",
                    controller: 'DemoController',
                    controllerAs: 'demoCtrl'
                })
                .state('settings', {
                    url: "/settings",
                    templateUrl: "app/settings/settings.html",
                    controller: 'SettingsController',
                    controllerAs: 'settingsCtrl'
                });

            $urlRouterProvider.otherwise('/login');

            $httpProvider.interceptors.push(function( $q, $location, $localStorage, $injector ) {
                return {
                    'request': function( config ) {
                        config.headers = config.headers || {};
                        //Assume that you store the token in a cookie.
                        var globals = $localStorage.currentUser || {};
                        //If the cookie has the CurrentUser and the token
                        //add the Authorization header in each request
                        if ( $localStorage.currentUser && $localStorage.currentUser.api_token ) {
                            config.headers['x-auth-token'] = $localStorage.currentUser.api_token;
                            console.log( config.headers);
                        }
                        return config;
                    }
                };
            });
        })
        .run(function($rootScope, $state, $account, $localStorage){
            $rootScope.baseUrl = "http://localhost:3000/api/";

            $rootScope.$on('$stateChangeStart', function(event, next) {
                if(next.name == 'login' || next.name == 'signup' || next.name == 'demo') return false;
                $account.isAuthenticated()
                    .then(function(data){
                        //$state.go('login');
                    }, function(err){
                        if($localStorage.currentUser) delete $localStorage.currentUser;
                        $state.go('login');
                    })
            });
        });
})();

