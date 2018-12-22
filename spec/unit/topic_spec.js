const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Post", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {

// #2
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; //store the user

// #3
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",

// #4
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {

// #5
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic; //store the topic
          this.post = topic.posts[0]; //store the post
          done();
        })
      })
    });
  });

  describe("#create()", () => {

      it("should create a topic object with a title, body, and a post", (done) => {

        Topic.create({
          title: "Pros of Cryosleep during the long journey",
          body: "1. Not having to answer the 'are we there yet?' question."
        })
        .then((post) => {

 //#2
          expect(post.title).toBe("Pros of Cryosleep during the long journey");
          expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
          done();

        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });

      it("should not create a post with missing title, body, or assigned topic", (done) => {
        Post.create({
          title: "Pros of Cryosleep during the long journey"
        })
        .then((post) => {

         // the code in this block will not be evaluated since the validation error
         // will skip it. Instead, we'll catch the error in the catch block below
         // and set the expectations there

          done();

        })
        .catch((err) => {

          expect(err.message).toContain("Post.body cannot be null");
          expect(err.message).toContain("Post.topicId cannot be null");
          done();

        })
      });

    });

  describe("#getPosts()", () => {

    it("should return the associated posts for the topic in scope", (done) => {
      Post.create({
        title: "Getposts post test",
        description: "Getposts post description",
        body: "Getposts post body",
        topicId: this.post.id,
        userId: this.user.id
      })
      .then((newPost) => {
        this.topic.getPosts()
        .then((associatedPosts) => {
          associatePosts.forEach((item)=>{
            expect(associatedPosts.topicId).toBe(this.topic.id);
            expect(associatedPosts.title).toBe("Getposts post test");
          });
          done();
        });
        done();
      });

    });
  });
});
