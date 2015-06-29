angular.module('app.services', []).factory('loaderService', function ($ionicLoading) {
    // Might use a resource here that returns a JSON array

    var loadingIndicator = {};
    return {
        show: function () {
            loadingIndicator = $ionicLoading.show({
                content: '<li class="ion-loading-c" data-pack="default" data-tags="reload, renew, animation" data-animation="true"></li>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 100
            });
        },
        hide: function (petId) {
            // Simple index lookup
            loadingIndicator.hide();
        }
    }
});


angular.module('app.services').factory('httpCache', function ($cacheFactory) {
    return $cacheFactory('httpCache');
});


angular.module('app.services').factory('lazyHttp', function ($http, httpCache, loaderService, $q, $ionicLoading) {
    return {
        get: function (endpoint, withLoader) {
            var cacheKey = endpoint;
            var defer = $q.defer();

            var cache = httpCache.get(cacheKey);
            if (cache) {
                defer.resolve(cache);
            } else {
                if (withLoader) {
                    loaderService.show();
                }
                $http.get(endpoint).success(function (results) {
                    if (withLoader) {
                        $ionicLoading.hide();
                    }
                    defer.resolve(results);
                    httpCache.put(cacheKey, results);

                }).error(function (err) {
                        defer.reject(err);
                        if (withLoader) {
                            $ionicLoading.hide();
                        }
                    })

            }

            return defer.promise;

        }
    }
});
