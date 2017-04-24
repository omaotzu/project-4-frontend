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

UsersEditCtrl.$inject = ['User', '$stateParams', '$state', '$auth'];
function UsersEditCtrl(User, $stateParams, $state, $auth) {
  const vm = this;
  User
    .get($stateParams)
    .$promise
    .then((data) => {
      vm.user = data;
      vm.user.id = data.id;
    });


  function usersUpdate() {
    if ($auth.getPayload().id === vm.user.id) {
      User.update({ id: vm.user.id, user: vm.user })
        .$promise
        .then(() => $state.go('usersShow', $stateParams));
    }else {
      $state.go('tripsIndex');
    }
  }
  vm.update = usersUpdate;
}
