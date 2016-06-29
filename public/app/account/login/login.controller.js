(function() {
    'use strict';

    angular
        .module('temptationApp')
        .controller('LoginController', LoginController);


    function LoginController($rootScope, $scope, $state, $account, $localStorage) {
        var vm = this;

        vm.disableStartButton = true;
        vm.user = {};
        vm.error = {};

        vm.signup = function(user){
            $account.login(user)
                .then(function(response){
                    console.log('loginController-signup = ', response);
                    $rootScope.currentUser = response;
                    $localStorage.currentUser = response;
                    $state.go('main');
                }, function(err){
                    vm.showError = true;
                    console.log('login-err = ', err);
                    vm.errorMsg = err.showToUser;
                    console.log(err);
                })
        }
    }
})();