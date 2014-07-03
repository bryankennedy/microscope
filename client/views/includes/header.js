Template.header.helpers({
    activeRouteClass: function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.name === name
        });

        // If active equals active, then it returns true, otherwise false
        return active && 'active';

    }
});
