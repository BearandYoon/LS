(function() {
    'use strict';

    angular
        .module('temptationApp')
        .controller('RoundController', MainController);


    function MainController($rootScope, $scope, $state, $stateParams, $interval, $account, $round) {
        var vm = this;

        vm.mins = $stateParams.mins * 60;
        //vm.mins = $stateParams.mins;
        vm.page_status = 0;
        vm.input1 = $stateParams.input1;
        vm.input2 = $stateParams.input2;

        vm.countDown = function(){
            vm.mins--;
            vm.message = "";
            var mins = Math.floor((vm.mins /60) % 60);
            var secs = Math.floor(vm.mins%60);

            vm.message += mins + " min ";
            vm.message += secs + " sec ";

            if(vm.mins == 0) {
                $interval.cancel(vm.timer);
                alert("Time up");
            }
        }

        vm.success = function(){
            vm.page_status = 1;
            var myinputs={input1: vm.input1, input2: vm.input2, success: true};
            $round.save_result(myinputs);
        }

        vm.failure = function(){
            vm.page_status = 2;
            var myinputs={input1: vm.input1, input2: vm.input2, success: false};
            $round.save_result(myinputs);
        }

        vm.logout = function(){
            $account.logout();
        }

        vm.tweet = function(){
            var tweetMsg = "";
            if(vm.page_status == 2){
                tweetMsg = "I just failed a round of #TheTemptationgGame! I tried " +  vm.input2 + ", I just failed a round of #TheTemptationgGame! I tried" + roundCtrl.input1 + ".";
            }
            if(vm.page_status == 1){
                tweetMsg = "I just conquered a round of #TheTemptationgGame! I defeated the temptation to " +vm.input1  + " by " + vm.input2 + ".";
            }
            console.log(tweetMsg);
            var twtLink = 'http://twitter.com/home?status=' + encodeURIComponent(tweetMsg);
            window.open(twtLink,'_blank');
        }

        vm.playAgain = function(){
            $state.go('main');
        }

        vm.timer = $interval(vm.countDown, 1000);

    }


})();
