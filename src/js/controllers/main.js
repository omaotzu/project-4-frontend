angular
  .module('myGuideBlog')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state', '$auth', '$scope'];
function MainCtrl($rootScope, $state, $auth, $scope){
  const vm = this;
  vm.isAuthenticated = $auth.isAuthenticated;
  vm.isNavCollapsed = true;
  vm.isCollapsed = false;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;
    vm.message = err.data.message;
    $state.go('login');
  });

  $rootScope.$on('$stateChangeSuccess', () => {
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
    if($auth.getPayload()) vm.currentUser = $auth.getPayload();
    $scope.isNavCollapsed = true;
    vm.stateName = $state.current.name;
    vm.dailyImageArray = ['world', 'map', 'search', 'find'];
    vm.dailyImage = vm.dailyImageArray[Math.floor(vm.dailyImageArray.length*Math.random())];
  });

  const protectedStates = ['someStatesWeDontHaveYet'];

  $rootScope.$on('$stateChangeStart', (e, toState) => {
    $scope.isNavCollapsed = true;
    if(!$auth.isAuthenticated() && protectedStates.includes(toState.name)) {
      e.preventDefault();
      $state.go('login');
      vm.message = 'You must be logged in to access this page';
    }
    vm.pageName = toState.name;
  });

  function logout() {
    $auth.logout();
    $state.go('tripsIndex');
  }
  vm.logout = logout;
}
