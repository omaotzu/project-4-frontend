angular
  .module('myGuideBlog')
  .directive('autocomplete', autocomplete);

autocomplete.$inject = ['$window'];
function autocomplete($window) {
  return {
    restrict: 'A',
    require: 'ngModel',
    replace: false,
    scope: {
      lat: '=',
      lng: '=',
      place: '=',
      country: '='
    },
    link: function($scope, element, attrs, model) {
      const options = {
        types: []
      };

      const autocomplete = new $window.google.maps.places.Autocomplete(element[0], options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log(place.address_components[place.address_components.length-1].long_name);
        $scope.place = place.address_components[0].long_name;
        $scope.country = place.address_components[place.address_components.length-1].long_name;
        $scope.lat = place.geometry.location.toJSON().lat;
        $scope.lng = place.geometry.location.toJSON().lng;
        model.$setViewValue(element.val());
      });
    }
  };
}
