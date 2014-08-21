'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('StoreController', function ($scope, $routeParams, storeItems, shoppingCart) {

//        if (ncAccount.isLoggedIn()) { $location.path('/map'); }
//        $scope.login = ncAccount.tomtomLogin;

        storeItems.getAllItemsByType($routeParams.type, function (data) {
            $scope.items = data;
        });

        $scope.putItemToCart = function (itemId) {
            shoppingCart.putItemToCart(itemId, function () {});
        };


//        $scope.message = StateService.getMessage();

//        $scope.updateMessage = function (m) {
//            StateService.setMessage(m);
//        };
    });