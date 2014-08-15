'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('ShoppingCartController', function ($scope, $route, shoppingCart, storeItems) {

        $scope.itemsToBuy = [];
        shoppingCart.getCart(function(items) {
            for (var i in items) {
                storeItems.findItemById(items[i], function(data) {
                    $scope.itemsToBuy.push(data);
                })
            }
        });

        $scope.removeFromCart = function(itemId) {
            shoppingCart.removeFromCart(itemId, function (items) {
                $scope.itemsToBuy = items;
                $route.reload();
            });
        };


    });