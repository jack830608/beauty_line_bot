'use strict';

app.filter('rangecal', function() {
    return function(input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
})

app.directive('myCalendar', function() {
    return {
        restrict: 'E',
        transclude: true,
        require: 'display',
        scope: { display: "=", dateformat: "=" }, // = 雙向綁定、@ 單向綁定
        controller: ['$scope', '$filter', function($scope, $filter) {

            var _MS_PER_DAY = 1000 * 60 * 60 * 24;

            function dateDiffInDays(a, b) { // result = b - a
                // Discard the time and time-zone information.
                var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                return Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }

            var calMonths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

            // these are the days of the week for each month, in order
            var calDaysForMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            var selectedYear, selectedMonth, selectedDate, shortMonth;

            var CurrentDate = new Date();

            $scope.calMonths = [
                [{ 'id': 0, 'name': '1月' }, { 'id': 1, 'name': '2月' }, { 'id': 2, 'name': '3月' }, { 'id': 3, 'name': '4月' }],
                [{ 'id': 4, 'name': '5月' }, { 'id': 5, 'name': '6月' }, { 'id': 6, 'name': '7月' }, { 'id': 7, 'name': '8月' }],
                [{ 'id': 8, 'name': '9月' }, { 'id': 9, 'name': '10月' }, { 'id': 10, 'name': '11月' }, { 'id': 11, 'name': '12月' }]
            ];

            $scope.$on('loadEvents', function(e, data) { // 從後端拿到訂單後
                $scope.events = data[0];
                $scope.userId = data[1];
                selectedYear = new Date().getFullYear();
                selectedMonth = new Date().getMonth();
                selectedDate = new Date().getDate();


                $scope.$on('initList', function(e, init) { //從後端拿到初始化設定資料
                    var closeDateByMonth = init.closeDateByMonth
                    var closeDateByWeek = init.closeDateByWeek
                    var dayOfBook = init.dayOfBook
                    var afterBook = init.afterBook
                    if (closeDateByMonth != undefined) {
                        var closeByMonth = closeDateByMonth.split(',').map(function(item) {
                            return parseInt(item, 10); //將Srting轉成Array
                        });
                    } else { closeByMonth = [] }

                    // 當取得特地休假日時
                    $scope.$on('closedList', function(e, closed) {
                        var closedList = []
                        for (var i = 0; i < closed.length; i++) {
                            closedList.push((new Date(closed[i].date).getFullYear() + '/' + new Date(closed[i].date).getMonth() + '/' + new Date(closed[i].date).getDate()))
                        }




                        $scope.UICalendarDisplay = {};
                        $scope.UICalendarDisplay.Date = true;
                        $scope.UICalendarDisplay.Month = false;
                        $scope.UICalendarDisplay.Year = false;

                        $scope.returnToday = function() {
                            selectedYear = new Date().getFullYear(),
                                selectedMonth = new Date().getMonth(),
                                selectedDate = new Date().getDate();
                            $scope.displayMonthCalendar();
                            $scope.displayCompleteDate();
                        }
                        $scope.displayCompleteDate = function() {
                            var timeStamp = new Date(selectedYear, selectedMonth, selectedDate).getTime();
                            if (angular.isUndefined($scope.dateformat)) {
                                var format = "dd - MMM - yy";
                            } else {
                                var format = $scope.dateformat;
                            }
                            $scope.display = $filter('date')(timeStamp, format);
                            $scope.$emit('dateClick', $scope.display);
                        }

                        //Onload Display Current Date
                        $scope.displayCompleteDate();

                        $scope.UIdisplayDatetoMonth = function() {
                            $scope.UICalendarDisplay.Date = false;
                            $scope.UICalendarDisplay.Month = true;
                            $scope.UICalendarDisplay.Year = false;
                        }

                        // $scope.UIdisplayMonthtoYear = function() {
                        //  $scope.UICalendarDisplay.Date = false;
                        //  $scope.UICalendarDisplay.Month = false;
                        //  $scope.UICalendarDisplay.Year = true;
                        // }

                        // $scope.UIdisplayYeartoMonth = function() {
                        //  $scope.UICalendarDisplay.Date = false;
                        //  $scope.UICalendarDisplay.Month = true;
                        //  $scope.UICalendarDisplay.Year = false;
                        // }

                        $scope.UIdisplayMonthtoDate = function() {
                            $scope.UICalendarDisplay.Date = true;
                            $scope.UICalendarDisplay.Month = false;
                            $scope.UICalendarDisplay.Year = false;
                        }

                        /**
                         * 當往右滑動會觸發的 function
                         */
                        $scope.selectedMonthPrevClick = function() {
                            // selectedDate = 1;
                            if (selectedMonth == 0) {
                                selectedMonth = 11;
                                selectedYear--;
                            } else {
                                $scope.dislayMonth = selectedMonth--;
                            }
                            $scope.displayMonthCalendar();
                            $scope.displayCompleteDate();
                        }

                        $scope.selectedMonthNextClick = function() {
                            // selectedDate = 1;
                            if (selectedMonth == 11) {
                                selectedMonth = 0;
                                selectedYear++;
                            } else {
                                $scope.dislayMonth = selectedMonth++;
                            }
                            $scope.displayMonthCalendar();
                            $scope.displayCompleteDate();
                        }

                        $scope.selectedMonthYearPrevClick = function() {
                            selectedYear--;
                            $scope.displayYear = selectedYear;
                            $scope.displayMonthCalendar();
                        }

                        $scope.selectedMonthYearNextClick = function() {
                            selectedYear++;
                            $scope.displayYear = selectedYear;
                            $scope.displayMonthCalendar();
                        }

                        // $scope.selectedDecadePrevClick = function() { 
                        //  selectedYear -= 10; 
                        //  $scope.displayMonthCalendar(); 
                        // }

                        // $scope.selectedDecadeNextClick = function() { 
                        //  selectedYear += 10; 
                        //  $scope.displayMonthCalendar();
                        // }

                        // $scope.selectedYearClick = function(year) {
                        //  $scope.displayYear = year;
                        //  selectedYear = year;
                        //  $scope.displayMonthCalendar();
                        //  $scope.UICalendarDisplay.Date = false;
                        //  $scope.UICalendarDisplay.Month = true;
                        //  $scope.UICalendarDisplay.Year = false;
                        //  $scope.displayCompleteDate();
                        // }


                        $scope.selectedMonthClick = function(month) {
                            $scope.dislayMonth = month;
                            selectedMonth = month;
                            $scope.displayMonthCalendar();
                            $scope.UICalendarDisplay.Date = true;
                            $scope.UICalendarDisplay.Month = false;
                            $scope.UICalendarDisplay.Year = false;
                            $scope.displayCompleteDate();
                        }

                        $scope.selectedDateClick = function(date) {
                            $scope.displayDate = date.date;
                            selectedDate = date.date;
                            var d = selectedYear + "-" + (selectedMonth + 1) + "-" + selectedDate
                            if (date.type == 'newMonth') {
                                var mnthDate = new Date(selectedYear, selectedMonth, 32)
                                selectedMonth = mnthDate.getMonth();
                                selectedYear = mnthDate.getFullYear();
                                $scope.displayMonthCalendar();
                            } else if (date.type == 'oldMonth') {
                                var mnthDate = new Date(selectedYear, selectedMonth, 0);
                                selectedMonth = mnthDate.getMonth();
                                selectedYear = mnthDate.getFullYear();
                                $scope.displayMonthCalendar();
                            } else if (date.type == 'currentMonth') {
                                window.open("https://api.lifegoez.com/#/booking/" + $scope.userId + "/" + d, "_self")
                            }
                            $scope.displayCompleteDate();
                        }

                        /**
                         * draw calendar =================================================
                         */
                        $scope.displayMonthCalendar = function() {
                            /*Year Display Start*/
                            $scope.startYearDisp = (Math.floor(selectedYear / 10) * 10) - 1;
                            $scope.endYearDisp = (Math.floor(selectedYear / 10) * 10) + 10;
                            /*Year Display End*/


                            $scope.datesDisp = [
                                [],
                                [],
                                [],
                                [],
                                [],
                                []
                            ];
                            var countDatingStart = 1;
                            var endingDateLimit;
                            var thisMonthEndingDateLimit
                            if (calMonths[selectedMonth] === 'February') {
                                if (selectedYear % 4 === 0) {
                                    endingDateLimit = 29;
                                } else {
                                    endingDateLimit = 28;
                                }
                            } else {
                                endingDateLimit = calDaysForMonth[selectedMonth];
                                thisMonthEndingDateLimit = calDaysForMonth[new Date().getMonth()]
                            }
                            var startDay = new Date(selectedYear, selectedMonth, 1).getDay();

                            $scope.displayYear = selectedYear;
                            $scope.dislayMonth = calMonths[selectedMonth];
                            $scope.shortMonth = calMonths[selectedMonth].slice(0, 3);

                            $scope.displayDate = selectedDate;

                            var nextMonthdates = 1;
                            var prevMonthLastDates = new Date(selectedYear, selectedMonth, 0).getDate();

                            // selectedMonth 要特別注意，+1 才是真正的月份，而使用 new Date 他本身就會幫你加1
                            // 過濾本月要顯示的課程
                            var currentMonthEvents = []
                            _.map($scope.events, function(e) {


                                var sD = new Date(e.date)
                                sD = new Date(sD.getFullYear(), sD.getMonth(), 1)
                                sD.setHours(0, 0, 0, 0)
                                var eD = new Date(selectedYear, selectedMonth, 30).setHours(23, 59, 59, 999)
                                if (e.endDate) {
                                    eD = new Date(e.endDate)
                                    eD = new Date(eD.getFullYear(), eD.getMonth(), 30)
                                    eD.setHours(23, 59, 59, 999)
                                }
                                var selectD = new Date(selectedYear, selectedMonth, 1).setHours(0, 0, 0, 0)
                                if (selectD >= sD && selectD <= eD) { // 如果所選年月 >= 開始年月則要顯示 && 如有停課日期，則所選年月 <= 停課年月則要顯示
                                    currentMonthEvents.push(e)

                                }
                            })


                            for (var i = 0; i < 6; i++) { // 開始畫日期，共畫6週
                                if (typeof $scope.datesDisp[0][6] === 'undefined') { // 如果目前 datesDisp 第一個陣列沒完成 // 第一週
                                    for (var j = 0; j < 7; j++) {

                                        if (j < startDay) {
                                            $scope.datesDisp[i][j] = { "type": "oldMonth", "date": (prevMonthLastDates - startDay + 1) + j };
                                        } else { // 畫第一週

                                            if (selectedMonth == new Date().getMonth() && countDatingStart < new Date().getDate()) { //今天以前的日期全部反灰
                                                $scope.datesDisp[i][j] = { "type": "today", "date": countDatingStart };
                                            } else if (closedList.indexOf((selectedYear + '/' + selectedMonth + '/' + countDatingStart)) >= 0) { //設定特殊休假
                                                console.log('store close at ' + selectedYear + '/' + selectedMonth + 1 + '/' + countDatingStart)
                                                $scope.datesDisp[i][j] = { "type": "close", "date": countDatingStart };
                                            } else if (j == closeDateByWeek) { //每週固定店休
                                                console.log('store close every week ' + closeDateByWeek)
                                                $scope.datesDisp[i][j] = { "type": "closeWeek", "date": countDatingStart };
                                            } else if (closeByMonth.indexOf(countDatingStart) >= 0) { //每月固定店休
                                                console.log('store close every month ' + closeByMonth)
                                                $scope.datesDisp[i][j] = { "type": "closeMonth", "date": countDatingStart }
                                            } else if (selectedMonth != new Date().getMonth()) { //只要不等於本月訂單全部不可以選
                                                if (new Date().getDate() + dayOfBook > thisMonthEndingDateLimit &&
                                                    selectedMonth == new Date().getMonth() + 1 &&
                                                    (new Date().getDate() + dayOfBook) - thisMonthEndingDateLimit >= countDatingStart &&
                                                    (new Date().getDate() + afterBook) - thisMonthEndingDateLimit <= countDatingStart
                                                ) {
                                                    $scope.datesDisp[i][j] = { "type": "currentMonth", "date": countDatingStart };
                                                    _.map(currentMonthEvents, function(e) { // 尋找當月課程是否與當前同天，有的話則紀錄當天有 event
                                                        var stD = new Date(e.date)
                                                        var seD = new Date(selectedYear, selectedMonth, countDatingStart)
                                                        var diff = dateDiffInDays(stD, seD)
                                                        if (diff == 0 && !e.frequency) { // 臨時課程
                                                            console.log('have a order ' + selectedYear + "/" + (selectedMonth + 1) + "/" + countDatingStart);
                                                            if (countDatingStart - new Date().getDate() > 3) {
                                                                $scope.datesDisp[i][j]["e"] = true
                                                            } else if (new Date().getMonth() < selectedMonth) {
                                                                if (thisMonthEndingDateLimit - new Date().getDate() + countDatingStart < 3) {
                                                                    $scope.datesDisp[i][j]["e"] = false
                                                                } else { $scope.datesDisp[i][j]["e"] = true }
                                                            } else {
                                                                $scope.datesDisp[i][j]["e"] = false
                                                            }
                                                        }
                                                    })
                                                } else { $scope.datesDisp[i][j] = { "type": "wrongMonth", "date": countDatingStart } }
                                            } else if (new Date().getDate() + dayOfBook < countDatingStart) { //幾天前開始接受預約
                                                console.log('dayOfBook is ' + dayOfBook)
                                                $scope.datesDisp[i][j] = { "type": "dayOfBook", "date": countDatingStart };
                                            } else if (new Date().getDate() + afterBook > countDatingStart) { //幾天後可以預約
                                                console.log('afterBook is ' + afterBook)
                                                $scope.datesDisp[i][j] = { "type": "afterBook", "date": countDatingStart };
                                                _.map(currentMonthEvents, function(e) { // 尋找當月課程是否與當前同天，有的話則紀錄當天有 event
                                                    var stD = new Date(e.date)
                                                    var seD = new Date(selectedYear, selectedMonth, countDatingStart)
                                                    var diff = dateDiffInDays(stD, seD)
                                                    if (diff == 0 && !e.frequency) { // 臨時課程
                                                        console.log('have a order ' + selectedYear + "/" + (selectedMonth + 1) + "/" + countDatingStart);
                                                        if (countDatingStart - new Date().getDate() > 3) {
                                                            $scope.datesDisp[i][j]["e"] = true
                                                        } else if (new Date().getMonth() < selectedMonth && new Date().getDate() - thisMonthEndingDateLimit + countDatingStart > 0) { $scope.datesDisp[i][j]["e"] = true } else {
                                                            $scope.datesDisp[i][j]["e"] = false
                                                        }
                                                    }
                                                })
                                            } else {
                                                $scope.datesDisp[i][j] = { "type": "currentMonth", "date": countDatingStart };
                                                _.map(currentMonthEvents, function(e) {
                                                    // 當月所有的訂單
                                                    // 如果日期對應上的話，要讓頁面顯示當天有預約
                                                    var stD = new Date(e.date)
                                                    var seD = new Date(selectedYear, selectedMonth, countDatingStart)
                                                    var diff = dateDiffInDays(stD, seD)
                                                    if (diff == 0 && !e.frequency) { // 臨時課程
                                                        console.log('have a order ' + selectedYear + "/" + (selectedMonth + 1) + "/" + countDatingStart);
                                                        if (countDatingStart - new Date().getDate() > 3) {
                                                            $scope.datesDisp[i][j]["e"] = true;
                                                        } else if (new Date().getMonth() < selectedMonth && new Date().getDate() - thisMonthEndingDateLimit + countDatingStart > 0) { $scope.datesDisp[i][j]["e"] = true } else {
                                                            $scope.datesDisp[i][j]["e"] = false
                                                        }
                                                    }
                                                })
                                            };
                                            countDatingStart++;
                                        }
                                    }
                                } else {
                                    for (var k = 0; k < 7; k++) {
                                        if (countDatingStart <= endingDateLimit) {
                                            if (selectedMonth == new Date().getMonth() && countDatingStart < new Date().getDate()) { //今天以前的日期全部反灰
                                                $scope.datesDisp[i][k] = { "type": "today", "date": countDatingStart };
                                            } else if (closedList.indexOf((selectedYear + '/' + selectedMonth + '/' + countDatingStart)) >= 0) { //設定特殊休假
                                                console.log('store close at ' + selectedYear + '/' + (selectedMonth + 1) + '/' + countDatingStart)
                                                $scope.datesDisp[i][k] = { "type": "close", "date": countDatingStart };
                                            } else if (k == closeDateByWeek) { //每週固定店休
                                                console.log('store close every week ' + closeDateByWeek)
                                                $scope.datesDisp[i][k] = { "type": "closeWeek", "date": countDatingStart };
                                            } else if (closeByMonth.indexOf(countDatingStart) >= 0) { //每月固定店休
                                                console.log('store close every month ' + closeByMonth)
                                                $scope.datesDisp[i][k] = { "type": "closeMonth", "date": countDatingStart }
                                            } else if (selectedMonth != new Date().getMonth()) {
                                                if (new Date().getDate() + dayOfBook > thisMonthEndingDateLimit &&
                                                    selectedMonth == new Date().getMonth() + 1 &&
                                                    (new Date().getDate() + dayOfBook) - thisMonthEndingDateLimit >= countDatingStart &&
                                                    (new Date().getDate() + afterBook) - thisMonthEndingDateLimit <= countDatingStart

                                                ) {
                                                    $scope.datesDisp[i][k] = { "type": "currentMonth", "date": countDatingStart };
                                                    _.map(currentMonthEvents, function(e) {
                                                        var stD = new Date(e.date)
                                                        var seD = new Date(selectedYear, selectedMonth, countDatingStart)
                                                        var diff = dateDiffInDays(stD, seD)
                                                        if (diff == 0 && !e.frequency) { // 臨時課程
                                                            console.log('have a order ' + selectedYear + "/" + (selectedMonth + 1) + "/" + countDatingStart);
                                                            if (countDatingStart - new Date().getDate() > 3) {
                                                                $scope.datesDisp[i][k]["e"] = true
                                                            } else if (new Date().getMonth() < selectedMonth) {
                                                                if (thisMonthEndingDateLimit - new Date().getDate() + countDatingStart < 3) {
                                                                    $scope.datesDisp[i][k]["e"] = false
                                                                } else { $scope.datesDisp[i][k]["e"] = true }
                                                            } else {
                                                                $scope.datesDisp[i][k]["e"] = false
                                                            }

                                                        }
                                                    })
                                                } else { $scope.datesDisp[i][k] = { "type": "wrongMonth", "date": countDatingStart } }
                                            } else if (new Date().getDate() + dayOfBook < countDatingStart) { //幾天前開始接受預約
                                                console.log('dayOfBook is ' + dayOfBook)
                                                $scope.datesDisp[i][k] = { "type": "dayOfBook", "date": countDatingStart };
                                            } else if (new Date().getDate() + afterBook > countDatingStart) { //幾天後可以預約
                                                console.log('afterBook is ' + afterBook)
                                                $scope.datesDisp[i][k] = { "type": "afterBook", "date": countDatingStart };
                                                _.map(currentMonthEvents, function(e) { // 尋找當月課程是否與當前同天，有的話則紀錄當天有 event
                                                    var stD = new Date(e.date)
                                                    var seD = new Date(selectedYear, selectedMonth, countDatingStart)
                                                    var diff = dateDiffInDays(stD, seD)
                                                    if (diff == 0 && !e.frequency) { // 臨時課程
                                                        console.log('have a order ' + selectedYear + "/" + (selectedMonth + 1) + "/" + countDatingStart);
                                                        if (countDatingStart - new Date().getDate() > 3) {
                                                            $scope.datesDisp[i][k]["e"] = true
                                                        } else if (new Date().getMonth() < selectedMonth && new Date().getDate() - thisMonthEndingDateLimit + countDatingStart > 0) { $scope.datesDisp[i][j]["e"] = true } else {
                                                            $scope.datesDisp[i][k]["e"] = false
                                                        }
                                                    }
                                                })
                                            } else {
                                                $scope.datesDisp[i][k] = { "type": "currentMonth", "date": countDatingStart };
                                                _.map(currentMonthEvents, function(e) { // 尋找當月課程是否與當前同天，有的話則紀錄當天有 event
                                                    var stD = new Date(e.date)
                                                    var seD = new Date(selectedYear, selectedMonth, countDatingStart)
                                                    var diff = dateDiffInDays(stD, seD)
                                                    if (diff == 0 && !e.frequency) { // 臨時課程
                                                        console.log('have a order ' + selectedYear + "/" + (selectedMonth + 1) + "/" + countDatingStart);
                                                        if (countDatingStart - new Date().getDate() > 3) {
                                                            $scope.datesDisp[i][k]["e"] = true
                                                        } else if (new Date().getMonth() < selectedMonth && new Date().getDate() - thisMonthEndingDateLimit + countDatingStart > 0) { $scope.datesDisp[i][k]["e"] = true } else {
                                                            $scope.datesDisp[i][k]["e"] = false
                                                        }

                                                    }
                                                })
                                            };
                                            countDatingStart++;
                                        } else {
                                            $scope.datesDisp[i][k] = { "type": "newMonth", "date": nextMonthdates++ };

                                        }
                                    }

                                }
                            }
                            // })
                        }
                        //  1.判斷預約日期是否為三天內,若為三天內則顯示紅色點且無法取消預約,若不在三天內則顯示藍色點且可以取消預約
                        //  2.找出資料庫內幾天前開放預約&店休日期,其他日期屏蔽掉
                        // ====================================================================
                        $scope.displayMonthCalendar();
                    });
                });
            })
        }],
        template: '<style>' +
            '.ionic_Calendar .col.fadeDate{color:#D5D5D5}' +
            '.ionic_Calendar .calendar_Date .row.Daysheading {text-align:center;}' +
            '.ionic_Calendar .txtCenter {text-align:center;}' +
            '.ionic_Calendar .col.selMonth { background-color: #04BDD7; color:white; }' +
            '.ionic_Calendar .col.selDate { background-color: #04BDD7; color:white; }' +
            '.ionic_Calendar .col.selYear { background-color: #04BDD7; color:white;  }' +
            '.ionic_Calendar .col.fadeDateDisp, .col.fadeYear { background-color: #E9E9E9; color:#D5D5D5 }' +
            '.ionic_Calendar .DaysDisplay .col{ border: 1px solid #F3F3F3; padding-top: 10px; font-weight: bolder; height: 40px;}' +
            '.ionic_Calendar .DaysDisplay.row{ padding-left: 0px; padding-right: 0px; }' +
            '.ionic_Calendar .MonthsDisplay.row{ padding-left: 0px; padding-right: 0px; }' +
            '.ionic_Calendar .MonthsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 18px;  height: 80px;}' +
            '.ionic_Calendar .YearsDisplay.row{ padding-left: 0px; padding-right: 0px; }' +
            '.ionic_Calendar .YearsDisplay .col{ border: 1px solid #F3F3F3; padding-top: 30px; font-size: 18px; height: 80px;}' +
            '.ionic_Calendar .marginTop0 { margin-top: 0px !important;}' +
            '.ionic_Calendar .paddingBottom0 { padding-bottom: 0px !important;}' +
            '.ionic_Calendar .Daysheading_Label .col { padding-bottom: 0px !important;}' +
            '</style>' +
            '<div class="ionic_Calendar">' +
            '   <div class="calendar_Date" ng-show="UICalendarDisplay.Date">' +
            '       <div class="row" style=" background-color: #3F3F3F;  color: white;">'
            // +'         <div class="col txtCenter" ><i class="icon ion-chevron-left" ng-click="selectedMonthPrevClick()"></i></div>'
            +
            '         <div class="col txtCenter"></div>' +
            '         <div class="col col-75 txtCenter" ng-click="UIdisplayDatetoMonth()">{{displayYear}}年{{dislayMonth}}月</div>'
            // +'         <div class="col txtCenter"><i class="icon ion-chevron-right"  ng-click="selectedMonthNextClick()"></i></div>'
            +
            '         <div class="col txtCenter" ng-click="returnToday()">今日</div>' +
            '       </div>' +
            '       <div class="row Daysheading Daysheading_Label" style="background-color: #383737; color: white;">' +
            '         <div class="col">日</div><div class="col">一</div><div class="col">二</div><div class="col">三</div><div class="col">四</div><div class="col">五</div><div class="col">六</div>' +
            '       </div>' +
            '       <div ng-swipe-left="selectedMonthNextClick()" ng-swipe-right="selectedMonthPrevClick()" on-swipe-left="selectedMonthNextClick()" on-swipe-right="selectedMonthPrevClick()" class="row Daysheading DaysDisplay" ng-repeat = "rowVal in datesDisp  track by $index" ng-class="{\'marginTop0\':$first}">' +
            '         <div class="col date" ng-repeat = "colVal in rowVal  track by $index" ng-class="{\'fadeDateDisp\':(colVal.type == \'oldMonth\' || colVal.type == \'newMonth\') ,\'fadeDate\':(colVal.type == \'today\'|| colVal.type == \'closeWeek\'|| colVal.type == \'dayOfBook\'|| colVal.type == \'closeMonth\'|| colVal.type == \'wrongMonth\'|| colVal.type == \'close\'|| colVal.type == \'afterBook\'), \'haveEventBlue\':(colVal.e) ,\'haveEventRed\':(colVal.e==false) ,\'selDate\':(colVal.date == displayDate && colVal.type == \'currentMonth\')}"  ng-click="selectedDateClick(colVal)" >{{colVal.date}}</div> ' +
            '       </div>' +
            '   </div>' +
            '   <div class="calendar_Month" ng-show="UICalendarDisplay.Month">' +
            '       <div class="row" style=" background-color: #3F3F3F;  color: white;">' +
            '         <div class="col txtCenter"><i class="icon ion-chevron-left" ng-click="selectedMonthYearPrevClick()"></i></div>' +
            '         <div class="col col-75 txtCenter" ng-click="UIdisplayMonthtoYear()">{{displayYear}}</div>' +
            '         <div class="col txtCenter"><i class="icon ion-chevron-right" ng-click="selectedMonthYearNextClick()"></i></div>' +
            '       </div>' +
            '       <div class="row txtCenter MonthsDisplay" ng-repeat = "rowVal in calMonths  track by $index" ng-class="{\'marginTop0\':$first}">' +
            '         <div class="col" ng-repeat = "colVal in rowVal  track by $index"  ng-class="(colVal.name == shortMonth) ? \'selMonth\' : \'NonSelMonth\'"  ng-click="selectedMonthClick(colVal.id)" >{{colVal.name}}</div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="calendar_Year" ng-show="UICalendarDisplay.Year">' +
            '       <div class="row" style=" background-color: #3F3F3F;  color: white;">' +
            '         <div class="col txtCenter"><i class="icon ion-chevron-left" ng-click="selectedDecadePrevClick()"></i></div>' +
            '         <div class="col col-75 txtCenter">{{startYearDisp+1}}-{{endYearDisp-1}}</div>' +
            '         <div class="col txtCenter"><i class="icon ion-chevron-right" ng-click="selectedDecadeNextClick()"></i></div>' +
            '       </div>' +
            '       <div class="row txtCenter YearsDisplay" ng-repeat = "nx in []| rangecal:3" ng-class="{\'marginTop0\':$first}">' +
            '         <div class="col" ng-repeat="n in [] | rangecal:4"  ng-class="{ \'fadeYear\': (((startYearDisp+nx+nx+nx+nx+n) == startYearDisp)||((startYearDisp+nx+nx+nx+nx+n) == endYearDisp)), \'selYear\': ((startYearDisp+nx+nx+nx+nx+n) == displayYear) }" ng-click="selectedYearClick((startYearDisp+nx+nx+nx+nx+n))">{{startYearDisp+nx+nx+nx+nx+n}}</div>' +
            '       </div>' +
            '   </div>' +
            '</div>'
    };
});