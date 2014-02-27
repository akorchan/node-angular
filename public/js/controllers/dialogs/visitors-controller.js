'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('VisitorsController', function ($scope, $modalInstance, VisitorsService) {

        VisitorsService.getVisitors(10, 0, function (data) {
            $scope.visitors = data;
        });

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });