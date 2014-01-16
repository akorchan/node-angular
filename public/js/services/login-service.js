'use strict';

/** store items service */
angular.module('store.services').service('LoginService', function ($http) {

    var login = function (username, password, callback) {
        console.log("login " + username + "/" + password);
        $http({method: "POST", data: JSON.stringify({user:username, pass:password}), url: "/user/login"}).
            success(function (data) {
                callback(data);
            }).error(function (data) {
                console.log(data);
            });
    };

    return {
        login: login
    };

});