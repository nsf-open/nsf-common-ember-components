/*jshint node:true*/
module.exports = {
    name: 'tool-tip',

    isDevelopingAddon: function() {
        return true;
    },

    afterInstall: function() {
        return this.addBowerPackageToProject('tooltipster', '^3.3.0');
    },

    included: function(app, parentAddon) {
        var target           = (parentAddon || app);
        target.options       = target.options || {};
        target.options.babel = target.options.babel || { includePolyfill: true };

        target.import(target.bowerDirectory + '/tooltipster/js/jquery.tooltipster.js');
        target.import(target.bowerDirectory + '/tooltipster/css/tooltipster.css');

        return this._super.included(target);
    }
};
