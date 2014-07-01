Comments = new Meteor.Collection('comments');
Meteor.methods({
    comment: function(commentAttributes) {
        var user = Meteor.user();
        var post = Posts.findOne(commentAttributes.postId);
        // Ensure the user is logged in
        if(!user)
            throw new Meteor.Error(401, "You need to login to make comments");
        if(!commentAttributes.body)
            throw new Meteor.Error(422, "Please write a comment.")
        if(!post)
            throw new Meteor.Error(422, "You must comment on a post.");
        comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime()
        });

        // Use Mongo's $inc operator to increment the count
        Posts.update(comment.postId, {$inc: {commentsCount: 1}});

        // Create the comment, save the ID
        comment._id = Comments.insert(comment);

        // Create a notification
        createCommentNotification(comment);

        return comment._id;
    }
});
