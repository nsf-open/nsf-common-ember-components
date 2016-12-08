import Ember from 'ember';

export default Ember.Route.extend({
    addons: Ember.inject.service('addon-descriptor'),

    model() {
        return this.get('addons.letterSortedPackageList');
    }
});