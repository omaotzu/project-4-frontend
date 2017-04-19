angular
  .module('myGuideBlog')
  .controller('PostsShowCtrl', PostsShowCtrl);

PostsShowCtrl.$inject = ['Post', 'Comment', '$stateParams'];
function PostsShowCtrl(Post, Comment, $stateParams) {
  const vm = this;
  vm.post = Post.get($stateParams);

  function addComment() {
    vm.comment.post_id = vm.post.id;

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
