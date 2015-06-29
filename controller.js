angular.module('app.controllers', [])
    .controller('AppCtrl', function ($rootScope,$scope, $window, apiEndpoint, $http,$location) {
        $scope.goBackHistory = function(){
            $window.history.back();
        };

        var user = localStorage.getItem('user');
        if(user && !$rootScope.user){
            $rootScope.user = JSON.parse(user);
            console.log($rootScope.user);
            $location.path('/user-center/tabs/ongoing');
        }
        else{
            $http.post(apiEndpoint + "check-user", {'openId':'o8oequHSDFCXk7PUB7dY6lxey0no'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
//                    console.log(data);
                    localStorage.setItem('user', JSON.stringify(data.data));
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

        $scope.changedValue=function(item){
            $http.post(apiEndpoint + "member-list", {'companyId':item}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.people = data.data;
                    console.log($scope.people);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log(status);
                });
        }

    })
;