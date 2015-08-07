var app = angular.module("whenisrain", ['ngRoute', 'contenteditable', 'ngSilent']);
app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true)
    $locationProvider.hashPrefix("!");
    $routeProvider
        .when("/", {
            template: "",
            reloadOnSearch: false
        })
})
app.controller("MainController", function ($scope, $location, $timeout, $http, $route) {
    var urlToText = function(url){
        try{
            return url.trim().split("-").join(" ");
        }catch(e){return null;}
    }
    var replaceNbsp = function(text){
        try{
            return text.split("&nbsp;").join(" ");
        }catch(e){ return null;}
    }
    var textToUrl = function(text){
        try{
            return replaceNbsp(text).trim().split(" ").join("-")
        }catch(e){
            return null;
        }
    }
    if($location.search().q){
        var split = $location.search().q.split(" in ");
        if(split.length == 2){
            var what = split[0];
            var where = split[1];
            $location.search("q", null);
            $location.search("what", what);
            $location.search("where", where);
            $route.reload();
        }
    }
    $scope.c = {
        what: urlToText($location.search().what || ""),
        where: urlToText($location.search().where || ""),
        loading: false,
        result: ""
    }
    var searchPromise = null;
    var search = function(what, where){
        $scope.c.loading = true;
        $http.get("https://api.openweathermap.org/data/2.5/forecast/daily?q="+where+"&units=metric&cnt=14&APPID=7185a3dfa3a19ad2c1312d82482ddc82").success(function(result){
            what = what.split("sun").join("clear");
            var list = result.list;
            list = list.filter(function (item) {
                return item.weather.filter(function (weather) {
                        return weather.main.toLowerCase().indexOf(what.toLowerCase()) > -1;
                    }).length > 0;
            });
            if(list.length>0){
                var days = Math.ceil((list[0].dt - new Date().valueOf()/1000)/3600/24);
                $scope.c.result = days==0?"Probably today!" : "in up to " + days + " day" + (days == 1 ? "" : "s");
            }
            else{
                $scope.c.result = "No idea :(";
            }
            $scope.c.loading = false;
        }).error(function(result, status){
            $scope.c.loading = false;
            $scope.error = true;
            $scope.c.result = "An error has occured. Sorry :(";
            console.log("Error code: " + status);
        });
    };


    var requestSearch = function(){
        if(searchPromise!=null) $timeout.cancel(searchPromise);
        var what = replaceNbsp($scope.c.what).trim(), where = replaceNbsp($scope.c.where).trim();
        if(!what.length || !where.length){
            $scope.c.loading = false;
            $scope.c.result = "";
        }
        else{
            searchPromise = $timeout(function(){search(what,where)}, 500);
            $scope.error = false;
        }
    }
    $scope.$watch("c.what", function (what) {
        $location.search("what", textToUrl(what) || null);
        requestSearch();
    })
    $scope.$watch("c.where", function (where) {
        $location.search("where", textToUrl(where) || null);
        requestSearch();
    })
})
