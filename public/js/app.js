var app = angular.module('app', ['ngRoute', 'swipe'], function($routeProvider) {
    $routeProvider.when('/calendar/:userId', {
        templateUrl: 'calendar.html'
    });
    $routeProvider.when('/booking/:userId/:date', {
        templateUrl: 'booking.html'
    });
    $routeProvider.when('/booking/:userId/:date/:startTime/:endTime/:store', {
        templateUrl: 'bookingConfirm.html'
    });
    $routeProvider.when('/booking/:userOrder', {
        templateUrl: 'bookingComplete.html'
    });
    $routeProvider.when('/myorder/:userId', {
        templateUrl: 'myorder.html'
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