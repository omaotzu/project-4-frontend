angular
  .module('myGuideBlog')
  .controller('RegisterCtrl', RegisterCtrl)
  .controller('LoginCtrl', LoginCtrl);

RegisterCtrl.$inject = ['$auth', '$state'];
function RegisterCtrl($auth, $state){
  const vm = this;

  function register(){
    if(vm.registerForm.$valid) {
      $auth.signup(vm.user)
        .then(() => $state.go('login'));
    }
  }
  vm.register = register;
}

LoginCtrl.$inject = ['$auth'];
function LoginCtrl($auth) {
  const vm = this;

  function login() {
    $auth.login(vm.credentials)
      .then(user =>console.log(user));
  }
  vm.login = login;
}
