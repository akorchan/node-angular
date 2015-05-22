'use strict';

/** store items service */
angular.module('store.services').service('ConfigService', function ($http) {

    var getCurrencyRate = function (callback) {
        $http({method: "GET", url: "/config/rate"}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    var setNewRate = function (newRate, callback) {
        $http({method: "POST", data: JSON.stringify({rate: newRate}), url: "/config/rate"}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    return {
        getCurrencyRate: getCurrencyRate,
        setNewRate: setNewRate
    };

});