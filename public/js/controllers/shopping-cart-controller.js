'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('ShoppingCartController', function ($scope, $route, $modal, shoppingCart, storeItems) {

        $scope.itemsToBuy = [];
        $scope.title = 'Корзина покупок';

        shoppingCart.getCart(function (items) {
            Object.keys(items).forEach(function (key) {
                storeItems.findItemById(key, function (data) {
                    data.count = items[key];
                    $scope.itemsToBuy.push(data);
                })
            });
        });

        $scope.clearCart = function () {
            shoppingCart.clearCart(function (items) {
                $scope.itemsToBuy = items;
                $route.reload();
            });
        };

        $scope.sendCartDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'public/partials/dialogs/send-cart-dialog.html',
                controller: 'SendCartController'
            });
        };

        $scope.removeFromCart = function (itemId) {
            shoppingCart.removeFromCart(itemId, function (items) {
                $scope.itemsToBuy = items;
                $route.reload();
            });
        };

        $scope.increaseCount = function (itemId) {
            shoppingCart.putItemToCart(itemId, function (items) {
                for (var i in $scope.itemsToBuy) {
                    for (var key in $scope.itemsToBuy[i]) {
                        if ((key === '_id') && $scope.itemsToBuy[i][key] === itemId) {
                            $scope.itemsToBuy[i].count++;
                        }
                    }
                }
            });
        };

        $scope.decreaseCount = function (itemId) {
            shoppingCart.decreaseNumberInCart(itemId, function (items) {
                for (var i in $scope.itemsToBuy) {
                    for (var key in $scope.itemsToBuy[i]) {
                        if ((key === '_id') && ($scope.itemsToBuy[i][key] === itemId)) {
                            if ($scope.itemsToBuy[i].count === 1) {
                                $scope.itemsToBuy.splice(i, 1)
                            } else {
                                $scope.itemsToBuy[i].count--;
                            }
                        }
                    }
                }
            });
        };

    });