import Ember from 'ember';
import AnalyticsSupportMixin from '../mixins/analytics-support';

export default Ember.Component.extend(AnalyticsSupportMixin, {
    attributeBindings: ['href', 'target', 'disabled', 'type', 'data-test-id'],

    tagName  : 'a',
    text     : null,
    href     : null,
    target   : null,
    disabled : null,
    type     : null,

    'data-test-id': null,

    click: function() {
        this._super.apply(this, arguments);

        this.sendAction();

        if (this.get('tagName') === 'a' && this.get('href') == '#') {
            return false;
        }
    }
});
