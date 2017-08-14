'use strict';

angular.module('originrecipApp')
//local
.constant("baseURL", "http://localhost:3000/")
//en ligne
//.constant("baseURL", "https://veganrecipe.herokuapp.com/")


    /* 
* Recipes Factory
*/
    .factory('recipesFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "recipes/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
 }]) //end



/**
 * Comments factory
 */
    .factory('commentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            return $resource(baseURL + "recipes/:id/comments/:commentId", {id:"@Id", commentId: "@CommentId"}, {
                'update': {
                    method: 'PUT'
                }
            });
    }])


/* Edit Recipes Factory
*/
    .factory('editFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
        return $resource(baseURL + "recipes/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
}])

/**
 * STORE service
 */
    .service('Map', function($q) {
       
        this.init = function() {
            var options = {
                center: new google.maps.LatLng(40.7127837, -74.00594130000002),
                zoom: 13,
                disableDefaultUI: true    
            }
            this.map = new google.maps.Map(
                document.getElementById("map"), options
            );
            this.places = new google.maps.places.PlacesService(this.map);
            
        }
        
        this.search = function(str) {
            //var status ="";
            var d = $q.defer();
            this.places.textSearch({query: str}, function(results, status) {
                if (status == 'OK') {
                    /*
                    for (var i= 0; i <results.length ; i++){
                         d.resolve(results[i]);
                    }
                        */
                    d.resolve(results[0]);//[0]
                    console.log(results[0]);
                    
                }
                else d.reject(status);
            });
            return d.promise;
        }
        
        this.addMarker = function(res) {
            if(this.marker) this.marker.setMap(null);
            this.marker = new google.maps.Marker({
                map: this.map,
                position: res.geometry.location,
                animation: google.maps.Animation.DROP
            });
            this.map.setCenter(res.geometry.location);
        }
        
    })

/**
*  Favorite  factory
*/

.factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {


    return $resource(baseURL + "favorites/:id", null, {
            'update': {
                method: 'PUT'
            },
            'query':  {method:'GET', isArray:false}
        });

}])

/* 
* LocalStorage users/
*/
    .factory('$localStorage', ['$window', function ($window) {
            return {
                store: function (key, value) {
                    $window.localStorage[key] = value;
                },
                get: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                remove: function (key) {
                    $window.localStorage.removeItem(key);
                },
                storeObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function (key, defaultValue) {
                    return JSON.parse($window.localStorage[key] || defaultValue);
                }
            };
    }])

/* 
* login users/
*/

    .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
        
        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;
        

    function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
        if (credentials.username !== undefined) {
        useCredentials(credentials);
        }
    }
    
    function storeUserCredentials(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    }
    //creation object
    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
    
        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
    }
    
    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    }
        //begin 
        authFac.login = function(loginData) {
            
            $resource(baseURL + "users/login")
            .save(loginData,
            function(response) {
                storeUserCredentials({username:loginData.username, token: response.token});
                $rootScope.$broadcast('login:Successful');
            },
            function(response){
                isAuthenticated = false;
                
                var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Login Unsuccessful</h3></div>' +
                    '<div><p>' +  response.data.err.message + '</p><p>' +
                        response.data.err.name + '</p></div>' +
                    '<div class="ngdialog-buttons">\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                    </div>'
                
                    ngDialog.openConfirm({ template: message, plain: 'true'});
            }
            
            );

        };
        
        authFac.logout = function() {
            $resource(baseURL + "users/logout").get(function(response){
            });
            destroyUserCredentials();
        };
        
        authFac.register = function(registerData) {
            
            $resource(baseURL + "users/register")
            .save(registerData,
            function(response) {
                authFac.login({username:registerData.username, password:registerData.password});
                if (registerData.rememberMe) {
                    $localStorage.storeObject('userinfo',
                        {username:registerData.username, password:registerData.password});
                }
            
                $rootScope.$broadcast('registration:Successful');
            },
            function(response){
                
                var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Registration Unsuccessful</h3></div>' +
                    '<div><p>' +  response.data.err.message + 
                    '</p><p>' + response.data.err.name + '</p></div>';

                    ngDialog.openConfirm({ template: message, plain: 'true'});

            }
            
            );
        };
    
        //helper function
        authFac.isAuthenticated = function() {
            return isAuthenticated;
        };
        
        authFac.getUsername = function() {
            return username;  
        };
    //retrieve info refresh token to storage
        loadUserCredentials();
        
        return authFac;
        
    }])


.factory('Recipe',function($resource, baseURL){
    return $resource(baseURL + "recipes/:id", {id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
})



; //endServices
