'use strict';

/** store items service */
angular.module('store.services').service('storeItems', function ($http) {

    /**
     * Get all available items bt type.
     * @param callback
     */
    var getAllItemsByType = function (itemType, callback) {
        getLimitedNumberItemsByType(itemType, 0, callback);
    };

    /**
     * Get specified number with specified type.
     * @param itemType
     * @param number
     * @param callback
     */
    var getLimitedNumberItemsByType = function (itemType, number, callback) {
        $http({method: "GET", data: {}, url: "/items?type=" + itemType + "&number=" + number}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    /**
     * Find item by id.
     * @param callback
     */
    var findItemById = function (itemId, callback) {
        $http({method: "GET", data: {}, url: "/items/" + itemId}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };


    /**
     * Add or update new item.
     * @param callback
     */
    var addOrUpdateItem = function (objectToStore, filesToStore, callback) {
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
                formData.append("object", angular.toJson(data.object));
                //now add all of the assigned files
                for (var i in data.files) {
                    //add each file to the form data and iteratively name them
                    formData.append("file" + i, data.files[i]);
                }
                return formData;
            },
            //Create an object that contains the model and files which will be transformed
            // in the above transformRequest method
            data: { object: objectToStore, files: filesToStore }
        }).
            success(function (data, status, headers, config) {
                callback();
            }).
            error(function (data, status, headers, config) {
                console.log(data);
                callback();
            });
    };

    /**
     * Update current item.
     * @param callback
     */
    var updateItem = function (objectToStore, fileToStore, callback) {

    };

    /**
     * Delete item.
     * @param callback
     */
    var deleteItem = function (itemId, callback) {
        $http({method: "DELETE", data: {}, url: "/items/" + itemId}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    return {
        getAllItemsByType: getAllItemsByType,
        getLimitedNumberItemsByType: getLimitedNumberItemsByType,
        findItemById: findItemById,
        addOrUpdateItem: addOrUpdateItem,
        updateItem: updateItem,
        deleteItem: deleteItem
    };

});