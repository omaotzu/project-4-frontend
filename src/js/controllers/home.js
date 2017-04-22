angular
  .module('myGuideBlog')
  .controller('HomeCtrl', HomeCtrl);

function HomeCtrl() {
  const vm = this;

  function randomizeImage() {
    vm.dailyImageArray = ['images/world1.jpg'];
    vm.dailyImage = vm.dailyImageArray[Math.floor(vm.dailyImageArray.length*Math.random())];
    console.log(vm.dailyImage);
  }
  randomizeImage();
}
