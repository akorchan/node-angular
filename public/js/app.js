'use strict';

angular.module('store', ['store.controllers', 'store.services']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/home', {templateUrl: 'public/partials/home.html', controller: 'HomeAbout'}).
            when('/about', {templateUrl: 'public/partials/about.html', controller: 'AboutController'}).
            otherwise({redirectTo: '/home'});
    });

//
//    .controller('AboutCtrl', ['$scope', 'StateService', function ($scope, StateService) {
//        $scope.title = 'About Page';
//        $scope.body = 'This is the about page body';
//
//        $scope.message = StateService.getMessage();
//
//        $scope.updateMessage = function (m) {
//            StateService.setMessage(m);
//        };
//    }])
//    .controller('ExperimentsCtrl', ['$scope', 'StateService', function ($scope, StateService) {
//        $scope.title = 'Experiments Page';
//        $scope.body = 'This is the about experiments body';
//
//        $scope.message = StateService.getMessage();
//
//        $scope.updateMessage = function (m) {
//            StateService.setMessage(m);
//        };
//    }])
//    .controller('HomeCtrl', ['$scope', 'StateService', function ($scope, StateService) {
//        $scope.title = 'Home Page';
//        $scope.body = 'This is the about home body';
//
//        $scope.message = StateService.getMessage();
//
//        $scope.updateMessage = function (m) {
//            StateService.setMessage(m);
//        };
//    }])
//    .factory('StateService', function () {
//        var message = 'Hello Message';
//        var getMessage = function() {
//            return message;
//        };
//        var setMessage = function(m) {
//            message = m;
//        };
//
//        return {
//            getMessage: getMessage,
//            setMessage: setMessage
//        }
//    });


/** services module initialization, allows adding services to module in multiple files */
angular.module('store.services', [/*'ngCookies'*/]);

/** controllers module initialization, allows adding services to module in multiple files */
angular.module('store.controllers', ['ui.bootstrap', 'store.services']);