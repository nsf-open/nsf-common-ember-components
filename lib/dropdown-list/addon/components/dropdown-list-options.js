import Ember from 'ember';
import ComponentChildMixin from 'component-utils/mixins/component-child';

/**
 * @class DropdownMenuOptions
 * @namespace Components.DropdownMenu
 * @extends Ember.Component
 */
export default Ember.Component.extend(ComponentChildMixin, {
    classNames: ['dropdown-menu'],
    classNameBindings: ['rightAlign:dropdown-menu-right'],
    attributeBindings: ['targetParent.toggle.elementId:aria-labelledby', 'data-test-id'],

    'data-test-id': 'dropdown-list-options',

    align: 'left',

    rightAlign: Ember.computed('align', function() {
        return this.getWithDefault('align', 'left').toLowerCase() === 'right';
    }).readOnly()
});
