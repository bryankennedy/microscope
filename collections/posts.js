Posts = new Meteor.Collection('posts');

Posts.allow({
    update: ownsDocument,
    remove: ownsDocument
});

Posts.deny({
    update: function(userId, post, fieldNames) {
        // Reject any edits if fieldNames array contains
        // anything other than the url and title
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

Meteor.methods({
    post: function(postAttributes) {
        var user = Meteor.user(),
            postWithSameLink = Posts.findOne({url: postAttributes.url});
        // Ensure user has logged in
        if (!user)
            throw new Meteor.Error(401, "You need to log in to post new stories");

        // Ensure the post has a title
        if(!postAttributes.title)
            throw new Meteor.Error(422, "Please fill in a headline");

        // Check that there are no posts with the same URL
        if (postAttributes.url && postWithSameLink)
            throw new Meteor.Error(302, "This link has already been posted", postWithSameLink._id);

        // Pick out the whitelisted keys
        var post = _.extend(_.pick(postAttributes, 'url', 'title', 'message'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return postId;

    },

    upvote: function(postId) {
        var user = Meteor.user();
        // Ensure that the voter is logged in
        if (!user)
            throw new Meteor.Error(401, "You need to login to upvote");

        Posts.update({
            _id: postId,
            upvoters: {$ne: user._id}
        }, {
            $addToSet: {upvoters: user._id},
            $inc: {votes: 1}
        });

    }

});
