//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

"use strict";
var app = angular.module('ionic-datepicker', ['ionic', 'ionic-datepicker.templates']);

app.service('DatepickerService', function () {

    this.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.yearsList = [2015, 2016, 2017, 2018, 2019, 2020];

});

app.directive('ionicDatepicker', ['$rootScope','$ionicPopup', 'DatepickerService', function ($rootScope, $ionicPopup, DatepickerService) {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            ipDate: '=idate',
            disablePreviousDates: '=disablepreviousdates',
            callback: '=callback'
        },
        link: function (scope, element, attrs) {
            $rootScope.ionicDatepicker = scope;

            var monthsList = DatepickerService.monthsList;
            scope.monthsList = monthsList;
            scope.yearsList = DatepickerService.yearsList;

            scope.currentMonth = '';
            scope.currentYear = '';

            if (!scope.ipDate) {
                scope.ipDate = new Date();
            }

            scope.previousDayEpoch = (+(new Date()) - 86400000);
            var currentDate = angular.copy(scope.ipDate);
            currentDate.setHours(0);
            currentDate.setMinutes(0);
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);

            scope.selctedDateString = currentDate.toString();
            scope.weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            scope.today = {};

            var tempTodayObj = new Date();
            var tempToday = new Date(tempTodayObj.getFullYear(), tempTodayObj.getMonth(), tempTodayObj.getDate());

            scope.today = {
                dateObj: tempTodayObj,
                date: tempToday.getDate(),
                month: tempToday.getMonth(),
                year: tempToday.getFullYear(),
                day: tempToday.getDay(),
                dateString: tempToday.toString(),
                epochLocal: tempToday.getTime(),
                epochUTC: (tempToday.getTime() + (tempToday.getTimezoneOffset() * 60 * 1000))
            };

            var refreshDateList = function (current_date) {
                current_date.setHours(0);
                current_date.setMinutes(0);
                current_date.setSeconds(0);
                current_date.setMilliseconds(0);

                scope.selctedDateString = (new Date(current_date)).toString();
                currentDate = angular.copy(current_date);

                var firstDay = new Date(current_date.getFullYear(), current_date.getMonth(), 1).getDate();
                var lastDay = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).getDate();

                scope.dayList = [];

                for (var i = firstDay; i <= lastDay; i++) {
                    var tempDate = new Date(current_date.getFullYear(), current_date.getMonth(), i);
                    scope.dayList.push({
                        date: tempDate.getDate(),
                        month: tempDate.getMonth(),
                        year: tempDate.getFullYear(),
                        day: tempDate.getDay(),
                        dateString: tempDate.toString(),
                        epochLocal: tempDate.getTime(),
                        epochUTC: (tempDate.getTime() + (tempDate.getTimezoneOffset() * 60 * 1000))
                    });
                }

                var firstDay = scope.dayList[0].day;

                scope.currentMonthFirstDayEpoch = scope.dayList[0].epochLocal;

                for (var j = 0; j < firstDay; j++) {
                    scope.dayList.unshift({});
                }

                scope.rows = [];
                scope.cols = [];

                scope.currentMonth = monthsList[current_date.getMonth()];
                scope.currentYear = current_date.getFullYear();

                scope.numColumns = 7;
                scope.rows.length = 6;
                scope.cols.length = scope.numColumns;
            };

            scope.monthChanged = function (month) {
                var monthNumber = scope.monthsList.indexOf(month);
                currentDate.setMonth(monthNumber);
                refreshDateList(currentDate)
            };

            scope.yearChanged = function (year) {
                currentDate.setFullYear(year);
                refreshDateList(currentDate)
            };

            scope.prevMonth = function () {
                if (currentDate.getMonth() === 1) {
                    currentDate.setFullYear(currentDate.getFullYear());
                }
                currentDate.setMonth(currentDate.getMonth() - 1);

                scope.currentMonth = monthsList[currentDate.getMonth()];
                scope.currentYear = currentDate.getFullYear();

                refreshDateList(currentDate)
            };

            scope.nextMonth = function () {
                if (currentDate.getMonth() === 11) {
                    currentDate.setFullYear(currentDate.getFullYear());
                }
                currentDate.setMonth(currentDate.getMonth() + 1);

                scope.currentMonth = monthsList[currentDate.getMonth()];
                scope.currentYear = currentDate.getFullYear();

                refreshDateList(currentDate)
            };

            scope.date_selection = {selected: false, selectedDate: '', submitted: false};

            scope.dateSelected = function (date) {
                scope.selctedDateString = date.dateString;
                scope.date_selection.selected = true;
                scope.date_selection.selectedDate = new Date(date.dateString);
            };

            element.on("click", function () {
                if (!scope.ipDate) {
                    var defaultDate = new Date();
                    refreshDateList(defaultDate);
                } else {
                    refreshDateList(angular.copy(scope.ipDate));
                }

                var myPopup = $ionicPopup.show({
                    templateUrl: 'date-picker-modal.html',
                    title: '<strong>Select Date</strong>',
                    subTitle: '',
                    scope: scope,
                    buttons: [
                        {
                            text: 'Close',
                            onTap: function (e) {
                                scope.callback(undefined);
                            }
                        },
                        {
                            text: 'Set',
                            type: 'button-positive',
                            onTap: function (e) {
                                scope.date_selection.submitted = true;

                                if (scope.date_selection.selected === true) {
                                    scope.ipDate = angular.copy(scope.date_selection.selectedDate);
                                    scope.callback(scope.ipDate);
                                } else {
                                    e.preventDefault();
                                }
                            }
                        }
                    ]
                });
                scope.close = function(){
                    myPopup.close();
                }
            })
        }
    }
}]);