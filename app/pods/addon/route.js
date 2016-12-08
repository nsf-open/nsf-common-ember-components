import Ember from 'ember';

export default Ember.Route.extend({
    assets: Ember.inject.service('addon-descriptor'),

    model(params) {
        return this.get(`assets.${params.name}`);
    }
});