'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('SendCartController', function ($scope, $modalInstance, $http, $route, shoppingCart) {

        $scope.customer = {};

        $scope.closeDialog = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.sendCart = function () {
            shoppingCart.sendCart($scope.customer, function (items) {
                $scope.itemsToBuy = items;
                $route.reload();
            });
        };
    });