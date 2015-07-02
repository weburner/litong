angular.module('app.services', [])
    .factory('userInfoService', function ($http, $rootScope, apiEndpoint, $location) {
        var userInfoService = {
            async: function() {
                // $http returns a promise, which has a then function, which also returns a promise
                var promise = $http.post(apiEndpoint + "check-user", {'openId':"o8oequOpYwsRs7Gq2fFxZJUDvzs8"}).
                    success(function(data, status, headers, config) {
                        if(data.status == 1){
                            localStorage.setItem('user', JSON.stringify(data.data));
                            $rootScope.user = data.data;
                        }
                        else if(data.status == 0){
                            alert("用户已关闭，请联系管理员！");
                            $location.path('/landing');
                        }
                        else if(data.status == 2){
                            $rootScope.user = data.data;
                            $location.path('/verifying-user');
                        }
                    }).
                    error(function(data, status, headers, config) {
                        console.log(status);
                    });

                return promise;
            }
        };
        return userInfoService;
    });
