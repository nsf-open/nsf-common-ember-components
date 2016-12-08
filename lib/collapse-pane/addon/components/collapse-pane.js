import Ember from 'ember';
import ComponentParentMixin from 'component-utils/mixins/component-parent';
import CollapsePaneToggle from './collapse-pane-toggle';
import CollapsePaneBody from './collapse-pane-body';

const { Component, get, computed, observer } = Ember;

/**
 *
 *
 * @class CollapsePane
 * @namespace Components
 * @module collapse-pane
 * @submodule components
 * @extends Ember.Component
 * @uses Mixins.ComponentParent
 */
export default Component.extend(ComponentParentMixin, {
  attributeBindings: computed(function() {
    return ['data-test-id'];
  }),

  /**
   * A string attribute that will be added to the root node of the collapse pane to
   * act as a fixed query selector for testing purposes.
   *
   * @property data-test-id
   * @type string
   * @default collapse-pane
   */
  'data-test-id': 'collapse-pane',


  /**
   * A boolean indicating the state of the collapse pane body.
   *
   * @property open
   * @type boolean
   * @default true
   */
  open: true,


  /**
   * A boolean indicating whether or not the toggling functionality of this
   * collapse-pane is disabled.
   *
   * @property disabled
   * @type boolean
   * @default false
   */
  disabled: false,


  /**
   * A reference to the collapse pane's toggle child component, if it exists.
   *
   * @property toggle
   * @type CollapsePaneToggle
   * @default null
   * @readOnly
   */
  toggle: computed('children.[]', function() {
    return get(this, 'children').find(item => {
      return item instanceof CollapsePaneToggle;
    });
  }).readOnly(),


  /**
   * A reference to the collapse pane's body child component, if it exists.
   *
   * @property body
   * @type CollapsePaneBody
   * @default null
   * @readOnly
   */
  body: computed('children.[]', function() {
    return get(this, 'children').find(item => {
      return item instanceof CollapsePaneBody;
    });
  }).readOnly(),


  /**
   * An Ember observer that watches for changes in the open/close state of
   * the collapse panel and dispatches actions accordingly.
   *
   * @method _onStateChange
   * @private
   */
  _onStateChange: observer('open', function() {
    if(get(this, 'open')) {
      get(this, 'body').openBody();

      this.sendAction('onOpen');
      this.sendAction('onToggle', true);
    }
    else {
      get(this, 'body').closeBody();

      this.sendAction('onClose');
      this.sendAction('onToggle', false);
    }
  }),
});
