angular
  .module('myGuideBlog')
  .controller('UsersShowCtrl', UsersShowCtrl)
  .controller('UsersEditCtrl', UsersEditCtrl);

UsersShowCtrl.$inject = ['User', 'Trip', '$stateParams', '$state', '$auth'];
function UsersShowCtrl(User, Trip, $stateParams, $state, $auth) {
  const vm = this;
  vm.user = User.get($stateParams);

  function usersDelete() {

    vm.user
      .$remove()
      .then(() => {
        $auth.logout();
        $state.go('register');
      });
  }
  vm.delete = usersDelete;

  function deleteTrip(trip) {
    Trip
      .delete({ id: trip.id })
      .$promise
      .then(() => {
        const index = vm.user.trips.indexOf(trip);
        vm.user.trips.splice(index, 1);
      });
  }
  vm.deleteTrip = deleteTrip;
}

UsersEditCtrl.$inject = ['User', '$stateParams', '$state'];
function UsersEditCtrl(User, $stateParams, $state) {
  const vm = this;
  vm.user = User.get($stateParams);

  function usersUpdate() {
    User.update({ id: vm.user.id, user: vm.user })
      .$promise
      .then(() => $state.go('usersShow', $stateParams));
  }
  vm.update = usersUpdate;
}
