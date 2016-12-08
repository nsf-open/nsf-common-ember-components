import Ember from 'ember';
import ComponentParentMixin from './component-parent';

const { Mixin, computed, get } = Ember;

/**
 * The ComponentChild mixin provides a bindable reference to its closest
 * ComponentParent ancestor.
 *
 * @class ComponentChild
 * @namespace Mixins
 * @module component-utils
 * @submodule mixins
 * @extends Ember.Mixin
 */
export default Mixin.create({
  /**
   * A reference to the ancestor ComponentParent to which this component
   * belongs.
   *
   * @property targetParent
   * @type ComponentUtils.ComponentParent
   */
  targetParent: computed(function() {
    return this.nearestOfType(ComponentParentMixin);
  }),

  /**
   * Listener for the 'didInsertElement' component lifecycle hook which
   * registers this component with its ComponentParent ancestor.
   *
   * @method _onDidInsertElement
   * @private
   * @final
   */
  didInsertElement() {
    const parent = get(this, 'targetParent');

    if(parent) {
      parent.registerChild(this);
    }

    this._super(...arguments);
  },

  /**
   * Listener for the 'willDestroyElement' component lifecycle hook which
   * de-registers this component from its ComponentParent ancestor.
   *
   * @method _onWillDestroyElement
   * @private
   * @final
   */
  willDestroyElement() {
    const parent = get(this, 'targetParent');

    if(parent) {
      parent.removeChild(this);
    }

    this._super(...arguments);
  },
});
