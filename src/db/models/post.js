'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
  };
  Post.prototype.getPoints = function(){
    console.log(this.votes);
    if(this.votes.length === 0) return 0

    return this.votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };
  Post.prototype.hasUpvoteFor = function(userId){
    if(!userId) return false;
    let hasUpvote = false;
    this.votes.forEach((v) => {
      if(v.userId===userId && v.value===1) hasUpvote = true;
    })
    return hasUpvote;
  };
  Post.prototype.hasDownvoteFor = function(userId){
    if(!userId) return false;
    let hasDownvote = false;
    this.votes.forEach((v) => {if(v.userId===userId && v.value===-1) hasDownvote = true;})
    return hasDownvote;
  };
  return Post;
};
