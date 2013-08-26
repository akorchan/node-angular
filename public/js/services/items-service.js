'use strict';

/** store items service */
angular.module('store.services').service('storeItems', function ($http) {


    var getAllItems = function (callback) {
        $http({method: "GET", data: {}, url: "/item"}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    return {
        getAllItems: getAllItems
    };

});