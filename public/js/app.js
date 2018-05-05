// var app = angular.module("app", []);

var app = angular.module('app', ['ngRoute'], function($routeProvider) {
    $routeProvider.when('/calendar/:userId', {
        templateUrl: 'calendar.html'
    });
});