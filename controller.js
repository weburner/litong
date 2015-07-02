angular.module('app.controllers', [])
    .controller('AppCtrl', function ($rootScope,$scope, $window, apiEndpoint, $http,$location) {
        $scope.goBackHistory = function(){
            $window.history.back();
        };
        if (!$rootScope.user && localStorage.getItem('user')){
            $rootScope.user = JSON.parse(localStorage.getItem('user'));
        }
        else if(window && window.weixinData && window.weixinData.nickname != undefined){
            $location.path('/follow-visitor');
        }
    })
    .controller('UserCenterCtrl', function (userInfoService, $rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http, $location) {
        var getPassList = function(){
            $http.post(apiEndpoint + "pass-list", {'openId':$rootScope.user.openId}).
                success(function(data, status, headers, config) {
                    console.log(data.data);
                    if($rootScope.user.userRole == 2){
                        if(!data.data){
                            $location.path('/user-center/landing');
                        }
                        else{
                            $scope.passList = data.data;
                            console.log($scope.passList);
                            $location.path('/user-center/visitor');
                        }
                    }
                    else{
                        if(!data.data){
                            $location.path('/user-center/landing');
                        }
                        else{
                            $scope.passList = data.data;
                            $location.path('/user-center/tabs/ongoing');
                        }
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                });

            setTimeout(function(){
                $scope.onTabSelected = function(){
                    $ionicScrollDelegate.$getByHandle('tab-1-content').scrollTop(true);
                    $ionicScrollDelegate.$getByHandle('tab-2-content').scrollTop(true);
                }
            }, 100);
        }

        if($rootScope.user){
            getPassList();
        }
        else{
            userInfoService.async().then(function(d) {
                getPassList();
            });
        }
    })
    .controller('SignUpFormCtrl', function ($rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http, $timeout) {
        var d = new Date();
        d.setHours(0,0,0,0); // last midnight
        $scope.currentDate = d;

        $scope.datePickerCallback = function (val) {
            if(typeof(val)==='undefined'){
                console.log('Date not selected');
            }else{
                console.log(val);
            }
        };

        $scope.slots = [
            {epochTime: 28800, step: 15, format: 24},
            {epochTime: 32400, step: 15, format: 24}
        ];

        $scope.timePickerFromCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                console.log('Selected time is : ', val);
            }
        };
        $scope.timePickerToCallback = function (val) {
            if (typeof (val) === 'undefined') {
                console.log('Time not selected');
            } else {
                console.log('Selected time is : ', val);
            }
        };

        $scope.counter = 60;
        var stopped;
        $scope.countdown = function() {
            if($scope.counter >= 0){
                stopped = $timeout(function() {
                    $scope.counter--;
                    $scope.countdown();
                }, 1000);
            }
            else{
                $timeout.cancel(stopped);
                $scope.counter = 60;
            }
        };

        $http.post(apiEndpoint + "company-list").
            success(function(data, status, headers, config) {
                var floors = [];
                var floorsNum;
                for(var item in data.data){
                    if(floorsNum != data.data[item].floor){
                        floors.push({"floor":data.data[item].floor, "companyList":[{"name":data.data[item].name, "id":data.data[item].id}] });
                    }
                    else
                    {
                        for(var floor in floors){
                            if(floors[floor]["floor"] == data.data[item].floor){
                                floors[floor]["companyList"].push({"name":data.data[item].name, "id":data.data[item].id});
                            }
                        }
                    }
                    floorsNum = data.data[item].floor;
                }
                $rootScope.companyList = floors;
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });

        $scope.submitSignUpVisitor = function(){
            var formData = {   "userRole": 2,
                "openId": $scope.signUpForm.openId.$modelValue, //来访者的openid
                "memberid": $scope.callbackValueModel,  //被访者的openid
                "mobile": $scope.signUpForm.mobile.$modelValue,
                "mobileValidate": $scope.signUpForm.mobileValidate.$modelValue,
                "username": $scope.signUpForm.username.$modelValue, //来访者的全名
                "passValFrom": new Date($scope.currentDate).getTime() / 1000 + $scope.slots[0].epochTime,
                "passValTo": new Date($scope.currentDate).getTime() / 1000 + $scope.slots[1].epochTime,
                "passCompany": $scope.signUpForm.passCompany.$modelValue, //被访公司的ID非公司名称
                "passNumber": $scope.signUpForm.passNumber.$modelValue
            };

            if($scope.signUpForm.$valid){
                $http.post(apiEndpoint + "sign-up",
                        formData
                    ).
                    success(function(data, status, headers, config) {
                        if(data.status == 0){
                            alert(data.statusMsg);
                        }
                        else if(data.status == 1){

                            alert(data.statusMsg);
                            $window.history.back();
                        }
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(status);
                    });
            }
        }
        $scope.submitSignUpUser = function(){
            var formData = {   "userRole": 1,
                "openId": $scope.signUpForm.openId.$modelValue,
                "mobile": $scope.signUpForm.mobile.$modelValue,
                "mobileValidate": $scope.signUpForm.mobileValidate.$modelValue,
                "username": $scope.signUpForm.username.$modelValue,
                "passCompany": $scope.signUpForm.passCompany.$modelValue,
                "cardId": $scope.signUpForm.cardId.$modelValue
            };
//            console.log(formData);

            if($scope.signUpForm.$valid){
                $http.post(apiEndpoint + "sign-up",
                        formData
                    ).
                    success(function(data, status, headers, config) {
                        if(data.status == 0){
                            alert(data.statusMsg);
                        }
                        else if(data.status == 1){
                            alert(data.statusMsg);
                            $location.path('/user-center/landing');
                        }

                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(status);
                    });
            }
        }
        $scope.mobileCheck = function(){
            $scope.countdown();
            if($scope.signUpForm.mobile){
                $http.post(apiEndpoint + "mobile-validate", {'mobile':$scope.signUpForm.mobile.$modelValue}).
                    success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        alert(data.statusMsg);

                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(status);
                    });
            }
        }

        $scope.changedValue=function(item){
            $scope.companyId = item;
            $http.post(apiEndpoint + "member-list", {'companyId':item}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.people = data.data;

                    $scope.getTestItems = function (query) {

                        var searchItems = data.data;
                        var returnValue = { items: [] };
                        searchItems.forEach(function(item){
                            if (item.name.indexOf(query) > -1 ){
                                returnValue.items.push(item);
                            }
                        });
                        console.log(returnValue);
                        return returnValue;
                    };
                    $scope.itemsClicked = function (callback) {
                        $scope.callbackValueModel = callback.item.openId;
                    }

                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }

    })
    .controller('QrCardVisitorCtrl', function (userInfoService, $rootScope,$scope, $window, apiEndpoint, $http,$stateParams) {

        var getQr = function(){
            var data = { "openId": $rootScope.user.openId,
                "passId": $stateParams.id
            };

            $http.post(apiEndpoint + "pass-code", data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                    }
                    else
                    {
                        $scope.card = data.data;
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }

        if($rootScope.user){
            getQr();
        }
        else{
            userInfoService.async().then(function(d) {
                getQr();
            });
        }
    })
    .controller('QrCardUserCtrl', function (userInfoService, $rootScope,$scope, $window, apiEndpoint, $http,$stateParams) {

        var getQr = function(){
            var data = { "openId": $rootScope.user.openId};

            $http.post(apiEndpoint + "pass-code", data
                ).
                success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                    }
                    else
                    {
                        $scope.card = data.data;
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }

        if($rootScope.user){
            getQr();
        }
        else{
            userInfoService.async().then(function(d) {
                getQr();
            });
        }



    })
;