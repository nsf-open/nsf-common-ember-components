import Ember from 'ember';

let initializer = {
    name: 'webtrend-analytics',
    initialize: function(){
        Ember.LinkComponent.reopen({

            // Tracking event notes that will be sent to the router for inclusion in page view events.
            note      : null,
            track     : Ember.computed.alias('note'),
            trackNote : Ember.computed.alias('note'),

            _invoke(event) {
                if(this.get('_routing.router.analyticsEnabled')){
                    this.set('_routing.router.analyticsNote', this.get('note'));
                }

                this._super(event);
            }
        });
    }
};


export default initializer;