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
      zoom: 2,
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
            vm.filteredStops = stops[0].posts;
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
          vm.filteredStops = stops[0].posts;
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
    Trip
      .save({ trip: vm.trip })
      .$promise
      .then(() => $state.go('usersShow', { id: $auth.getPayload().id }));
  }
  vm.create = tripsCreate;
}

TripsShowCtrl.$inject = ['Trip', 'Stop', '$stateParams', 'filterFilter', '$scope'];
function TripsShowCtrl(Trip, Stop, $stateParams, filterFilter, $scope) {
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

  function filterCountries() {
    const params = vm.q;
    vm.filtered = filterFilter(vm.countries, params);
  }

  $scope.$watch(() => vm.q, filterCountries);

  vm.countries = ['Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antigua &amp; Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia &amp; Herzegovina',
    'Botswana',
    'Brazil',
    'British Virgin Islands',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Congo',
    'Cook Islands',
    'Costa Rica',
    'Cote D Ivoire',
    'Croatia',
    'Cruise Ship',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Polynesia',
    'French West Indies',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kuwait',
    'Kyrgyz Republic',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Pierre &amp; Miquelon',
    'Samoa',
    'San Marino',
    'Satellite',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'St Kitts &amp; Nevis',
    'St Lucia',
    'St Vincent',
    'St. Lucia',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'East Timor',
    'Togo',
    'Tonga',
    'Trinidad &amp; Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks &amp; Caicos',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'United States Minor Outlying Islands',
    'Uruguay',
    'Uzbekistan',
    'Venezuela',
    'Vietnam',
    'Virgin Islands (US)',
    'Yemen',
    'Zambia',
    'Zimbabwe'];
}
