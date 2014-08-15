'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('ItemController', function ($scope, $routeParams, storeItems, shoppingCart) {
        storeItems.findItemById($routeParams.itemId, function (data) {
            $scope.item = data;

            $scope.slides = [];
            for (var i in $scope.item.images) {
                $scope.slides.push({text: '', image: 'http://buona-italia.herokuapp.com/images/' + $scope.item.images[i]});
            }
//            $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/300/200'});
//            $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/301/200'});
//            $scope.slides.push({text: 'cats!', image: 'http://placekitten.com/302/200'});

            $scope.setActive = function (idx) {
                $scope.slides[idx].active = true;
            }

        });
        $scope.putItemToCart = function (itemId) {
            shoppingCart.putItemToCart(itemId, function () {
                console.log('Item added: ' + itemId);
            });
        };
    });