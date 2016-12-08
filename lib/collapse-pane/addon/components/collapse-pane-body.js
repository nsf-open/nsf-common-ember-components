import Ember from 'ember';
import ComponentChildMixin from 'component-utils/mixins/component-child';

const { Component, get, set, setProperties, computed, run } = Ember;

/**
 *
 * @class CollapsePaneBody
 * @namespace Components
 * @module collapse-pane
 * @submodule components
 * @extends Ember.Component
 * @uses Mixins.ComponentChild
 */
export default Component.extend(ComponentChildMixin, {
  attributeBindings: ['data-test-id'],

  /**
   * A string attribute that will be added to the root node of the collapse pane
   * body to act as a fixed query selector for testing purposes.
   *
   * @property data-test-id
   * @type string
   * @default "collapse-pane-body"
   */
  'data-test-id': 'collapse-pane-body',


  /**
   * The amount of time that it will take the jQuery animations to either fully
   * show or fully hide the collapse pane body, in milliseconds. This is split
   * equally between the fade and slide portions of the animation.
   *
   * @property duration
   * @type number
   * @default 500
   */
  duration: 500,


  /**
   * The jQuery animation easing function that will be used for both slide and
   * fade effects.
   *
   * @property easing
   * @type string
   * @default swing
   */
  easing: 'swing',


  /**
   * A string indicating whether the collapse pane body is currently in its
   * 'open' or 'close' state (including transitions into that state). A value of
   * 'open' will coincide to the parent collapse pane's open property being equal
   * to true, and 'close' will coincide to that property being false.
   *
   * @property transitionDirection
   * @type string
   * @default open
   * @readOnly
   */
  transitionDirection: 'open',


  /**
   * A boolean indicating whether the collapse pane body is currently in a state
   * of transition. I.E. it is actively being opened or closed.
   *
   * @property isTransitioning
   * @type boolean
   * @default false
   * @readOnly
   */
  isTransitioning: false,


  /**
   * A class name applied to the collapse panel body root element which reflects
   * its current state. May be either 'opened', 'opening', 'closing', or 'closed'.
   *
   * @property transitioningClassName
   * @type String
   * @default "opened"
   * @readOnly
   */
  transitioningClassName: computed('isTransitioning', 'transitionDirection', function() {
    const inTransit = get(this, 'isTransitioning'),
      direction = get(this, 'transitionDirection');

    if(inTransit) {
      return (direction === 'close') ? 'closing' : 'opening';
    }
    else {
      return (direction === 'close') ? 'closed' : 'opened';
    }
  }).readOnly(),


  init() {
    set(this, 'classNameBindings', ['transitioningClassName']);
    this._super(...arguments);
  },


  /**
   * Ember component lifecycle hook that handles setting up the initial state of
   * the collapse pane body when the component is first created.
   *
   * @method didInsertElement
   * @private
   */
  didInsertElement() {
    run.scheduleOnce('afterRender', this, function() {
      if(!get(this, 'targetParent.open')) {
        set(this, 'transitionDirection', 'close');
        this.$().hide();
      }
    });

    this._super(...arguments);
  },


  /**
   * Animates the body to its open state by first animating its height and then
   * the opacity of its children.
   *
   * @method openBody
   * @private
   */
  openBody() {
    const duration = get(this, 'duration') / 2,
      easing = get(this, 'easing'),
      $this = this.$();

    setProperties(this, {
      transitionDirection: 'open',
      isTransitioning: true,
    });

    $this.slideDown({
      easing,
      duration,
      done: run.bind(this, function() {
        $this.children().fadeTo(
          duration, 1, easing, run.bind(this, 'set', 'isTransitioning', false)
        );
      }),
    });
  },


  /**
   * Animates the body to its close state by first animating the opacity of its
   * children and then its height.
   *
   * @method openBody
   * @private
   */
  closeBody() {
    const duration = get(this, 'duration') / 2,
      easing = get(this, 'easing'),
      $this = this.$();

    setProperties(this, {
      transitionDirection: 'close',
      isTransitioning: true,
    });

    $this.children().fadeTo(duration, 0, easing, run.bind(this, function() {
      $this.slideUp({
        easing,
        duration,
        done: run.bind(this, 'set', 'isTransitioning', false),
      });
    }));
  },
});
