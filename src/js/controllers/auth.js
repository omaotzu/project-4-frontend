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

LoginCtrl.$inject = ['$auth', '$state'];
function LoginCtrl($auth, $state) {
  const vm = this;
  vm.credentials = {};

  function login() {
    if(vm.loginForm.$valid){
      $auth.login(vm.credentials)
        .then(() => $state.go('usersShow', { id: $auth.getPayload().id }))
        .catch((err) => {
          if(err.status === 401){
            $state.reload();
          }
        });
    }
  }
  vm.login = login;
}
