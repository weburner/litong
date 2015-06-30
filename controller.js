angular.module('app.controllers', [])
    .controller('AppCtrl', function ($rootScope,$scope, $window, apiEndpoint, $http,$location) {
        $scope.goBackHistory = function(){
            $window.history.back();
        };

        var user = localStorage.getItem('user');
        if(user && !$rootScope.user){
            $rootScope.user = JSON.parse(user);
            console.log($rootScope.user);
//            $location.path('/user-center/tabs/ongoing');
        }
        else{
            $http.post(apiEndpoint + "check-user", {'openId':'o8oequOpYwsRs7Gq2fFxZJUDvzs8'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
//                    console.log(data);
                    localStorage.setItem('user', JSON.stringify(data.data));
                    $location.path('/user-center/tabs/ongoing');
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }
    })
    .controller('UserCenterCtrl', function ($rootScope, $scope, $ionicScrollDelegate, apiEndpoint, $http, $location) {
        $http.post(apiEndpoint + "pass-list", {'openId':$rootScope.user.openId}).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                    console.log(data);
                if(!data.data){
                    $location.path('/user-center/landing');
                }
                else{
                    $scope.passList = data.data;
                }
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
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
                // this callback will be called asynchronously
                // when the response is available
//                    console.log(data);
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