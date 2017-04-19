angular
  .module('myGuideBlog')
  .factory('Img', Img);

Img.$inject = ['$resource', 'API_URL'];
function Img($resource, API_URL) {
  return new $resource(`${API_URL}/images/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
