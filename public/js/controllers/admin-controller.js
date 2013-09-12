'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AdminController', function ($scope, storeItems, $http, $timeout, $location) {
        storeItems.getAllItems(function (data) {
            $scope.items = data;
        });
    });