angular
  .module('myGuideBlog')
  .controller('StopsShowCtrl', StopsShowCtrl);

StopsShowCtrl.$inject = ['Stop', '$stateParams'];
function StopsShowCtrl(Stop, $stateParams) {
  const vm = this;
  vm.stop = Stop.get($stateParams);
}
