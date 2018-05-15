var app = angular.module('app', ['ngRoute'], function($routeProvider) {
    $routeProvider.when('/calendar/:userId', {
        templateUrl: 'calendar.html'
    });
    $routeProvider.when('/booking/:date', {
        templateUrl: 'booking.html'
    });

});

app.filter("int", function() {
    return function(text) {
        return parseInt(text);
    };
});

app.filter("dot", function() {
    return function(text) {
        return text - parseInt(text);
    };
});

app.filter("STN", function() {
    return function(text) {
        return Number(text);
    };
});