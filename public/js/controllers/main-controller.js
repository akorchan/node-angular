'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('MainPageController', function ($scope, $http, $timeout, $location, storeItems, shoppingCart) {
        storeItems.getLimitedNumberItemsByType('', 12, function (data) {
            $scope.items = data;
        });

        $scope.putItemToCart = function (itemId) {
            shoppingCart.putItemToCart(itemId, function () {
                console.log('Item added: ' + itemId);
            });
        };
    });