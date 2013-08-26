'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('ContactUsController', function ($scope, $http, $timeout, $location) {
//        if (ncAccount.isLoggedIn()) { $location.path('/map'); }
//        $scope.login = ncAccount.tomtomLogin;
        $scope.title = 'About Page';
        $scope.body = 'This is the about page body';

//        $scope.message = StateService.getMessage();

//        $scope.updateMessage = function (m) {
//            StateService.setMessage(m);
//        };
    });