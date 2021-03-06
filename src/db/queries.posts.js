const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Authorizer = require("../policies/post");
const Comment = require("./models").Comment;
const User = require("./models").User;
const Vote = require("./models").Vote;
const Favorite = require("./models").Favorite;

module.exports = {
  addPost(newPost, callback){
    return Post.create(newPost)
    .then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    })
  },
  deletePost(req, callback){
    return Post.findById(req.params.id)
    .then((post) => {

      const authorized = req.user?new Authorizer(req.user, post).destroy():false;

      if(authorized) {
        post.destroy()
        .then((res) => {
          callback(null, post);
        });

      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    });
  },
  updatePost(req, updatedPost, callback){
    return Post.findById(req.params.id)
    .then((post) => {
      if(!post){
        return callback("Post not found");
      }
      const authorized = req.user?new Authorizer(req.user, post).update():false;
      if(authorized) {
        post.update(updatedPost, {
          fields: Object.keys(updatedPost)
        })
        .then(() => {
          callback(null, post);
        })
        .catch((err) => {
          callback(err);
        });
      }
      else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },
  getPost(id, callback){
    return Post.findById(id, {
      include: [
        {model: Comment, as: "comments", include: [
          {model: User }
        ]}, {model: Vote, as: "votes"},
              {model: Favorite, as: "favorites"}
      ]
    })
    .then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
