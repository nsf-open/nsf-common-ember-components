/* global dcsMultiTrack:true */

import Ember from 'ember';

/**
 * @class AnalyticsService
 * @namespace Services
 * @extends Ember.Service
 */
export default Ember.Service.extend({

    /**
     * A reference to Ember's routing service.
     *
     * @property routing
     * @type Ember.routing.RoutingService
     * @static
     */
    routing: Ember.inject.service('-routing'),

    /**
     * An object of key:value pairs containing the valid WT.dl flags used by WebTrends to describe the origin of tracking events.
     *
     * @property types
     * @type Object
     * @static
     */
    types: Ember.computed(function() {
        return {
            pageView: '0',
            download: '20',
            anchor: '21',
            javascript: '22',
            mailTo: '23',
            offSite: '24',
            rClickToDownload: '25',
            formButtonGet: '26',
            formButtonPost: '27',
            formButtonInput: '28',
            formButtonButton: '29',
            imageMap: '30',
            youtubeImpression: '40',
            youtubeEvent: '41',
            onSiteAddImpression: '50',
            mobileAppOther: '60',
            mobileAppStateEvent: '61',
            linkClickOther: '99',
            facebookPlugin: '111',
            heatMapPlugin: '125'
        };
    }).readOnly(),

    /**
     * The current value of window.location.host.
     *
     * @property host
     * @type String
     * @static
     */
    host: Ember.computed(function() {
        return window.location.host;
    }).readOnly(),

    /**
     * The current URL path as reported by the routing service.
     *
     * @property currentUrl
     * @type String
     * @readOnly
     */
    currentUrl: Ember.computed('routing.router.url', function() {
        return this.get('routing.router.url');
    }).readOnly(),

    /**
     * The current value of window.document.title.
     *
     * @property title
     * @type String
     * @readOnly
     */
    title: Ember.computed('currentUrl', function() {
        return window.document.title;
    }).readOnly(),

    /**
     *
     * @param note
     */
    pageView: function(note) {
        this._send(note, this.get('types.pageView'));
    },

    /**
     *
     * @param note
     * @param type
     */
    trackEvent: function(note, type) {
        type = type || this.get('types.linkClickOther');
        this._send(note, type);
    },

    /**
     * Sends a tracking event via WebTrends dcsMultiTrack method.
     *
     * @param {String|Array|null} note Additional information to send with the track. If a string, it will be provided to DCSext.note (and
     * appear as `note` in the tracking query string). If an array, duples are expected where the first value is the key name to provide to
     * the DCSext namespace, and the second value is what to set on that key.
     * @param {int} type The integer value to set WebTrends WT.dl flag to - indicating what kind of event triggered the track.
     *
     * @returns void
     * @private
     *
     * @example
     *      // No note and generic link click type
     *      _send(null, 99);
     *
     *      // A string note and generic link click type
     *      // DCSext.note will receive the value 'Link Clicked' and ?note=Link%20Clicked will be in the track call query string
     *      _send('Link Clicked', 99);
     *
     *      // An array note and generic link click type
     *      // DCSext.paramA will receive the value 'Link Clicked' and DCSext.paramB will receive 'More Info'
     *      _send(['paramA', 'Link Clicked', 'paramB', 'More Info'], 99);
     */
    _send: function(note, type) {
        let args = ['DCS.dcssip', this.get('host'), 'DCS.dcsuri', this.get('currentUrl'), 'WT.ti', this.get('title'), 'WT.dl', type];

        if (note) {
            if (Ember.isArray(note)) {
                let i = 0;

                for (i; i < note.length; i += 2) {
                    args.push('DCSext.' + note[i]);
                    args.push(note[i + 1]);
                }
            }
            else {
                args.push('DCSext.note');
                args.push(note);
            }
        }

        dcsMultiTrack(...args);
    }
});
