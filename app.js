angular.module('app', ['ionic','app.controllers','app.services','ion-autocomplete','ionic-datepicker','ionic-timepicker'])
    .constant('apiEndpoint', 'http://weixin.leatop.com/leatop/jsapi/')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'template/landing.html'
            })
            .state('signupVisitor', {
                url: '/signup-visitor',
                templateUrl: 'template/signup-visitor.html'
            })
            .state('signupUser', {
                url: '/signup-user',
                templateUrl: 'template/signup-user.html'
            })
            .state('userCenter', {
                url: '/user-center',
                templateUrl: 'template/user-center.html',
                abstract : true,
                controller: 'UserCenterCtrl'
            })
            .state('userCenter.landing', {
                url: "/landing",
                views: {
                    'user-center': {
                        templateUrl: "template/user-center-landing.html"
                    }
                }
            })
            .state('invitationVisitor', {
                url: '/invitation-visitor',
                templateUrl: 'template/invitation-form.html'
            })
            .state('userCenter.tabs', {
                url: '/tabs',
                abstract : true,
                views: {
                    'user-center': {
                        templateUrl: 'template/user-center-tabs.html'
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
            .state('userCenter.visitor', {
                url: "/visitor",
                views: {
                    'user-center': {
                        templateUrl: "template/visitor-center.html"
                    }
                }
            })
            .state('verifyingUser', {
                url: '/verifying-user',
                templateUrl: 'template/verifying-user.html'
            })
            .state('manageUser', {
                url: '/manage-user',
                templateUrl: 'template/manage-user.html'
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
                templateUrl: 'template/qr-card-user.html',
                controller: 'QrCardUserCtrl'
            })
            .state('qrCardVisitor', {
                url: '/qr-card-visitor/:id',
                templateUrl: 'template/qr-card-visitor.html',
                controller: 'QrCardVisitorCtrl'
            })
        ;

        $urlRouterProvider.otherwise('/user-center/landing');
    })
    .directive('headerShrink', function ($document) {
        var fadeAmt;

        var shrink = function (header, content, amt, max) {
            amt = Math.min(161, amt);
            fadeAmt = 1 - amt / 161;
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
    .directive('headerShrinkVisitorCenter', function ($document) {
        var fadeAmt;

        var shrink = function (header, content, amt, max) {
            amt = Math.min(161, amt);
            fadeAmt = 1 - amt / 161;
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

                var header = $document[0].body.querySelector('.user-center-header');
                console.log($document[0].body);
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
            amt = Math.min(205, amt);
            fadeAmt = 1 - amt / 205;
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
    .directive('standardTimeNoMeridian', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                etime: '=etime'
            },
            template: "<span>{{stime}}</span>",
            link: function (scope, elem, attrs) {

                scope.stime = epochParser(scope.etime, 'time');

                function prependZero(param) {
                    if (String(param).length < 2) {
                        return "0" + String(param);
                    }
                    return param;
                }

                function epochParser(val, opType) {
                    if (val === null) {
                        return "00:00";
                    } else {
                        if (opType === 'time') {
                            var hours = parseInt(val / 3600);
                            var minutes = (val / 60) % 60;

                            return (prependZero(hours) + ":" + prependZero(minutes));
                        }
                    }
                }

                scope.$watch('etime', function (newValue, oldValue) {
                    scope.stime = epochParser(scope.etime, 'time');
                });

            }
        };
    })
;