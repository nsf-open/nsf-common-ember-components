import Ember from 'ember';

/**
 *
 * @class AnalyticsSupportMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    analytics: Ember.inject.service('webtrend-analytics'),

    note: null,
    track: Ember.computed.alias('note'),
    trackNote: Ember.computed.alias('note'),

    click() {
        let type    = null,
            note    = this.get('note'),
            tracker = this.get('analytics');

        switch (this.get('tagName').toLowerCase()) {
            case 'a':
            {
                let href = this.getWithDefault('href', '').toLowerCase();

                if (href.substring(0, 7) === 'mailto:') {
                    type = tracker.get('types.mailTo');
                } else if (href.substring(0, 11) === 'javascript:') {
                    type = tracker.get('types.javascript');
                } else {
                    type = tracker.get('types.anchor');
                }

                break;
            }

            // TODO: Continue to expand this to support more element types.
            default:
        }

        if (!note) {
            let text = this.get('text');

            if (text) {
                note = text;
            } else {
                note = this.$().text().trim();
            }
        }

        tracker.trackEvent(note, type);
    }
});
