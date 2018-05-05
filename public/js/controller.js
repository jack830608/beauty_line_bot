//var app = angular.module('app', []);

app.controller('appCtrl', function($scope) {
    $scope.friends = [{
            name: '蒙其·D·魯夫',
            reward: 400000000
        }
        // 略...
        , {
            name: '布魯克',
            reward: 33000000
        }
    ];
});

app.controller('calendarCtrl', function($scope, $routeParams, $http) {
	var userId = $routeParams.userId;
	var URL = 'http://localhost:3000'
    $http.get(URL + "/user/" + userId + '/order')
        .then(function(res) {
        	console.log(res.data)
            $scope.$broadcast('loadEvents', res.data)
        })
});