angular.module('app.controllers', [])
    .controller('AppCtrl', function ($rootScope,$scope, $window, apiEndpoint, $http,$location) {
        window.shareData = {
            "link": "http://weixin.leatop.com/leatop/wechat_b/",
            "img": "http://weixin.leatop.com/leatop/wechat_b/img/share-wx.png",
            "title": "叩叩智慧楼宇系统",
            "content": "欢迎体验全新的楼宇办公体验"
        };
        $scope.go = function ( path ) {
            $location.path( path );
        };
        $scope.goBackHistory = function(){
            $window.history.back();
        };
        if(!window || !window.weixinData || !window.weixinData.nickname){
            $location.path('/follow-visitor');
        }
    })
    .controller('LandingCtrl', function(userInfoService, $rootScope, $scope){
        if(!$rootScope.user){
            userInfoService.async().then(function(d) {
//                console.log($rootScope.user);
                if($rootScope.user.userRole == 1){
                    $scope.userLink = "#/user-center/landing-in";
                }
                else{
                    $scope.userLink = "#/user-center/visitor";
                }
            });
        }
    })
    .controller('UserCenterTabsCtrl', function(userInfoService, $rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http){
        $rootScope.isLanding = false;
        var getPassList = function(){
            $http.post(apiEndpoint + "pass-list", {'openId':$rootScope.user.openId}).
                success(function(data, status, headers, config) {
                    $scope.passList = data.data;

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

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if(toState.name == 'userCenter.tabs.visitor' || toState.name == 'userCenter.tabs.ongoing'){
                    if($rootScope.user){
                        getPassList();
                    }
                    else{
                        userInfoService.async().then(function(d) {
                            getPassList();
                        });
                    }
                }
            }
        );

        if($rootScope.user){
            getPassList();
        }
        else{
            userInfoService.async().then(function(d) {
                getPassList();
            });
        }
    })
    .controller('UserCenterCtrl', function (userInfoService, $rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http) {

        $rootScope.isLanding = true;
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if(toState.name == 'userCenter.landing-in'){
                    $rootScope.isLanding = true;
                }
                else{
                    setTimeout(function(){
                        $rootScope.isLanding = false;
                    }, 200);
                }
            }
        );

        var getPassList = function(){
            $http.post(apiEndpoint + "pass-list", {'openId':$rootScope.user.openId}).
                success(function(data, status, headers, config) {
                    if($rootScope.user.userRole == 2){
                        console.log(data.data);
                        $scope.passList = data.data;
                        if(data.data.length == 0){
                            $scope.firstPass = 0;
                        }
                        else{
                            $scope.firstPass = data.data[0];
                        }

                    }
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                });
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
                "userRole": 2,
                "openId": $rootScope.user.openId,  //来访者的openid
                "passId": $stateParams.id,
                "username": $scope.signUpForm.username.$modelValue, //来访者的全名
                "passNumber": $scope.signUpForm.passNumber.$modelValue,
                "mobile": $scope.signUpForm.mobile.$modelValue,
                "mobileValidate": $scope.signUpForm.mobileValidate.$modelValue,
                "passValFrom":$scope.card.passValFrom,
                "passValTo":$scope.card.passValTo
            };
            console.log(formData);

            if($scope.signUpForm.$valid){
                $http.post(apiEndpoint + "sign-up",
                        formData
                    ).
                    success(function(data, status, headers, config) {
                        console.log(data);
                        if(data.status != 1){
                            console.log(">> no 1");
                            console.log(data);
                            alert(data.statusMsg);
                        }
                        else if(data.status == 1){
                            console.log(">> 1");
                            console.log(data);
                            alert(data.statusMsg);
                            $location.path('/user-center/landing');
                        }
                        $location.path('/user-center/visitor');
                        setTimeout(function(){
                            location.reload();
                        }, 100);
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
                        console.log(data);
                        if(data.status != 1){
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
                "passCompany": $scope.signUpForm.passCompany.$modelValue
            };
            console.log(formData);

            if($scope.signUpForm.$valid){
                $http.post(apiEndpoint + "sign-up",
                        formData
                    ).
                    success(function(data, status, headers, config) {
                        if(data.status != 1){
                            alert(data.statusMsg);
                        }
                        else if(data.status == 1){
                            alert(data.statusMsg);
                            $location.path('/user-center/landing');
                        }
                        console.log(data);

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
                        $scope.cardStatus = data.statusMsg;
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
    .controller('QrCardUserCtrl', function ($timeout, userInfoService, $rootScope,$scope, $window, apiEndpoint, $http) {

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
    .controller('ManageUserCtrl', function ($state, $timeout, userInfoService, $rootScope,$scope, $window, apiEndpoint, $http,$stateParams) {
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
                        $state.go('userCenter.tabs.visitor');
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
                        $state.go('userCenter.tabs.visitor');
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


                    if(typeof wx != 'undefined'){
                        wx.checkJsApi({
                            jsApiList: [
                                'onMenuShareAppMessage'
                            ],
                            success: function (res) {
                                // alert(JSON.stringify(res));
                            }
                        });
                        wx.showAllNonBaseMenuItem();

                        wx.onMenuShareAppMessage({
                            title: $scope.card.passSender.name + "邀请你访问",
                            desc: $scope.card.passSender.name + "为您创建了访问请求，请点击填写资料获取您的门禁凭证",
                            link: "http://weixin.leatop.com/leatop/top/share-in.php?passid=" + $stateParams.id,
                            imgUrl: "http://weixin.leatop.com/leatop/wechat_b/img/share-wx.png"
                        });
                    }

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
    .controller('InvitationVisitorCtrl', function($scope, $rootScope){
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){

                if($rootScope.ionicDatepicker && $rootScope.ionicDatepicker.close){
                    $rootScope.ionicDatepicker.close();
                }
                if($rootScope.ionicTimepicker && $rootScope.ionicTimepicker.close){
                    $rootScope.ionicTimepicker.close();
                }
                if($rootScope.ionicTimepicker2 && $rootScope.ionicTimepicker2.close){
                    $rootScope.ionicTimepicker2.close();
                }
            });
    })
    .controller('SignupVisitorCtrl', function($scope, $rootScope){
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){

                if($rootScope.ionicDatepicker && $rootScope.ionicDatepicker.close){
                    $rootScope.ionicDatepicker.close();
                }
                if($rootScope.ionicTimepicker && $rootScope.ionicTimepicker.close){
                    $rootScope.ionicTimepicker.close();
                }
                if($rootScope.ionicTimepicker2 && $rootScope.ionicTimepicker2.close){
                    $rootScope.ionicTimepicker2.close();
                }
            });
    })
;