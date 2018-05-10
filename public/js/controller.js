app.controller('calendarCtrl', function($scope, $routeParams, $http) {
    var userId = $routeParams.userId;
    var URL = 'http://localhost:3000'
    $http.get(URL + "/user/" + userId + '/order')
        .then(function(res, req) {
            $scope.$broadcast('loadEvents', res.data)
        })
    $http.get(URL + "/init" + '/list')
        .then(function(res, req) {
            $scope.$broadcast('initList', res.data)
        })

});