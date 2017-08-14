

'use strict';
angular.module('originrecipApp', ['ui.router','ngResource','ngDialog','ngMap','ngSanitize'])
   

.config(function ($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider ) {
        
        
        $locationProvider.hashPrefix('');//no!
        $stateProvider

            // route for the home page
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'HomeController'
                    }
                }

            })

            // route for the recipe page
            .state('app.recipes', {
                url: 'recipes',
                views: {
                    'content@': {
                        templateUrl: 'views/recipes.html',
                        controller: 'RecipesController'
                    }
                }
            })

            // route for the recipedetail page
            .state('app.recipesdetails', {
                url: 'recipes/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/recipesdetails.html',
                        controller: 'RecipesDetailsController'
                    }
                }
            })
    
            //edit receip
            .state('app.editrecipe', {
                url: 'editrecipe',
                views: {
                    'content@': {
                        templateUrl: 'views/editrecipe.html',
                        controller: 'EditRecipeController'
                    }
                }
            })

            //store
            .state('app.store', {
                url: 'store',
                views: {
                    'content@': {
                        templateUrl: 'views/store.html',
                        controller: 'StoreController'
                    }
                }
            })
                        

            // instagram page
            .state('app.instabase', {
                url: 'instabase',
                views: {
                    'content@': {
                        templateUrl: 'views/instabase.html',
                        controller:'InstaCtrl'
                        
                    }
                }
            })

            //about
            .state('app.about', {
                url: 'about',
                views: {
                    'content@': {
                        templateUrl: 'views/about.html'
                    }
                }
            })

            //
            .state('app.recipe',{
                url:'recipe',
                 views: {
                    'content@': {
                        templateUrl:'views/partials/recipe.html',
                        controller:'RecipeListController'
                    }
                 }
            })
            .state('app.viewRecipe',{
                url:'recipe/:id/view',
                views:{
                    'content@': {
                    templateUrl:'views/partials/recipe-view.html',
                    controller:'RecipeViewController'
                    }
                }
            })
            .state('app.newRecipe',{
                url:'recipe/new',
                views:{
                    'content@': {
                    templateUrl:'views/partials/recipe-add.html',
                    controller:'RecipeCreateController'
                    }
                }
            })
            .state('app.editRecipe',{
                url:'recipe/:id/edit',
                views:{
                    'content@': {
                    templateUrl:'views/partials/recipe-edit.html',
                    controller:'RecipeEditController'
                    }
                }
            })
/*
            // route for the dishdetail page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });
*/
            
            

        $urlRouterProvider.otherwise('/');
    })

    

; //endContollers
