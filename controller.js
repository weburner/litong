angular.module('app.controllers', [])
    .controller('AppCtrl', function ($rootScope,$scope, $window, apiEndpoint, $http,$location) {
        $scope.goBackHistory = function(){
            $window.history.back();
        };

        $scope.registerData={};

        if (!$rootScope.user && localStorage.getItem('user')){
            $rootScope.user = JSON.parse(localStorage.getItem('user'));
        }
        else if(window.weixinData.nickname != undefined){
            $location.path('/follow-visitor');
        }
        else{
            $http.post(apiEndpoint + "check-user", {'openId':"o8oequNQO2lNdN4LSVcem4VH3uRc"}).
                success(function(data, status, headers, config) {
                    if(data.status == 1){
                        localStorage.setItem('user', JSON.stringify(data.data));
                        $rootScope.user = data.data;
                    }
                    else if(data.status == 0){
                        alert("用户已关闭，请联系管理员！")
                    }
                    else if(data.status == 2){
                        $rootScope.user = data.data;
                        $location.path('/verifying-user');
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log(status);
                });
        }
    })
    .controller('UserCenterCtrl', function ($rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http, $location) {
        $http.post(apiEndpoint + "pass-list", {'openId':$rootScope.user.openId}).
            success(function(data, status, headers, config) {
                if(!data.data){
                    $location.path('/user-center/landing');
                }
                else{
                    $scope.passList = data.data;
                    $location.path('/user-center/tabs/ongoing');
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
    })
    .controller('FormCtrl', function ($rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http) {
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
                console.log($rootScope.companyList);

            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(status);
            });

        $scope.submitForm = function(){
            console.log('hi');
            console.log($scope.callbackValueModel);
        }


        $scope.submitFormSignupVisitor = function(){

        }
        $scope.senderID = "";

        $scope.changedValue=function(item){
            $http.post(apiEndpoint + "member-list", {'companyId':item}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.people = data.data;
                    console.log($scope.people);



                    $scope.getTestItems = function (query) {

                        var searchItems = data.data;
                        var returnValue = { items: [] };
                        searchItems.forEach(function(item){
                            if (item.name.indexOf(query) > -1 ){
                                returnValue.items.push(item);
                            }
                        });
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
;