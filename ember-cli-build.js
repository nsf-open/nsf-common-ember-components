/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        rootURL: '/nsf-common-ember/',

        outputPaths: {
            app: {
                html: 'index.html',
                css: {
                    app: '/assets/css/nsf-ember-commons.css'
                },
                js: '/assets/js/nsf-ember-commons.js'
            },
            tests: {
                js: '/assets/js/tests.js'
            },
            testSupport: {
                css: '/assets/css/test-support.css',
                js: {
                    testSupport: '/assets/js/test-support.js',
                    testLoader: '/assets/js/test-loader.js'
                }
            },
            vendor: {
                css: '/assets/css/vendor.css',
                js: '/assets/js/vendor.js'
            }
        },

        sassOptions: {
            includePaths: [
                'bower_components/bootstrap/scss',
                'bower_components/font-awesome/scss'
            ]
        }
    });

    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.eot",   {destDir: "assets/fonts"});
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.svg",   {destDir: "assets/fonts"});
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf",   {destDir: "assets/fonts"});
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff",  {destDir: "assets/fonts"});
    app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff2", {destDir: "assets/fonts"});
    app.import("bower_components/font-awesome/fonts/FontAwesome.otf",           {destDir: "assets/fonts"});

    return app.toTree();
};