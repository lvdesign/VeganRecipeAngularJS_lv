'use strict';

angular.module('originrecipApp')

/* 
* Home Controller
*/
    .controller('HomeController', ['$scope', 'recipesFactory', function ($scope, recipesFactory ) {

        $scope.showHome = false;
        $scope.messageHome = "LoaDING....";

        $scope.recipe = recipesFactory.query({
                featured:"true"
            })
            .$promise.then(
                function (response) {
                    var recipes = response;
                    $scope.recipe = recipes[0];
                    $scope.showHome = true;
                },
                function (response) {
                    $scope.messageHome = "Error show Home : " + response.status + " " + response.statusText;
                }
            );
     }])

/* 
* Recipes  Controller
*/
    .controller('RecipesController', ['$scope', 'recipesFactory', 'favoriteFactory', function ($scope, recipesFactory, favoriteFactory) {
        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showRecipes = false;
        $scope.showFavorites = true;
        $scope.messageRecipes = "Loading...";

       
        recipesFactory.query(
            function (response) {
                $scope.recipes = response;
                $scope.showRecipes = true;
            },
            function (response) {
                $scope.messageRecipes = "Error Recipes: " + response.status + " " + response.statusText;
            });
        
        $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
            
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else if (setTab === 5) {
            $scope.filtText = "drinks";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

   $scope.addToFavorites = function(recipeid) {
        console.log('Add to favorites', recipeid);
        favoriteFactory.save({_id: recipeid});
        $scope.showFavorites = !$scope.showFavorites;
    };

    
}])

/* 
* Recipes Details Controller
*/
    .controller('RecipesDetailsController', ['$scope', '$state', '$stateParams', 'recipesFactory', 'commentFactory', function ($scope, $state, $stateParams, recipesFactory,commentFactory) {

        $scope.recipe = {};
        $scope.showRecipeDetails = false;
        $scope.messageRecipeDetails = "LOADING ...";
        
        $scope.recipe = recipesFactory.get({
                id: $stateParams.id
            })

            .$promise.then(
                function (response) {
                    $scope.recipe = response;
                    $scope.showRecipeDetails = true;
                },
                function (response) {
                    $scope.messageRecipeDetails = "Error Recipes Details: " + response.status + " " + response.statusText;
                }
            ); //endpro
        
        //comment system
        $scope.mycomment = {
        rating: 5,
        comment: ""
    };

    $scope.submitComment = function () {

    

        commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: ""
        };
    }
        


}])

/* 
* SHOP  Controller
*/

.controller('StoreController', function($scope, Map) {
    
    $scope.place = {};
    
    $scope.search = function() {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res) { // success
                Map.addMarker(res);
                console.log(res);

                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();

                $scope.address  = res.formatted_address;
                $scope.phone = res.formatted_phone_number;
                
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    }
    
    $scope.send = function() {
        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);    
    }
    
    Map.init();
})


/* 
* Favorites  Controller
*/
.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    favoriteFactory.query(
        function (response) {
            $scope.recipes = response.recipes;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.deleteFavorite = function(recipeid) {
        console.log('Delete favorites', recipeid);
        favoriteFactory.delete({id: recipeid});
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {reload: true});
    };
}])
    

/* 
* EDIT RECIPE  Controller
*/
    .controller('EditRecipeController', ['$scope','editFactory', function ($scope, editFactory) {


        $scope.myeditrecipe = {
            name:"",
            image:"",
            title: "",
            file: "",
            category: "",
            preparationtime: "",
            cookingtime: "",
            ingredients: "",
            method: "",
            tips: "",
            featured: "false"
        };

// Value for Category 
        var categories = [{
            name: "appetizer",
            value: "appetizer"
        }, {
            name: "mains",
            value: "mains"
        }, {
            name: "drinks",
            value: "drinks"
        },{
            name: "desserts",
            value: "desserts"
        }];

        

        $scope.categories = categories;
        
        $scope.submitRecipe = function () {
            
            console.log($scope.myeditrecipe);
            editFactory.save($scope.myeditrecipe);

            $scope.myeditrecipe = {
                author:"",
                image:"",
                title: "",
                file: "",
                category: "",
                preparationtime: "",
                cookingtime: "",
                ingredients: "",
                method: "",
                tips: "",
                featured: "false"
            };
            $scope.editRecipeForm.$setPristine();
        }

}])

/**
 * Instagram Controller
 */

.controller('InstaCtrl', ['$scope',function($scope){

  userFeed = new Instafeed({
        clientId: '633451b360954f9eac3090d8f2cef264',
        userId: '5768253461',
        accessToken: '5768253461.633451b.6cae0e0c9c4747d088428eb1bc9acbc3',
        target:'instafeed',
        get: 'user',
        //tagName: 'recettevegan',
        links: true,
        limit: 25,
        sortBy: 'most-recent',
        resolution: 'standard_resolution',
        template: '<div class="col-xs-12 col-md-6"><a href="{{link}}"><img class="img-responsive" src="{{image}}" alt="{{caption}}" /></a><p>{{caption}}</p><i><span>like : {{likes}} </span> | <span> Comments : {{comments}}</span></i></div>'
    });



    
    userFeed.run();
var userfeed = $scope.userfeed;
console.log(userFeed);
}])

/**
*  RECIPE   CRUD controller 
*/
.controller('RecipeListController',['$scope','$state','popupService','$window','Recipe', function($scope,$state,popupService,$window,Recipe){

    $scope.recipes = Recipe.query();

    $scope.deleteRecipe=function(recipe){
        if(popupService.showPopup('Really delete this?')){
            recipe.$delete(function(){
                $window.location.href='';
            });
        }
    }

}])
.controller('RecipeViewController',['$scope','$stateParams','Recipe', function($scope,$stateParams,Recipe){

    $scope.recipe=Recipe.get({id:$stateParams.id});

}])
.controller('RecipeCreateController',['$scope','$state','$stateParams','Recipe', function($scope,$state,$stateParams,Recipe){

    // Value for Category  value the site. Could be changed as your feeling
        var categories = [{
            name: "appetizer",
            value: "appetizer"
        }, {
            name: "mains",
            value: "mains"
        }, {
            name: "drinks",
            value: "drinks"
        },{
            name: "desserts",
            value: "desserts"
        }];
    
    $scope.categories = categories;
    $scope.recipe=new Recipe();

    $scope.addRecipe=function(){
        $scope.recipe.$save(function(){
            $state.go('recipes');
        });
    }

}])
.controller('RecipeEditController',['$scope','$state','$stateParams','Recipe',function($scope,$state,$stateParams,Recipe){

    $scope.updateRecipe=function(){
        $scope.recipe.$update(function(){
            $state.go('recipes');
        });
    };

    $scope.loadRecipe=function(){
        $scope.recipe=Recipe.get({id:$stateParams.id});
    };

    $scope.loadRecipe();
}])




/************************
* LOgin controller
*/

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    //event
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    //hightligten ---->>>>> active page class action
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])

; //endControllers

