angular
  .module('myGuideBlog')
  .controller('StopsShowCtrl', StopsShowCtrl);

StopsShowCtrl.$inject = ['Stop', 'Post', '$stateParams'];
function StopsShowCtrl(Stop, Post, $stateParams) {
  const vm = this;
  vm.stop = Stop.get($stateParams);

  function addPost() {
    vm.post.stop_id = vm.stop.id;

    Post
      .save({ post: vm.post })
      .$promise
      .then((post) => {
        vm.stop.posts.push(post);
        vm.post = {};
      });
  }
  vm.addPost = addPost;

  function addComment() {
    console.log(vm.stop);
    // vm.comment.post_id = vm.stop.post.id;

    Comment
      .save({ comment: vm.comment })
      .$promise
      .then((comment) => {
        vm.post.comments.push(comment);
        vm.comment = {};
    });
  }
  vm.addComment = addComment;

}
