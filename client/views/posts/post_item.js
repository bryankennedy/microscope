var POST_HEIGHT = 80;
// Local collection for position elements
var Positions = new Meteor.Collection(null);

Template.postItem.helpers({
    ownPost: function() {
        return this.userId == Meteor.userId();
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    },
    attributes: function() {
        var post = _.extend({}, Positions.findOne({postId: this._id}), this);
        var newPosition = post._rank * POST_HEIGHT;
        var attributes = {};

        /**
         * Animate the position
         */
        if (_.isUndefined(post.position)) {
            attributes.class = 'post invisible';
        } else {
            var delta = post.position - newPosition;
            attributes.style = "top: " + delta + "px";
            if (delta === 0)
                attributes.class = "post animate"
        }

        /**
         * Update the local collection with the new post position
         */
        Meteor.setTimeout(function() {
            Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
        });

        return attributes;
    }
});

/**
 * Upvote event
 */
Template.postItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvote', this._id);
    }
});
