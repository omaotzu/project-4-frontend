angular
  .module('myGuideBlog')
  .controller('PostsShowCtrl', PostsShowCtrl);

PostsShowCtrl.$inject = ['Post', 'Comment', 'Img', '$stateParams'];
function PostsShowCtrl(Post, Comment, Img, $stateParams) {
  const vm = this;
  vm.post = Post.get($stateParams);


  function addImage() {
    vm.image.post_id = vm.post.id;
    Img
      .save({ image: vm.image })
      .$promise
      .then((image) => {
        vm.post.images.push(image);
        vm.image = {};
      });
  }
  vm.addImage = addImage;

  function deleteImage(image) {
    Img
      .delete({ id: image.id })
      .$promise
      .then(() => {
        const index = vm.post.images.indexOf(image);
        vm.post.images.splice(index, 1);
      });
  }
  vm.deleteImage = deleteImage;

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

  function deleteComment(comment) {
    Comment
      .delete({ id: comment.id })
      .$promise
      .then(() => {
        const index = vm.post.comments.indexOf(comment);
        vm.post.comments.splice(index, 1);
      });
  }
  vm.deleteComment = deleteComment;

}
