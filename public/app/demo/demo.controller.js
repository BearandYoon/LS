(function() {
    'use strict';

    angular
        .module('temptationApp')
        .controller('DemoController', DemoController);


    function DemoController($rootScope, $scope, $state, $interval) {
        var vm = this;

        vm.disableStartButton = true;
        vm.options = [
            {value: 10, name: 10},
            {value: 15, name: 15},
            {value: 20, name: 20},
            {value: 30, name: 30}
        ]

        vm.min_select = vm.options[1];

        vm.mins = 0;
        vm.page_status = -1;
        vm.input1 = "";
        vm.input2 = "";


        vm.start = function(selected){
            vm.mins = vm.min_select.value * 60;
            vm.page_status = 0;
            vm.input1 = $scope.input1;
            vm.input2 = $scope.input2;
            vm.timer = $interval(vm.countDown, 1000);
        }

        $scope.$watch('input1', function() {
            if($scope.input1 && $scope.input1 != "" && $scope.input2 && $scope.input2 != "") vm.disableStartButton = false;
        });

        $scope.$watch('input2', function() {
            if($scope.input1 && $scope.input1 != "" && $scope.input2 && $scope.input2 != "") vm.disableStartButton = false;
        });

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
        }

        vm.failure = function(){
            vm.page_status = 2;
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

        console.log(vm.min_select);
    }
})();