/**
 * Define a template helper for posts
 */
Template.postsList.helpers({
    /**
     * Get the posts from the DB
     */
    posts: function() {
        return Posts.find({}, {sort: {submitted: -1}});
    }
});
