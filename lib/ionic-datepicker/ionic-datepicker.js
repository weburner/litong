"use strict";
var app = angular.module("ionic-datepicker", ["ionic", "ionic-datepicker.templates"]);
app.service("DatepickerService", function () {
    this.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], this.yearsList = [2015, 2016, 2017, 2018, 2019, 2020]
}), app.directive("ionicDatepicker", ["$ionicPopup", "DatepickerService", function (e, t) {
    return{restrict: "AE", replace: !0, scope: {ipDate: "=idate", disablePreviousDates: "=disablepreviousdates", callback: "=callback"}, link: function (a, n) {
        var o = t.monthsList;
        a.monthsList = o, a.yearsList = t.yearsList, a.currentMonth = "", a.currentYear = "", a.ipDate || (a.ipDate = new Date), a.previousDayEpoch = +new Date - 864e5;
        var r = angular.copy(a.ipDate);
        r.setHours(0), r.setMinutes(0), r.setSeconds(0), r.setMilliseconds(0), a.selctedDateString = r.toString(), a.weekNames = ["S", "M", "T", "W", "T", "F", "S"], a.today = {};
        var i = new Date, s = new Date(i.getFullYear(), i.getMonth(), i.getDate());
        a.today = {dateObj: i, date: s.getDate(), month: s.getMonth(), year: s.getFullYear(), day: s.getDay(), dateString: s.toString(), epochLocal: s.getTime(), epochUTC: s.getTime() + 60 * s.getTimezoneOffset() * 1e3};
        var c = function (e) {
            e.setHours(0), e.setMinutes(0), e.setSeconds(0), e.setMilliseconds(0), a.selctedDateString = new Date(e).toString(), r = angular.copy(e);
            var t = new Date(e.getFullYear(), e.getMonth(), 1).getDate(), n = new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate();
            a.dayList = [];
            for (var i = t; n >= i; i++) {
                var s = new Date(e.getFullYear(), e.getMonth(), i);
                a.dayList.push({date: s.getDate(), month: s.getMonth(), year: s.getFullYear(), day: s.getDay(), dateString: s.toString(), epochLocal: s.getTime(), epochUTC: s.getTime() + 60 * s.getTimezoneOffset() * 1e3})
            }
            var t = a.dayList[0].day;
            a.currentMonthFirstDayEpoch = a.dayList[0].epochLocal;
            for (var c = 0; t > c; c++)a.dayList.unshift({});
            a.rows = [], a.cols = [], a.currentMonth = o[e.getMonth()], a.currentYear = e.getFullYear(), a.numColumns = 7, a.rows.length = 6, a.cols.length = a.numColumns
        };
        a.monthChanged = function (e) {
            var t = a.monthsList.indexOf(e);
            r.setMonth(t), c(r)
        }, a.yearChanged = function (e) {
            r.setFullYear(e), c(r)
        }, a.prevMonth = function () {
            1 === r.getMonth() && r.setFullYear(r.getFullYear()), r.setMonth(r.getMonth() - 1), a.currentMonth = o[r.getMonth()], a.currentYear = r.getFullYear(), c(r)
        }, a.nextMonth = function () {
            11 === r.getMonth() && r.setFullYear(r.getFullYear()), r.setMonth(r.getMonth() + 1), a.currentMonth = o[r.getMonth()], a.currentYear = r.getFullYear(), c(r)
        }, a.date_selection = {selected: !1, selectedDate: "", submitted: !1}, a.dateSelected = function (e) {
            a.selctedDateString = e.dateString, a.date_selection.selected = !0, a.date_selection.selectedDate = new Date(e.dateString)
        }, n.on("click", function () {
            if (a.ipDate)c(angular.copy(a.ipDate)); else {
                var t = new Date;
                c(t)
            }
            e.show({templateUrl: "date-picker-modal.html", title: "<strong>选择日期</strong>", subTitle: "", scope: a, buttons: [
                {text: "Close", onTap: function () {
                    a.callback(void 0)
                }},
                {text: "Set", type: "button-positive", onTap: function (e) {
                    a.date_selection.submitted = !0, a.date_selection.selected === !0 ? (a.ipDate = angular.copy(a.date_selection.selectedDate), a.callback(a.ipDate)) : e.preventDefault()
                }}
            ]})
        })
    }}
}]);