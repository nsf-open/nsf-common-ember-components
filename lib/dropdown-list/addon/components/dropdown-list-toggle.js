import Ember from 'ember';
import ComponentChildMixin from 'component-utils/mixins/component-child';

/**
 *
 *
 * @class DropdownMenuToggle
 * @namespace Components.DropdownMenu
 * @extends Ember.Component
 */
const DropdownListToggle = Ember.Component.extend(ComponentChildMixin, {
    tagName: 'button',
    ariaRole: 'button',
    classNames: ['dropdown-toggle'],
    attributeBindings: ['targetParent.open:aria-expanded', 'aria-haspopup', 'data-test-id'],

    text: '',

    'aria-haspopup': 'true',

    'data-test-id': 'dropdown-list-toggle',

    click(event) {
        event.stopPropagation();
        this.toggleProperty('targetParent.open');
        return false;
    }
});

DropdownListToggle.reopenClass({
  positionalParams: ['text']
});

export default DropdownListToggle;
