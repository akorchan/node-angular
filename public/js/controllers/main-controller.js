'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('MainPageController', function ($scope, $http, $timeout, $location, storeItems) {
        storeItems.getLimitedNumberItemsByType('', 12, function (data) {
            $scope.items = data;
        });
    });