import Ember from 'ember';
import ModalWindow from '../modal-window';

/**

 Modal header element used within {{#crossLink "Components.Modal"}}{{/crossLink}} components. See there for examples.

 @class ModalHeader
 @namespace Components
 @extends Ember.Component
 @public
 */
export default Ember.Component.extend({
    classNames: ['modal-header'],

    /**
     * Show a close button (x icon)
     *
     * @property closeButton
     * @type boolean
     * @default true
     * @public
     */
    closeButton: true,

    /**
     * The title to display in the modal header
     *
     * @property title
     * @type string
     * @default null
     * @public
     */
    title: null,

    targetObject: Ember.computed(function() {
        return this.nearestOfType(ModalWindow);
    }).volatile(),

    action: 'close',

    actions: {
        close() {
            this.sendAction();
        }
    }
});