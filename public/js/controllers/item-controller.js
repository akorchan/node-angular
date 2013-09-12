'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('ItemController', function ($scope, $routeParams, storeItems) {
        storeItems.findItemById($routeParams.itemId, function (data) {
            $scope.item = data;
        });
    });