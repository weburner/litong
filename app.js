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
                templateUrl: 'template/user-center.html'
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
            .state('qrCard', {
                url: '/qr-card',
                templateUrl: 'template/qr-card.html'
            })
        ;

        // if none of the above states are matched, use this as the fallback

        $urlRouterProvider.otherwise('/landing');


    })
    .directive('headerShrink', function ($document) {
        var fadeAmt;

        var shrink = function (header, content, amt, max) {
            amt = Math.min(220, amt);
            fadeAmt = 1 - amt / 220;
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

                var header = $document[0].body.querySelector('.bar-header');
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
    });