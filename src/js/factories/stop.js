angular
  .module('myGuideBlog')
  .factory('Stop', Stop);

Stop.$inject = ['$resource', 'API_URL'];
function Stop($resource, API_URL) {
  return new $resource(`${API_URL}/stops/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
