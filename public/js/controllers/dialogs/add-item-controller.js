'use strict';

/** Controllers */
angular.module('store.controllers')
    .controller('AddItemController', function ($scope, $modalInstance, $http, items, storeItems) {

        $scope.downloadSize = "Предпочтительный размер изображения: 20-50 КБ";

        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                $scope.uploadedFile = args.file;
                $scope.newItem.image = args.file.name;
                $scope.downloadSize = "Размер загруженного изображения " + (args.file.size / 1024).toFixed(0) + " КБ";
            });
        });

        $scope.newItem = {};

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
//            $scope.newItem.type = 2; //should be removed
//            storeItems.addItem($scope.newItem, $scope.uploadedFile, function () {
//                alert("QQQ")
//            });


            $http({
                method: 'POST',
                url: "/items",
                //IMPORTANT!!! You might think this should be set to 'multipart/form-data'
                // but this is not true because when we are sending up files the request
                // needs to include a 'boundary' parameter which identifies the boundary
                // name between parts in this multi-part request and setting the Content-type
                // manually will not set this boundary parameter. For whatever reason,
                // setting the Content-type to 'false' will force the request to automatically
                // populate the headers properly including the boundary parameter.
                headers: { 'Content-Type': false },
                //This method will allow us to change how the data is sent up to the server
                // for which we'll need to encapsulate the model data in 'FormData'
                transformRequest: function (data) {
                    var formData = new FormData();
                    //need to convert our json object to a string version of json otherwise
                    // the browser will do a 'toString()' on the object which will result
                    // in the value '[Object object]' on the server.
                    formData.append("object", angular.toJson(data.model));
                    //now add all of the assigned files
                    formData.append("file", data.file);
                    return formData;
                },
                //Create an object that contains the model and files which will be transformed
                // in the above transformRequest method
                data: { object: $scope.newItem, file: $scope.uploadedFile }
            }).
                success(function (data, status, headers, config) {
                    alert("success!");
                }).
                error(function (data, status, headers, config) {
                    alert("failed!");
                });


            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });