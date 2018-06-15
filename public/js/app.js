var app = angular.module('app', ['ngRoute', 'swipe'], function($routeProvider) {
    $routeProvider.when('/calendar/:userId', {
        templateUrl: 'calendar.html'
    });
    $routeProvider.when('/admin/calendar', {
        templateUrl: 'adminCalendar.html'
    });
    $routeProvider.when('/booking/:userId/:date', {
        templateUrl: 'booking.html'
    });
    $routeProvider.when('/admin/booking/:date', {
        templateUrl: 'adminBooking.html'
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
    $routeProvider.when('/about', {
        templateUrl: 'about.html'
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

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});