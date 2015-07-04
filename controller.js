angular.module('app.controllers', [])
    .controller('AppCtrl', function ($rootScope,$scope, $window, apiEndpoint, $http,$location) {
        window.shareData = {
            "link": "http://weixin.leatop.com/leatop/wechat_b/",
            "img": "http://weixin.leatop.com/leatop/wechat_b/img/share-wx.png",
            "title": "叩叩",
            "content": "",
            "pageUrl": "http://weixin.leatop.com/leatop/wechat_b/"
        };

        $scope.goBackHistory = function(){
            $window.history.back();
        };
//        var lastclear = localStorage.getItem('lastclear'),
//            time_now  = (new Date()).getTime();
//        // .getTime() returns milliseconds so 1000 * 60 * 60 * 24 = 24 days
//        if ((time_now - lastclear) > 1000 * 60 * 60 * 24) {
//            localStorage.clear();
//            localStorage.setItem('lastclear', time_now);
//        }
//
//        if (!$rootScope.user && localStorage.getItem('user')){
//            $rootScope.user = JSON.parse(localStorage.getItem('user'));
//        }
//        else
        if(window && window.weixinData && !window.weixinData.nickname){
            $location.path('/follow-visitor');
        }
    })
    .controller('UserCenterCtrl', function (userInfoService, $rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http, $location) {

        $scope.showOnPending = function(){

        }

        $scope.isLanding = false;
        var getPassList = function(){
            $http.post(apiEndpoint + "pass-list", {'openId':$rootScope.user.openId}).
                success(function(data, status, headers, config) {
                    if($rootScope.user.userRole == 2){
                        if(!data.data){
                            $location.path('/landing');
//                            $scope.isLanding = true;
                        }
                        else{
                            $scope.passList = data.data;
                            $location.path('/user-center/visitor');
                        }
                    }
                    else if($rootScope.user.userRole == 1){
                        if(!data.data){
                            $location.path('/user-center/landing');
//                            $scope.isLanding = true;
                        }
                        else{
                            $scope.passList = data.data;
                            $location.path('/user-center/tabs/ongoing');
                        }
                    }

                    console.log($scope.passList);
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
    .controller('SignUpFormCtrl', function ($location, userInfoService, $rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http, $timeout, $stateParams) {
        if(!$rootScope.user){
            userInfoService.async().then(function(d) {
                console.log('ok');
            });
        }

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

        $scope.submitVisitorInvitation = function(){
            var formData = {
                "openId": $rootScope.user.openId,  //来访者的openid
                "username": $scope.signUpForm.username.$modelValue, //来访者的全名
                "passNumber": $scope.signUpForm.passNumber.$modelValue,
                "mobile": $scope.signUpForm.mobile.$modelValue,
                "mobileValidate": $scope.signUpForm.mobile.$modelValue,
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

        $scope.submitInvitationForm = function(){
            var formData = {
                "openId": $rootScope.user.openId,  //被访者的openid
                "passValFrom": new Date($scope.currentDate).getTime() / 1000 + $scope.slots[0].epochTime,
                "passValTo": new Date($scope.currentDate).getTime() / 1000 + $scope.slots[1].epochTime
            };

            if($scope.invitationForm.$valid){
                $http.post(apiEndpoint + "pass-create",
                        formData
                    ).
                    success(function(data, status, headers, config) {
                        if(data.status == 0){
                            alert(data.statusMsg);
                        }
                        else if(data.status == 1){
                            alert(data.statusMsg);
                            var pass = data.data;
                            console.log(pass.passId);
                            $location.path('/invitation-user/' + pass.passId);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(status);
                    });
            }
        }

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
        $scope.submitSignUpUser = function(){
            var formData = {   "userRole": 1,
                "openId": $scope.signUpForm.openId.$modelValue,
                "mobile": $scope.signUpForm.mobile.$modelValue,
                "mobileValidate": $scope.signUpForm.mobileValidate.$modelValue,
                "username": $scope.signUpForm.username.$modelValue,
                "passCompany": $scope.signUpForm.passCompany.$modelValue,
                "cardId": $scope.signUpForm.cardId.$modelValue
            };
            console.log(formData);

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
    .controller('QrCardVisitorCtrl', function ($timeout,userInfoService, $rootScope,$scope, $window, apiEndpoint, $http,$stateParams) {
        var timer;

        var getQr = function(){
            var data = { "openId": $rootScope.user.openId,
                "passId": $stateParams.id
            };

            $http.post(apiEndpoint + "pass-code", data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                        $location.path('/landing');
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
            timer = $timeout(
                function() {
                    getQr();
                },
                15000
            );
        }

        if($rootScope.user){
            getQr();
        }
        else{
            userInfoService.async().then(function(d) {
                getQr();
            });
        }

        $scope.$on(
            "$destroy",
            function( event ) {
//                console.log('$destroy');
                $timeout.cancel( timer );

            }
        );
    })
    .controller('QrCardUserCtrl', function ($timeout, userInfoService, $rootScope,$scope, $window, apiEndpoint, $http,$stateParams) {

        var timer;

        var getQr = function(){
            var data = { "openId": $rootScope.user.openId};
            $http.post(apiEndpoint + "pass-code", data
                ).
                success(function(data, status, headers, config) {
//                    console.log(data);
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
            timer = $timeout(
                function() {
                    getQr();
                },
                15000
            );
        }

        if($rootScope.user){

            getQr();
        }
        else{
            userInfoService.async().then(function(d) {
                getQr();
            });
        }

        $scope.$on(
            "$destroy",
            function( event ) {
//                console.log('$destroy');
                $timeout.cancel( timer );

            }
        );
    })
    .controller('ManageUserCtrl', function ($timeout, userInfoService, $rootScope,$scope, $window, apiEndpoint, $http,$stateParams) {
        var getPass = function(){
            var data = {"passId": $stateParams.id};

            $http.post(apiEndpoint + "pass-code", data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                        $location.path('/landing');
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
            getPass();
        }
        else{
            userInfoService.async().then(function(d) {
                getPass();
            });
        }

        $scope.openPass = function(){
            var data = {
                "openId": $rootScope.user.openId,
                "passId": $stateParams.id
            };

            $http.post(apiEndpoint + "pass-open", data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                    }
                    else
                    {
                        alert(data.statusMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }

        $scope.closePass = function(){
            var data = {
                "openId": $rootScope.user.openId,
                "passId": $stateParams.id
            };

            $http.post(apiEndpoint + "pass-close", data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                    }
                    else
                    {
                        alert(data.statusMsg);
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }
    })
    .controller('InvitationUser', function ($timeout, userInfoService, $rootScope,$scope, $location, apiEndpoint, $http,$stateParams) {

        if(!$rootScope.user){
            userInfoService.async().then(function(d) {
                console.log('ok');
            });
        }

        var data = {"passId": $stateParams.id};

        $http.post(apiEndpoint + "pass-code", data)
            .success(function(data, status, headers, config) {
                if(data.status == 0){
                    alert(data.statusMsg);
                    $location.path('/landing');
                }
                else
                {
                    console.log(data.data);
                    $scope.card = data.data;

                    window.shareData = {
                        "link": "http://weixin.leatop.com/leatop/wechat_b/#/invitation-visitor-reply/" + $stateParams.id,
                        "img": "http://weixin.leatop.com/leatop/wechat_b/img/share-wx.png",
                        "title": "叩叩",
                        "content": "",
                        "pageUrl": "http://weixin.leatop.com/leatop/wechat_b/"
                    };
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });

        $scope.deletePass = function(){
            var data = {
                "openId": $rootScope.user.openId,
                "passId": $stateParams.id
            };

            $http.post(apiEndpoint + "pass-delete", data)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    if(data.status == 0){
                        alert(data.statusMsg);
                    }
                    else
                    {
                        alert(data.statusMsg);
                        $location.path('/user-center/tabs/ongoing');
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }

    })
    .controller('ReplyInvitationCtrl', function($scope, $stateParams, apiEndpoint, $http){
        var data = {"passId": $stateParams.id};

        $http.post(apiEndpoint + "pass-code", data)
            .success(function(data, status, headers, config) {
                if(data.status == 0){
                    alert(data.statusMsg);
                    $location.path('/landing');
                }
                else
                {
                    console.log(data.data);
                    $scope.card = data.data;
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });
    })
;