'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('StoreController', function ($scope, $http, $timeout, $location, storeItems) {
//        if (ncAccount.isLoggedIn()) { $location.path('/map'); }
//        $scope.login = ncAccount.tomtomLogin;

        storeItems.getAllItems(function (data) {
            $scope.items = data;
        });
//        $scope.message = StateService.getMessage();

//        $scope.updateMessage = function (m) {
//            StateService.setMessage(m);
//        };
    });