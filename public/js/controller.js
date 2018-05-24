app.controller('calendarCtrl', function($scope, $routeParams, $http) {
    var userId = $routeParams.userId;
    var URL = 'http://localhost:3000'

    $http.get(URL + "/user/" + userId + '/order')
        .then(function(res, req) {
            $scope.$broadcast('loadEvents', [res.data, userId])
        })
    $http.get(URL + "/init" + '/list')
        .then(function(res, req) {
            $scope.$broadcast('initList', res.data)
        })
    $http.get(URL + "/closed" + '/list')
        .then(function(res, req) {
            $scope.$broadcast('closedList', res.data)
        })

});

app.controller('bookingCtrl', function($scope, $routeParams, $http) {
    var date = $routeParams.date;
    var userId = $routeParams.userId;
    var URL = 'http://localhost:3000'
    $http.get(URL + "/user/" + date + '/booking')
        .then(function(res, req) {
            $scope.storeLists = res.data[0]
            $scope.store = res.data[1][0]
            $scope.list = res.data[2]
            $scope.check = res.data[3]
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

    $scope.click = function(a, b, c) { //取得預約網址
        window.open(URL + "/#/booking/" + userId + "/" + date + '/' + a + '/' + b + '/' + c, "_self")
    }


});

app.controller('confirmCtrl', function($scope, $routeParams, $http) {
    var userId = $routeParams.userId
    var start = $routeParams.startTime;
    var end = $routeParams.endTime;
    var date = $routeParams.date;
    var store = $routeParams.store;
    var URL = 'http://localhost:3000'
    $scope.startAt = start
    $scope.endAt = end
    $scope.date = date
    $scope.store = store
    $scope.userId = userId
    $scope.cancel = function() {
        window.open(URL + "/#/booking/" + userId + "/" + date, "_self")
    }
    $scope.complete = function() {
        $http.post(URL + "/booking/" + userId + "/" + date + "/" + start + "/" + end + "/" + store + "/" + $scope.note)
            .then(function(res, req) {
                if (res.data == "Error") {
                    alert('此時段預約已滿')
                    window.open(URL + "/#/booking/" + userId + "/" + date, "_self")
                } else {
                    $scope.OrderId = res.data
                    window.open(URL + "/#/booking/" + $scope.OrderId, "_self")
                }
            })
    };
})


app.controller('completeCtrl', function($scope, $routeParams, $http) {
    var userOrder = $routeParams.userOrder;
    var URL = 'http://localhost:3000'
    $http.get(URL + "/booking/" + userOrder + '/order')
        .then(function(res, req) {
            $scope.startAt = res.data.startAt;
            $scope.endAt = res.data.endAt;
            $scope.date = new Date(res.data.date).getFullYear() + "-" + (new Date(res.data.date).getMonth() + 1) + "-" + (new Date(res.data.date).getDate());
            $scope.store = res.data.store.name;
            $scope.note = res.data.note;
            $scope.code = res.data.code;
        })
});


app.controller('myorderCtrl', function($scope, $routeParams, $http) {
    var userId = $routeParams.userId;
    var URL = 'http://localhost:3000'
    $http.get(URL + "/user/" + userId + '/myorder')
        .then(function(res, req) {
            $scope.orders = res.data
            $scope.DD = new Date()

        })
    $scope.cancel = function(orderId) { //取得預約網址
        if (confirm("確認取消預約？") == true)
            $http.post(URL + "/cancel/" + orderId)
            .then(function(res, req) {
                if (res.data == 'delete') {
                    window.location.reload()
                } else { alert('錯誤') }
            })
        else
            return false;
    }

});



app.controller('aboutCtrl', function($scope, $routeParams, $http) {
    var URL = 'http://localhost:3000'
    $http.get(URL + "/about/data")
        .then(function(res, req) {
            $scope.storeLists = res.data[0]
            console.log(res.data[0])
            $scope.about = res.data[1]
        })
})