Posts = new Meteor.Collection('posts');
Posts.allow({
    insert: function(userId, doc) {
        // Only allow posting if you're logged in
        return !! userId;
    }
})
