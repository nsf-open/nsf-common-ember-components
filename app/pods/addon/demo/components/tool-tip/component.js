import Ember from 'ember';

export default Ember.Component.extend({
    isCreated: false,

    animation: 'fade',
    delay: 200,
    speed: 350,
    timer: 0,
    minWidth: 0,
    maxWidth: null,
    position: 'top',
    tipTrigger: 'hover',
    theme: 'tooltipster-default',
    title: 'Bacon ipsum dolor amet cow deserunt turkey frankfurter pork loin. T-bone sausage veniam leberkas, nostrud venison magna kevin. Pork chop magna tongue aliqua t-bone occaecat proident bacon jowl meatloaf voluptate. Ut spare ribs duis aute dolore dolore kielbasa. Tri-tip bacon strip steak qui ball tip shank.',
    arrow: true,
    arrowColor: null,
    autoClose: true,
    debug: false,
    hideOnClick: true,
    interactive: false,
    interactiveTolerance: 350,
    multiple: false,
    offsetX: 0,
    offsetY: 0,
    onlyOne: false,
    positionTracker: false,
    touchDevices: true,
    updateAnimation: true,
    restoration: 'current',

    tipEventMessageQueue: [],


    tipAFunctionInit: Ember.computed(function(){
        let self = this;

        return function(){
            self._updateTipEventMessageQueue('Tooltip 1 has been initialized (functionInit callback)');
        }
    }),

    tipBFunctionInit: Ember.computed(function(){
        let self = this;

        return function(){
            self._updateTipEventMessageQueue('Tooltip 2 has been initialized (functionInit callback)');
        }
    }),

    tipAFunctionBefore: Ember.computed(function(){
        let self = this;

        return function(origin, continueTooltip){
            self._updateTipEventMessageQueue('Tooltip 1 is about to be shown (functionBefore callback)');
            continueTooltip();
        }
    }),

    tipBFunctionBefore: Ember.computed(function(){
        let self = this;

        return function(origin, continueTooltip){
            self._updateTipEventMessageQueue('Tooltip 2 is about to be shown (functionBefore callback)');
            continueTooltip();
        }
    }),

    tipAFunctionReady: Ember.computed(function(){
        let self = this;

        return function(){
            self._updateTipEventMessageQueue('Tooltip 1 has been shown (functionReady callback)');
        }
    }),

    tipBFunctionReady: Ember.computed(function(){
        let self = this;

        return function(){
            self._updateTipEventMessageQueue('Tooltip 2 has been shown (functionReady callback)');
        }
    }),

    tipAFunctionAfter: Ember.computed(function(){
        let self = this;

        return function(){
            self._updateTipEventMessageQueue('Tooltip 1 has been removed (functionAfter callback)');
        }
    }),

    tipBFunctionAfter: Ember.computed(function(){
        let self = this;

        return function(){
            self._updateTipEventMessageQueue('Tooltip 2 has been removed (functionAfter callback)');
        }
    }),


    _updateTipEventMessageQueue: function(message){
        let queue = this.get('tipEventMessageQueue');

        queue.unshift(message);

        if(queue.length > 20){
            this.set('tipEventMessageQueue', queue.slice(0, 20));
        }

        this.notifyPropertyChange('tipEventMessageQueue');
    },


    actions: {
        createTooltip() {
            this.set('isCreated', true);
        },

        destroyTooltip() {
            this.setProperties({
                isCreated: false,
                tipAFunctionInitMessage: null,
                tipAFunctionBeforeMessage: null
            });
        }
    }
});