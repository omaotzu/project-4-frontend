/* global moment:true, google:true, MarkerClusterer:true */
angular
  .module('myGuideBlog')
  .controller('TripsIndexCtrl', TripsIndexCtrl)
  .controller('TripsNewCtrl', TripsNewCtrl)
  .controller('TripsShowCtrl', TripsShowCtrl)
  .controller('TripsEditCtrl', TripsEditCtrl);

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
      zoom: 2,
      center: { lat: 10.755018, lng: 5.344179 },
      backgroundColor: '#a3ccff',
      scrollwheel: false,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      styles

    });



    vm.marker = vm.allPosts.map(function(location) {
      return new google.maps.Marker({
        position: location
      });
    });

    vm.marker.forEach((marker) => {
      marker.addListener('click', function() {
        if (vm.numberOfClicks<1) {
          vm.map.setZoom(5);
        }
        vm.map.setCenter(marker.position);
        infowindow.open(vm.map, marker);
        vm.position = marker.position.toJSON();
        vm.numberOfClicks++;

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
      maxZoom: 6
    });

    var infowindow = new google.maps.InfoWindow({ content: '<p>HEEEEYYYY</p>' });


    vm.numberOfClicks = 0;

    google.maps.event.addListener(vm.map, 'zoom_changed', function() {
      vm.zoomLevel = vm.map.getZoom();
      if (vm.zoomLevel < 4) {
        vm.numberOfClicks = 0;
      }
    });

    google.maps.event.addListener(vm.markerCluster, 'clusterclick', function(cluster) {
      if (vm.numberOfClicks <1) {
        vm.map.setZoom(5);
      }
      vm.map.setCenter(cluster.getCenter());
      vm.position = cluster.getCenter().toJSON();
      vm.numberOfClicks++;
      // if(vm.map.zoom >=5 && vm.numberOfClicks >=2) {
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
      // }
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

  Trip
    .get($stateParams)
    .$promise
    .then(() => {
      vm.startDate = moment(vm.trip.start_date).format('YYYY-MM-DD').toString();
      vm.leaveDate = moment(vm.trip.leave_date).format('YYYY-MM-DD').toString();
    });

  function addStop() {
    if (vm.stopForm.$valid) {
      vm.stop.trip_id = vm.trip.id;
      vm.stop.lat = vm.info.lat;
      vm.stop.lng = vm.info.lng;
      vm.stop.place = vm.info.place;
      vm.stop.country = vm.info.country;

      vm.stop.start_date = new Date(vm.stop.start_date.getTime() + (2*1000*60*60));
      vm.stop.leave_date = new Date(vm.stop.leave_date.getTime() + (2*1000*60*60));

      Stop
        .save({ stop: vm.stop })
        .$promise
        .then((stop) => {
          vm.trip.stops.push(stop);
          vm.stop = {};
        });
    }
    vm.city = null;
    vm.stopForm.$setPristine();
    vm.stopForm.$setUntouched();
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

TripsEditCtrl.$inject = ['Trip', '$stateParams', '$state', '$auth'];
function TripsEditCtrl(Trip, $stateParams, $state, $auth) {
  const vm = this;


  Trip
    .get($stateParams)
    .$promise
    .then((data) => {
      vm.trip = data;
      vm.trip.start_date = new Date(vm.trip.start_date);
      vm.trip.leave_date = new Date(vm.trip.leave_date);
    });


  function tripsUpdate() {
    if ($auth.getPayload().id === vm.trip.user.id) {
      vm.trip.start_date = new Date(vm.trip.start_date.getTime() + (2*1000*60*60));
      vm.trip.leave_date = new Date(vm.trip.leave_date.getTime() + (2*1000*60*60));
      Trip.update({ id: vm.trip.id, trip: vm.trip })
        .$promise
        .then(() => $state.go('tripsShow', $stateParams));
    }else{
      $state.go('tripsShow', $stateParams, vm.message = 'You must own this trip in order to make changes');
    }
  }
  vm.update = tripsUpdate;
}

const styles = [
  {
    'featureType': 'administrative',
    'elementType': 'labels',
    'stylers': [
      {
        'color': '#262959'
      },
      {
        'visibility': 'simplified'
      }
    ]
  },
  {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [
      {
        'hue': '#0041ff'
      },
      {
        'saturation': 34.48275862068968
      },
      {
        'lightness': -1.490196078431353
      },
      {
        'gamma': 1
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': [
      {
        'saturation': -30.526315789473685
      },
      {
        'lightness': -22.509803921568633
      },
      {
        'gamma': 1
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#468ecd'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'simplified'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text',
    'stylers': [
      {
        'gamma': '1.18'
      },
      {
        'hue': '#000cff'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'simplified'
      },
      {
        'hue': '#0026ff'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'all',
    'stylers': [
      {
        'saturation': '-11'
      },
      {
        'gamma': '1.91'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#53916b'
      },
      {
        'saturation': '-22'
      },
      {
        'lightness': '40'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels',
    'stylers': [
      {
        'color': '#080816'
      },
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'all',
    'stylers': [
      {
        'saturation': -2.970297029703005
      },
      {
        'lightness': -17.815686274509815
      },
      {
        'gamma': 1
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#2d2e46'
      },
      {
        'lightness': '20'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text',
    'stylers': [
      {
        'color': '#ffffff'
      },
      {
        'visibility': 'simplified'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'all',
    'stylers': [
      {
        'hue': '#FFE100'
      },
      {
        'saturation': 8.600000000000009
      },
      {
        'lightness': -4.400000000000006
      },
      {
        'gamma': 1
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.text',
    'stylers': [
      {
        'color': '#23274a'
      },
      {
        'visibility': 'simplified'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'all',
    'stylers': [
      {
        'hue': '#00C3FF'
      },
      {
        'saturation': 29.31034482758622
      },
      {
        'lightness': -38.980392156862735
      },
      {
        'gamma': 1
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text',
    'stylers': [
      {
        'color': '#1b2346'
      },
      {
        'visibility': 'simplified'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [
      {
        'hue': '#0078FF'
      },
      {
        'gamma': 1
      }
    ]
  }
];
