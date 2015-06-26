angular.module('app', ['ionic'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'template/landing.html'
            })
            .state('signupVisiter', {
                url: '/signup-visiter',
                templateUrl: 'template/signup-visiter.html'
            })

            .state('signupUser', {
                url: '/signup-user',
                templateUrl: 'template/signup-user.html'
            })
            .state('userCenter', {
                url: '/user-center',
                templateUrl: 'template/user-center.html',
                abstract : true
            })
            .state('userCenter.landing', {
                url: "/landing",
                views: {
                    'user-center': {
                        templateUrl: "template/user-center-landing.html"
                    }
                }
            })
            .state('userCenter.tabs', {
                url: '/tabs',
                abstract : true,
                views: {
                    'user-center': {
                        templateUrl: 'template/user-center-tabs.html',
                        controller:'UserCenterCtrl'
                    }
                }
            })
            .state('userCenter.tabs.ongoing', {
                url: "/ongoing",
                views: {
                    'ongoing-tab': {
                        templateUrl: "template/user-center-ongoing.html"
                    }
                }
            })
            .state('userCenter.tabs.visitor', {
                url: "/visitor",
                views: {
                    'visitor-tab': {
                        templateUrl: "template/user-center-visitor.html"
                    }
                }
            })
            .state('verifyingUser', {
                url: '/verifying-user',
                templateUrl: 'template/verifying-user.html'
            })
            .state('manageUser', {
                url: '/manage-user',
                templateUrl: 'template/manage-user.html',
                controller:'AppCtrl'
            })
            .state('invitationUser', {
                url: '/invitation-user',
                templateUrl: 'template/invitation-user.html'
            })
            .state('followVisitor', {
                url: '/follow-visitor',
                templateUrl: 'template/follow-visitor.html'
            })
            .state('verifyingVisitor', {
                url: '/verifying-visitor',
                templateUrl: 'template/verifying-visitor.html'
            })
            .state('qrCardUser', {
                url: '/qr-card-user',
                templateUrl: 'template/qr-card-user.html'
            })
            .state('qrCardVisitor', {
                url: '/qr-card-visitor',
                templateUrl: 'template/qr-card-visitor.html'
            })
        ;

        // if none of the above states are matched, use this as the fallback

        $urlRouterProvider.otherwise('/user-center/tabs/ongoing');


    })
    .directive('headerShrink', function ($document) {
        var fadeAmt;

        var shrink = function (header, content, amt, max) {
            amt = Math.min(176, amt);
            fadeAmt = 1 - amt / 176;
            ionic.requestAnimationFrame(function () {
                header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
                header.children[0].style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + amt + 'px, 0)';
                for (var i = 0, j = header.children.length; i < j; i++) {
                    if(i != 0){
                        header.children[i].style.opacity = fadeAmt;
                    }

                }
            });
        };

        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var starty = $scope.$eval($attr.headerShrink) || 0;
                var shrinkAmt;

                var header = $document[0].body.querySelector('.header-shrink-bar-header');
                var headerHeight = header.offsetHeight;

                $element.bind('scroll', function (e) {
                    if (e.detail.scrollTop > starty) {
                        // Start shrinking
                        shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - e.detail.scrollTop);
                        shrink(header, $element[0], shrinkAmt, headerHeight);
                    } else {
                        shrink(header, $element[0], 0, headerHeight);
                    }
                });
            }
        };
    })
    .directive('headerShrinkButtonGroup', function ($document) {
        var fadeAmt;

        var shrink = function (header, content, amt, max) {
            amt = Math.min(220, amt);
            fadeAmt = 1 - amt / 220;
            var tabs = $document[0].body.querySelector('.tab-nav');
            ionic.requestAnimationFrame(function () {
                header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
                tabs.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
                for (var i = 0, j = header.children.length; i < j; i++) {
                    if(i != 1){
                        header.children[i].style.opacity = fadeAmt;
                    }

                }
            });
        };

        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                var starty = $scope.$eval($attr.headerShrink) || 0;
                var shrinkAmt;

                var header = $document[0].body.querySelector('.user-center-header');
                var headerHeight = header.offsetHeight;

                $element.bind('scroll', function (e) {
                    if (e.detail.scrollTop > starty) {
                        // Start shrinking
                        shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - e.detail.scrollTop);
                        shrink(header, $element[0], shrinkAmt, headerHeight);
                    } else {
                        shrink(header, $element[0], 0, headerHeight);
                    }
                });
            }
        };
    })
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