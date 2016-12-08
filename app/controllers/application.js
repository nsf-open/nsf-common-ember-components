import Ember from 'ember';
import ENV from 'nsf-ember-commons/config/environment';

export default Ember.Controller.extend({
    rootURL: ENV.rootURL
});