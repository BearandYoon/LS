(function() {
    'use strict';

    angular
        .module('temptationApp')
        .controller('SignupController', SignupController);


    function SignupController($rootScope, $scope, $state, $account, $localStorage) {
        var vm = this;

        vm.disableStartButton = true;
        vm.user = {};
        vm.error = {};
        vm.signup = function(user){
            if(user.password != user.confirmPassword){
                vm.error.confirmPassword = true;
                return false;
            }
            $account.signup(user)
                .then(function(response){
                    console.log(response);
                    var userdata = response;
                    $rootScope.currentUser = response;
                    $localStorage.currentUser = response;
                    $state.go('main');
                }, function(err){
                    vm.showError = true;
                    vm.errorMsg = err.showToUser;
                    console.log(err);
                })

        }

    }
})();