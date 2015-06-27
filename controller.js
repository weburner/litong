angular.module('app.controllers', [])
    .controller('AppCtrl', function ($scope, $window) {
        $scope.goBackHistory = function(){
            console.log('hi');
            $window.history.back();

        }
    })
    .controller('UserCenterCtrl', function ($scope, $ionicScrollDelegate) {
        setTimeout(function(){
            $scope.onTabSelected = function(){
                $ionicScrollDelegate.$getByHandle('tab-1-content').scrollTop(true);
                $ionicScrollDelegate.$getByHandle('tab-2-content').scrollTop(true);
            }
        }, 100);
    })
;