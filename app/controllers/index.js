import Ember from 'ember';

export default Ember.Controller.extend({
    addons: Ember.inject.service('addon-descriptor')
});