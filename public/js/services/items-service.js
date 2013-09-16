'use strict';

/** store items service */
angular.module('store.services').service('storeItems', function ($http) {

    /**
     * Get all available items bt type.
     * @param callback
     */
    var getAllItemsByType = function (itemType, callback) {
        $http({method: "GET", data: {}, url: "/items?type=" + itemType}).
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
     * Add new item.
     * @param callback
     */
    var addItem = function (objectToStore, fileToStore, callback) {
        $http({method: "POST", data: {object: objectToStore, file: fileToStore}, url: "/items" }).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    /**
     * Update current item.
     * @param callback
     */
    var updateItem = function (callback) {

    };

    /**
     * Delete item.
     * @param callback
     */
    var deleteItem = function (callback) {

    };

    return {
        getAllItemsByType: getAllItemsByType,
        findItemById: findItemById,
        addItem: addItem,
        updateItem: updateItem,
        deleteItem: deleteItem
    };

});