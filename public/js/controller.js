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

            $scope.storeLists = res.data
            $scope.date = date
        })

    $(document).ready(function() { //選定下拉式選單
        $('#storeName').change(function() {
            var store = $(this).find("option:selected").attr('value')

            function gototime() {
                $http.post(URL + "/booking/" + store + "/" + date)
                    .then(function(res, req) {
                        $scope.store = res.data[0][0]
                        $scope.list = res.data[1]
                        $scope.check = res.data[2]
                    })
            }
            gototime()
        });
    });


});