Meteor.publish('posts', function() {
    return Posts.find();
});

Meteor.publish('comments', function(postId) {
    return Comments.find({postId: postId});
});

Meteor.publish('notifications', function(postId) {
    return Notifications.find({userId: this.userId});
});
