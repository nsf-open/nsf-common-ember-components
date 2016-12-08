/*jshint node:true*/
var path        = require('path'),
    Funnel      = require('broccoli-funnel'),
    mergeTrees  = require('broccoli-merge-trees');

module.exports = {
    name: 'datetime-picker',

    isDevelopingAddon: function() {
        return true;
    },

    included: function(target) {
        this._super.included.apply(this, target);

        var app      = target.app || target,
            bowerDir = app.bowerDirectory,
            options  = app.options['nsf-ember-datetime-picker'];

        app.import('vendor/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css');
        app.import('vendor/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js');
    },


    treeForVendor: function(vendorTree) {
        var trees       = [],
            pickerPath  = require.resolve('eonasdan-bootstrap-datetimepicker').replace(path.join('src', 'js', 'bootstrap-datetimepicker.js'), '');

        if(vendorTree){
            trees.push(vendorTree);
        }

        try{
            var bootstrap = require.resolve('bootstrap').replace(path.join('js', 'npm.js'), '');
            trees.push(new Funnel(bootstrap, {destDir: 'bootstrap'}));
        }
        catch(err){
            // Nothing to do.
        }

        trees.push(new Funnel(pickerPath, {destDir: 'eonasdan-bootstrap-datetimepicker'}));

        return mergeTrees(trees);
    }
};
