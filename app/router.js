import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('directory');
    this.route('use');
    this.route('contributing');

    this.route('addon', {path: '/addon/:name'}, function(){
        this.route('index', {path: '/'});
        this.route('usage');
        this.route('demo');
    });

    this.route('demos', function(){
        this.route('ck-editor', function(){
            this.route('insert');
            this.route('inline-insert');
        });

        this.route('datetime-picker', function(){
            this.route('linked');
        });

      this.route('sort-list', function(){
        this.route('paged-list');
      });

      this.route('data-grid');
    });
});

export default Router;
