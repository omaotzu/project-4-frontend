/* global moment:true, google:true, MarkerClusterer:true */
angular
.module('myGuideBlog')
.controller('TripsIndexCtrl', TripsIndexCtrl)
.controller('TripsNewCtrl', TripsNewCtrl)
.controller('TripsShowCtrl', TripsShowCtrl);

TripsIndexCtrl.$inject = ['Trip', 'Post', 'Stop'];
function TripsIndexCtrl(Trip, Post, Stop) {
  const vm = this;

  vm.allTrips = Trip.query();

  Post.query()
    .$promise
    .then((posts) => {
      vm.allPosts = posts.map((post) => {
        return {
          lat: post.stop.lat,
          lng: post.stop.lng
        };
      });
      initMap();
    });



  function initMap() {
    vm.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 1,
      center: { lat: 10.755018, lng: 32.344179 },
      scrollwheel: false
    });

    vm.marker = vm.allPosts.map(function(location) {
      return new google.maps.Marker({
        position: location
      });
    });

    vm.marker.forEach((marker) => {

      marker.addListener('click', function() {
        vm.map.setZoom(5);
        vm.map.setCenter(marker.position);
        infowindow.open(vm.map, marker);
        vm.position = marker.position.toJSON();

        Stop
          .query(vm.position)
          .$promise
          .then((stops) => {
            vm.filteredStops = [];
            stops.forEach((stop) => {
              stop.posts.forEach((post) => {
                vm.filteredStops.push(post);
              });
            });
          });
      });
    });

    vm.markerCluster = new MarkerClusterer(vm.map, vm.marker,{
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      zoomOnClick: false,
      maxZoom: 7
    });

    var infowindow = new google.maps.InfoWindow({ content: '<p>HEEEEYYYY</p>' });


    google.maps.event.addListener(vm.markerCluster, 'clusterclick', function(cluster) {
      vm.map.setZoom(5);
      vm.map.setCenter(cluster.getCenter());
      vm.position = cluster.getCenter().toJSON();

      Stop
        .query(vm.position)
        .$promise
        .then((stops) => {
          vm.filteredStops = [];
          stops.forEach((stop) => {
            stop.posts.forEach((post) => {
              vm.filteredStops.push(post);
            });
          });
        });
    });
  }
}

TripsNewCtrl.$inject = ['Trip', 'User', '$state', '$auth'];
function TripsNewCtrl(Trip, User, $state, $auth) {
  const vm = this;
  vm.trip = {};
  vm.allUsers = User.query();



  function tripsCreate() {
    vm.trip.start_date = new Date(vm.trip.start_date.getTime() + (2*1000*60*60));
    vm.trip.leave_date = new Date(vm.trip.leave_date.getTime() + (2*1000*60*60));

    Trip
      .save({ trip: vm.trip })
      .$promise
      .then(() => {
        $state.go('usersShow', { id: $auth.getPayload().id });

      });
  }
  vm.create = tripsCreate;
}

TripsShowCtrl.$inject = ['Trip', 'Stop', '$stateParams', 'filterFilter', '$scope', 'skyscanner'];
function TripsShowCtrl(Trip, Stop, $stateParams, filterFilter, $scope, skyscanner) {
  const vm = this;
  vm.trip = Trip.get($stateParams);
  vm.tripStartDate = {};
  vm.tripLeaveDate = {};

  Trip
    .get($stateParams)
    .$promise
    .then(() => {
      vm.startDate = moment(vm.trip.start_date).format('YYYY-MM-DD').toString();
      vm.leaveDate = moment(vm.trip.leave_date).format('YYYY-MM-DD').toString();
    });

  function addStop() {
    vm.stop.trip_id = vm.trip.id;
    vm.stop.lat = vm.info.lat;
    vm.stop.lng = vm.info.lng;
    vm.stop.place = vm.info.place;
    vm.stop.country = vm.info.country;

    Stop
      .save({ stop: vm.stop })
      .$promise
      .then((stop) => {
        vm.trip.stops.push(stop);
        vm.stop = {};
      });
    vm.city = null;
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

  function getFlights() {
    vm.departureDate = moment(vm.outboundDate).format('YYYY-MM-DD');
    skyscanner.getFlights(vm.origin, vm.destination, vm.departureDate)
      .then((quotes) => {
        vm.flights = quotes;
      });
  }
  vm.getFlights=getFlights;
}
