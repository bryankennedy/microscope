Posts = new Meteor.Collection('posts');
Posts.allow({
    update: ownsDocument,
    remove: ownsDocument
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
            submitter: new Date().getTime()
        });

        var postId = Posts.insert(post);

        return postId;

    }

});
