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

TripsShowCtrl.$inject = ['Trip', 'Stop', '$stateParams'];
function TripsShowCtrl(Trip, Stop, $stateParams) {
  const vm = this;
  vm.trip = Trip.get($stateParams);

  function addStop() {
  vm.stop.trip_id = vm.trip.id;

  Stop
    .save({ stop: vm.stop })
    .$promise
    .then((stop) => {
      vm.trip.stops.push(stop);
      vm.stop = {};
    });
  }
  vm.addStop = addStop;

  function deleteStop(stop) {
    Stop
      .delete({ id: stop.id })
      .$promise
      .then(() => {
        const index = vm.trip.stops.indexOf(stop);
        vm.trip.stops.splice(index, 1);
      });
  }
  vm.deleteStop = deleteStop;
}
