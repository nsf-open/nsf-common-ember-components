import Ember from 'ember';

const { Mixin, get, set, run, typeOf } = Ember;

/**
 * The WindowScrollObserver mixin aims to make vertical scroll events in the
 * browser easy to detect without being too taxing. It does this by wrapping
 * jQuery's scroll event and then periodically polling its data for changes,
 * which is important since a large volume of scroll events may be emitted
 * (depending on the browser).
 *
 * In the implementing component, a `onWindowScroll()` callback method is
 * provided which will be executed, at most, only as often as the
 * `windowScrollCheckFrequency` property is set to. E.g. if
 * `windowScrollCheckFrequency=500` then at most `onWindowScroll()`will only
 * be executed every 500 milliseconds while scrolling occurs.
 *
 * The additional `windowScrollCoolOffPeriod` property will further temper
 * the execution of `onWindowScroll()` by delaying its execution until a set
 * time after the last scroll event has been emitted. E.g. if
 * `windowScrollCoolOffPeriod=250` then `onWindowScroll()` will not be executed
 * until 250 milliseconds after the last scroll event occurred. If additional
 * scroll events are emitted during that interm the timer will reset.
 *
 * @class WindowScrollObserver
 * @namespace Mixins
 * @module component-utils
 * @submodule mixins
 * @extend Ember.Mixins
 */
export default Mixin.create({

  /**
   * The frequency, in milliseconds, to poll for scroll updates.
   *
   * @property windowScrollCheckFrequency
   * @type int
   * @default 500
   */
  windowScrollCheckFrequency: 500,


  /**
   * The amount of time to wait, in milliseconds, between when the last scroll
   * event was emitted, and the 'onWindowScroll()' callback should be executed.
   *
   * @property windowScrollCoolOffPeriod
   * @type int
   * @default 250
   */
  windowScrollCoolOffPeriod: 250,


  /**
   * If true, `windowScrollCheckFrequency` and `windowScrollCoolOffPeriod` will
   * be ignored, and `onWindowScroll()` will be executed as often as scroll events
   * are emitted.
   *
   * @property windowScrollEmitContinuous
   * @type boolean
   * @default false
   */
  windowScrollEmitContinuous: false,


  /**
   *
   *
   * @property windowScrollEnabled
   * @type boolean
   * @default true
   */
  windowScrollEnabled: true,


  /**
   *
   *
   * @property _windowScrollDestroyer
   * @type Function
   * @default null
   * @private
   */
  _windowScrollDestroyer: null,


  /**
   * @method didInsertElement
   * @private
   */
  didInsertElement() {
    run.next(this, function() {
      if(get(this, 'windowScrollEnabled')) {
        this._buildWindowScrollIntervalMachination();
      }
    });

    this._super(...arguments);
  },


  /**
   * Detach listeners and clear the interval when the component is destroyed.
   *
   * @method willDestroyElement
   * @private
   */
  willDestroyElement() {
    this.windowScrollDestroy();
    this._super(...arguments);
  },


  /**
   *
   * @method windowScrollEnable
   */
  windowScrollEnable() {
    if(!get(this, 'windowScrollEnabled')) {
      set(this, 'windowScrollEnabled', true);
      this._buildWindowScrollIntervalMachination();
    }
  },


  /**
   *
   * @method windowScrollDisable
   */
  windowScrollDisable() {
    if(get(this, 'windowScrollEnabled')) {
      set(this, 'windowScrollEnabled', false);
      this.windowScrollDestroy();
    }
  },


  /**
   *
   *
   * @method windowScrollDestroy
   * @private
   * @final
   */
  windowScrollDestroy() {
    const destructor = get(this, '_windowScrollDestroyer');

    if(destructor) {
      destructor.call();
      set(this, '_windowScrollDestroyer', null);
    }
  },


  /**
   *
   *
   * @method _buildWindowScrollInvervalMachination
   * @private
   * @final
   */
  _buildWindowScrollIntervalMachination() {
    const frequency = get(this, 'windowScrollCheckFrequency'),
      continuous = get(this, 'windowScrollEmitContinuous'),
      coolOff = get(this, 'windowScrollCoolOffPeriod'),
      self = this,

    // We're scoping out this stuff so that we don't have to deal with bind()
    // when adding/removing listeners.
      scopedActivities = (function() {
        const hasCallback = typeOf(self.onWindowScroll) === 'function';

        let windowScroll = false,
          timeoutId = null,
          intervalId = setInterval(function() {
            if(windowScroll) {
              if(continuous) {
                if(hasCallback) {
                  self.onWindowScroll();
                }
                windowScroll = false;
              }
              else if(hasCallback) {
                if(timeoutId) {
                  clearTimeout(timeoutId);
                }

                timeoutId = setTimeout(() => {
                  self.onWindowScroll();
                  windowScroll = false;
                  timeoutId = null;
                }, coolOff);
              }
            }
          }, frequency);

        /*
         * @method scrollListener
         * @returns {void}
         */
        function scrollListener() {
          windowScroll = true;
        }

        Ember.$(window).scroll(scrollListener);

        // Returns a scoped function to tear things down.
        return function() {
          Ember.$(window).off('scroll', scrollListener);
          clearInterval(intervalId);
          intervalId = null;
        };
      }());

    set(this, '_windowScrollDestroyer', scopedActivities);
  },
});
