'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('VisitorsController', function ($scope, $modalInstance, VisitorsService) {

        VisitorsService.getVisitors(10, 0, function (data) {
            console.log(data);
        });

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });