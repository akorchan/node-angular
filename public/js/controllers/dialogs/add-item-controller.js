'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AddItemController', function ($scope, $modalInstance, items) {

        $scope.downloadSize = "Предпочтительный размер изображения: 20-50 КБ";

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.uploadedFile = args.file;
                $scope.downloadSize = "Размер загруженного изображения " + (args.file.size / 1024).toFixed(0) + " КБ";
            });
        });
        $scope.$apply();

        $scope.itemName = "asd";

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $scope.$apply();
            alert($scope.itemName);
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });