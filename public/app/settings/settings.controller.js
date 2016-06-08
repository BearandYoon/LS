(function() {
    'use strict';

    angular
        .module('temptationApp')
        .controller('SettingsController', SettingsController);


    function SettingsController($rootScope, $scope, $state, $account, $localStorage) {
        var vm = this;

        vm.disableStartButton = true;
        vm.user = {};
        vm.error = {};
        vm.changePassword = function(user){
            if(user.password != user.confirmPassword){
                vm.error.confirmPassword = true;
                return false;
            }
            console.log(user);
            $account.changePassword(user)
                .then(function(response){
                    console.log(response);
                    alert("You have changed password successfully");
                }, function(err){
                    console.log(err);
                    vm.showError = true;
                    vm.errorMsg = err.showToUser;

                })

        }

        vm.closeAccount = function(){
            if(confirm('Are you sure to close your account?')){
                $account.close()
                    .then(function(response){
                        alert("Your account have been deleted successfully");
                        $account.logout();
                    }, function(err){
                        console.log(err);
                        vm.showError = true;
                        vm.errorMsg = err.showToUser;
                    })
            }
        }

    }
})();