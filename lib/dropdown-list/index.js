/*jshint node:true*/
module.exports = {
    name: 'dropdown-list',

    isDevelopingAddon: function() {
        return true;
    },

    included: function(app, parentAddon) {
        var target           = (parentAddon || app);
        target.options       = target.options || {};
        target.options.babel = target.options.babel || { includePolyfill: true };

        return this._super.included(target);
    }
};
