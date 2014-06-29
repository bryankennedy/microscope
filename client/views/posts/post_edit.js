Template.postEdit.events(({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostID = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        Posts.update(currentPostID, {$set: postProperties}, function(error) {
            if (error) {
                // Display the error to the user
                alert(error.reason);
            } else {
                Router.go('postPage', {_id: currentPostID});
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostID = this._id;
            Posts.remove(currentPostID);
            Router.go('postsList');
        }
    }
}));
