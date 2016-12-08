/* jshint node: true */
'use strict';

var Funnel  = require('broccoli-funnel'),
    rootURL = '/';

module.exports = {
    name: 'ck-editor',

    isDevelopingAddon: function() {
        return true;
    },

    included: function(app, parentAddon){
        var target           = (parentAddon || app);
        target.options       = target.options || {};
        target.options.babel = target.options.babel || { includePolyfill: true };
        rootURL              = target.options.rootURL || '/';

        target.import(target.bowerDirectory + '/ckeditor/ckeditor.js');

        return this._super.included(target);
    },


    contentFor: function(type) {
        if(type === 'head'){
            return "<script type='text/javascript'>window.CKEDITOR_BASEPATH = '"+ rootURL +"assets/ckeditor/';</script>";
        }
    },


    treeForPublic: function(tree) {
        return new Funnel(this.project.bowerDirectory + '/ckeditor', {
            srcDir: '/',
            destDir: '/assets/ckeditor'
        });
    }
};