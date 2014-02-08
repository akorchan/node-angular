'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('LoginController', function ($scope, $modalInstance, $location, $route, $rootScope, LoginService) {

        $scope.user = {};

        LoginService.login("admin", "admin", function (data) {
            if (data === "login") {
                $location.path('/admin');
            }
            $route.reload();
            $modalInstance.close($scope.user.name);
        });

        $scope.ok = function () {
            LoginService.login($scope.user.name, $scope.user.password, function (data) {
//            LoginService.login("admin", "admin", function(data) {
                if (data === "login") {
                    $location.path('/admin');
                }
                $route.reload();
                $modalInstance.close($scope.user.name);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });