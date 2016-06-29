(function() {
    'use strict';

    angular
        .module('temptationApp')
        .controller('MainController', MainController);

    function MainController($rootScope, $scope, $state, $account, $http) {
        var vm = this;

        vm.disableStartButton = true;
        vm.options = [
            {value: 10, name: 10},
            {value: 15, name: 15},
            {value: 20, name: 20},
            {value: 30, name: 30}
        ];

        vm.input2options = {};
        vm.min_select = vm.options[1];
        vm.init = init;
        vm.input2Select = input2Select;
        vm.showTop10 = showTop10;
        vm.data = {};
        vm.limit = 3;

        vm.start = function(selected){

        };

        vm.logout = function(){
            $account.logout();
        };

        vm.getInput2Prediction = function(input1){
            var input2options = _.filter(vm.data, {input1: input1});
            console.log(input2options);
        };

        $scope.encodeContent = function(data){
            return encodeURIComponent(data);
        };

        $scope.$watch('input1', function() {
            vm.input2options = _.filter(vm.data, {input1: $scope.input1});
            vm.input2options.forEach(function(input2){
                input2.text = input2.input2 + ",  success rate: "  +  parseInt((input2.success*100/input2.count)) + "%";
                input2.prediction = input2.success + "/" +  input2.count + "  " +  parseInt((input2.success*100/input2.count)) + "%  Success rate"
                input2.rate = parseInt((input2.success*100/input2.count));
            });
            vm.input2options = _.sortBy(vm.input2options, 'rate').reverse();
            console.log(vm.input2options);
            if($scope.input1 && $scope.input1 != "" && $scope.input2 && $scope.input2 != "") vm.disableStartButton = false;
        });

        $scope.$watch('input2', function() {
            if($scope.input1 && $scope.input1 != "" && $scope.input2 && $scope.input2 != "") vm.disableStartButton = false;
        });

        function input2Select(prediction){
            console.log(prediction);
            $scope.input2 = prediction.input2;
        }

        function showTop10(){
            vm.limit = 10;
        }

        function init(){
            var getInput1PredictionRequest = {
                method: 'GET',
                url: $rootScope.baseUrl + 'me/data'
            };
            $http(getInput1PredictionRequest).success(function(data){
                console.log(data);
                vm.data = data.data;
                vm.input1options = _.uniq(_.pluck(vm.data, 'input1'), true);
            }).error(function(err){
                console.log(err);
            });
        }

        vm.init();
        console.log(vm.min_select);
    }
})();