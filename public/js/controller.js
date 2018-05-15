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

app.controller('bookingCtrl', function($scope, $routeParams, $http) {
    var date = $routeParams.date;
    var URL = 'http://localhost:3000'
    $http.get(URL + "/user/" + date + '/booking')
        .then(function(res, req) {

            $scope.orderLists = res.data[0]
            $scope.storeLists = res.data[1]
            $scope.date = date
        })

    $(document).ready(function() {
        $('#storeName').change(function() {
            var store = $(this).find("option:selected").attr('value')

            function gototime() {
                $http.post(URL + "/booking/" + store)
                    .then(function(res, req) {
                        list = []
                        $scope.store = res.data[0]
                        for (i = 0; i < res.data[0].endAt - res.data[0].startAt; i+=Number(res.data[0].bookingBlock)) {
                            list.push(i)
                            $scope.list = list
                        }
                    })
            }
            gototime()
        });
    });


});