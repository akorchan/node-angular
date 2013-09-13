'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AdminController', function ($scope, storeItems, $http, $timeout, $dialog, $location) {
        storeItems.getAllItems(function (data) {
            $scope.items = data;
        });
        $scope.addItemDialog = function () {
//            $timeout(function(){
            $dialog.dialog({}).open('public/partials/dialogs/add-item-dialog.html');
//            }, 3000);
        }
    });