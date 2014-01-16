'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('LoginController', function ($scope, $modalInstance, $http, $route, items, LoginService) {

        $scope.user = {};

        $scope.ok = function () {
            LoginService.login($scope.user.name, $scope.user.password, function() {
                $route.reload();
                $modalInstance.close($scope.user.name);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });