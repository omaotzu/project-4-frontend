angular
  .module('myGuideBlog')
  .factory('Image', Image);

Image.$inject = ['$resource', 'API_URL'];
function Image($resource, API_URL) {
  return new $resource(`${API_URL}/images/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
