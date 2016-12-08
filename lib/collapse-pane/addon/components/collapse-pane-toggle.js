import Ember from 'ember';
import ComponentChildMixin from 'component-utils/mixins/component-child';

const { Component, get, computed } = Ember;

/**
 *
 * @class CollapsePaneToggle
 * @namespace Components
 * @module collapse-pane
 * @submodule components
 * @extends Ember.Component
 * @uses Mixins.ComponentChild
 */
export default Component.extend(ComponentChildMixin, {
  tagName: 'button',

  attributeBindings: ['data-test-id', 'aria-expanded', 'aria-controls',
      'type', 'targetParent.disabled:disabled'],

  /**
   * A string attribute that will be added to the root node of the collapse
   * pane toggle to act as a fixed query selector for testing purposes.
   *
   * @property data-test-id
   * @type string
   * @default "collapse-pane-toggle"
   */
  'data-test-id': 'collapse-pane-toggle',


  /**
   * The ARIA expanded attribute for this element that will toggle based on
   * the collapse-pane's current `open` state.
   *
   * @property aria-expanded
   * @type string
   * @default "true"
   * @readOnly
   */
  'aria-expanded': computed('targetParent.open', function() {
    return get(this, 'targetParent.open') ? 'true' : 'false';
  }).readOnly(),


  /**
   * The ARIA controls attribute for this element that will be equal to the
   * elementId of the collapse-pane-body once it is initialized.
   *
   * @property aria-controls
   * @type string
   * @default null
   * @readOnly
   */
  'aria-controls': computed('targetParent.body.elementId', function() {
    return get(this, 'targetParent.body.elementId');
  }).readOnly(),


  /**
   * The type attribute, useful for the default implementation of the component
   * as a button element, that gives the browser contextual information about its
   * usage.
   *
   * @property type
   * @type string
   * @default "button"
   */
  type: 'button',


  /**
   * An optional string that will be added as the content of the collapse panel
   * toggle component, instead of creating block content. This will be ignored
   * if block content is supplied.
   *
   * @property text
   * @type string
   * @default null
   */
  text: null,


  /**
   * The Ember event that handles click interactions on the collapse panel toggle.
   *
   * @event click
   * @private
   */
  click() {
    if(!get(this, 'targetParent.disabled')) {
      this.toggleProperty('targetParent.open');
    }
  },
});
