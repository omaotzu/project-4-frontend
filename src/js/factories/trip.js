angular
  .module('myGuideBlog')
  .factory('Trip', Trip);

Trip.$inject = ['$resource', 'API_URL'];
function Trip($resource, API_URL) {
  return new $resource(`${API_URL}/trips/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
