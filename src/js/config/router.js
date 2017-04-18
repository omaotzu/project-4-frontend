angular
  .module('myGuideBlog')
  .config(Router);

Router.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];
function Router($urlRouterProvider, $locationProvider, $stateProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'js/views/auth/home.html'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'js/views/auth/register.html',
      controller: 'RegisterCtrl as register'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'js/views/auth/login.html',
      controller: 'LoginCtrl as login'
    })
    .state('tripsNew', {
      url: '/trips/new',
      templateUrl: 'js/views/trips/new.html',
      controller: 'TripsNewCtrl as tripsNew'
    })
    .state('tripsIndex', {
      url: '/trips',
      templateUrl: 'js/views/trips/index.html',
      controller: 'TripsIndexCtrl as tripsIndex'
    })
    .state('tripsShow', {
      url: '/trips/:id',
      templateUrl: 'js/views/trips/show.html',
      controller: 'TripsShowCtrl as tripsShow'
    })
    .state('stopsShow', {
      url: '/stops/:id',
      templateUrl: 'js/views/stops/show.html',
      controller: 'StopsShowCtrl as stopsShow'
    })
    .state('postsShow', {
      url: '/posts/:id',
      templateUrl: 'js/views/posts/show.html',
      controller: 'PostsShowCtrl as postsShow'
    })
    .state('usersShow', {
      url: '/users/:id',
      templateUrl: 'js/views/users/show.html',
      controller: 'UsersShowCtrl as usersShow'
    })
    .state('usersEdit',{
      url: '/users/:id/edit',
      templateUrl: 'js/views/users/edit.html',
      controller: 'UsersEditCtrl as usersEdit'
    });
  $urlRouterProvider.otherwise('/');
}
