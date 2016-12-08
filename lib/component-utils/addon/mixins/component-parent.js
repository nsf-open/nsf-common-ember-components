import Ember from 'ember';

const { Mixin, get, set, run, A: emberArray } = Ember;

/**
 * The ComponentParent mixin provides a reference array to all of its
 * registered ComponentChild instances.
 *
 * @class ComponentParent
 * @namespace Mixins
 * @module component-utils
 * @submodule mixins
 * @extends Ember.Mixin
 */
export default Mixin.create({

  /**
   * An array of ComponentChild instances which are descendants of this
   * component.
   *
   * @property children
   * @type array
   * @protected
   */
  children: null,


  /**
   * Listener for the 'init' component lifecycle hook which prepares the
   * children array.
   *
   * @method _onInit
   * @private
   * @final
   */
  init() {
    set(this, 'children', emberArray());
    this._super(...arguments);
  },


  /**
   * Register a component as a child of this parent
   *
   * @method registerChild
   * @param child {ComponentUtils.ComponentChild}
   * @public
   */
  registerChild(child) {
    run.schedule('sync', this, function() {
      get(this, 'children').addObject(child);
    });
  },


  /**
   * Remove the child component from this parent component
   *
   * @method removeChild
   * @param child {ComponentUtils.ComponentChild}
   * @public
   */
  removeChild(child) {
    get(this, 'children').removeObject(child);
  },
});
