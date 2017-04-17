angular
  .module('myGuideBlog')
  .controller('TripsIndexCtrl', TripsIndexCtrl)
  .controller('TripsNewCtrl', TripsNewCtrl)
  .controller('TripsShowCtrl', TripsShowCtrl);

TripsIndexCtrl.$inject = ['Trip'];
function TripsIndexCtrl(Trip) {
  const vm = this;
  vm.allTrips = Trip.query();
}

TripsNewCtrl.$inject = ['Trip', 'User', '$state'];
function TripsNewCtrl(Trip, User, $state) {
  const vm = this;
  vm.trip = {};
  vm.allUsers = User.query();

  function tripsCreate() {
    Trip
      .save({ trip: vm.trip })
      .$promise
      .then(() => $state.go('tripsIndex'));
  }
  vm.create = tripsCreate;
}

TripsShowCtrl.$inject = ['Trip', '$stateParams'];
function TripsShowCtrl(Trip, $stateParams) {
  const vm = this;
  vm.trip = Trip.get($stateParams);
}
