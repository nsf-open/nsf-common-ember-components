import Ember from 'ember';

export default Ember.Mixin.create({
    analytics: Ember.inject.service('webtrend-analytics'),

    analyticsEnabled: true,

    // This will be set by LinkComponent and un-set by the webTrack event below.
    // Its purpose is to be able to send custom info to WebTrends for page views.
    analyticsNote: null,

    webTrack: Ember.on('didTransition', function() {
        this.get('analytics').pageView(this.get('analyticsNote'));
        this.set('analyticsNote', null);

        this._super(...arguments);
    })
});