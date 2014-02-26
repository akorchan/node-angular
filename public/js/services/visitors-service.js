'use strict';

/** store items service */
angular.module('store.services').service('VisitorsService', function ($http) {

    var getVisitors = function (number, startFrom, callback) {
        $http({method: "GET", data: JSON.stringify({number: number, startFrom: startFrom}), url: "/visitors"}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    return {
        getVisitors: getVisitors
    };

});