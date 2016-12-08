import Ember from 'ember';

const { Component, computed, get, set, isEmpty, run, typeOf, $ } = Ember;

/**
 * Component that creates a tooltip.
 *
 * @class ToolTip
 * @namespace Components
 * @module tool-tip
 * @submodule components
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  tagName: 'span',
  classNames: ['nsf-tooltip'],
  attributeBindings: ['title', 'data-test-id', 'ariaHidden:aria-hidden'],

  /**
   * The data attribute set on the root element to be used for testing.
   *
   * @property data-test-id
   * @type string
   * @default "tooltip"
   * @static
   */
  'data-test-id': 'tooltip',

  /**
   * Indicates whether an HTML button element which closes the tooltip should
   * be rendered. This is only potentially useful for tooltips which are not
   * triggered via hover.
   *
   * @property showCloseButton
   * @type boolean
   * @default true
   */
  showCloseButton: true,

  /**
   *
   *
   * @property text
   * @type string
   * @default null
   */
  text: null,

  /**
   *
   *
   * @property title
   * @type string
   * @default null
   */
  title: null,

  /**
   *
   *
   * @property content
   * @type string
   * @default null
   */
  content: null,

  /**
   *
   *
   * @property enabled
   * @type boolean
   * @default true
   */
  enabled: true,

  /**
   *
   *
   * @property tipTextAttr
   * @type string
   * @default "data-tooltip-content"
   */
  tipTextAttr: 'data-tooltip-content',

  /**
   *
   * @property ariaHidden
   * @type boolean
   * @default true
   * @readOnly
   */
  ariaHidden: computed('hasBlock', 'text', function() {
    return !get(this, 'hasBlock') && isEmpty(get(this, 'text'));
  }).readOnly(),

  // These are properties that have special update methods in Tooltipster
  functionProperties: computed(function() {
    return ['enabled', 'title', 'content'];
  }).readOnly(),


  // These are properties that accept functions as their value and are used
  // as callbacks throughout the Tooltip's lifespan.
  callbackProperties: computed(function() {
    return ['functionInit', 'functionBefore', 'functionReady', 'functionAfter'];
  }).readOnly(),


  // These are properties that may be set by calling
  // this.$().tooltipster('option', name, value)
  settableProperties: computed(function() {
    return ['animation', 'arrow', 'arrowColor', 'autoClose', 'debug', 'delay',
      'minWidth', 'maxWidth', 'hideOnClick', 'interactive', 'interactiveTolerance',
      'offsetX', 'offsetY', 'onlyOne', 'position', 'positionTracker', 'restoration',
      'speed', 'timer', 'theme', 'touchDevices', 'tipTrigger', 'updateAnimation',
      'contentAsHTML'];
  }).readOnly(),


  // See https://iamceege.github.io/tooltipster/ for more information
  // on these config options.
  animation: 'fade',
  arrow: true,
  arrowColor: null,
  autoClose: true,
  debug: false,
  delay: 200,
  minWidth: 0,
  maxWidth: null,
  hideOnClick: false,
  interactive: false,
  interactiveTolerance: 350,
  offsetX: 0,
  offsetY: 0,
  onlyOne: false,
  position: 'top',
  positionTracker: false,
  restoration: 'current',
  speed: 350,
  timer: 0,
  theme: 'tooltipster-default',
  touchDevices: true,
  tipTrigger: 'hover',
  updateAnimation: true,
  contentAsHTML: false,


  functionInit: null,
  functionBefore: null,
  functionReady: null,
  functionAfter: null,


  didInsertElement() {
    this._super(...arguments);

    run.scheduleOnce('afterRender', this, () => {
      let tipContent = this.$(`[${this.get('tipTextAttr')}]`),
        content = get(this, 'content');

      if(tipContent.length){
        set(this, 'contentAsHTML', true);
        this.$().tooltipster(this._buildConfig(tipContent.detach()));
      }
      else if(!isEmpty(content)){
        set(this, 'contentAsHTML', true);
        this.$().tooltipster(this._buildConfig(content));
      }
      else{
        this.$().tooltipster(this._buildConfig());
      }

      if(!get(this, 'enabled')){
        this.$().tooltipster('disable');
      }
    });
  },


  willDestroyElement() {
    this._super(...arguments);
    this.$().tooltipster('destroy');
  },


  didUpdateAttrs() {
    this._super(...arguments);

    let funcs = get(this, 'functionProperties'),
      props = get(this, 'settableProperties'),
      changed = {},
      oldVals = arguments[0].oldAttrs,
      newVals = arguments[0].newAttrs;

    // Step 1: Figure out what changed
    for(let key in newVals) {
      switch(typeOf(newVals[key])){
        case 'string':
        case 'number':
        case 'boolean':
          if(newVals[key] !== oldVals[key]) {
            changed[key] = newVals[key];
          }
          break;
        case 'object':
          if(newVals[key].value !== oldVals[key].value) {
            changed[key] = newVals[key].value;
          }
          break;
      }
    }

    // Step 2: Apply changes
    for(let key in changed) {
      // Function Properties have special hooks into Tooltipster.
      if(funcs.indexOf(key) !== -1){
        switch(key){
          case 'enabled':
            this.$().tooltipster((changed[key])? 'enable' : 'disable');
            break;
          case 'title':
          case 'content':
            this.$().tooltipster('content', changed[key]);
            break;
        }

        continue;
      }

      // Other properties may all be passed to Tooltipster via its 'option' hook.
      if(props.indexOf(key) !== -1) {
        Ember.assert('The trigger event for a tooltip cannot be set at runtime.', key !== 'tipTrigger');
        this.$().tooltipster('option', key, changed[key]);
      }
    }
  },


  _buildConfig(content){
    let props = get(this, 'settableProperties'),
      callbacks = get(this, 'callbackProperties'),
      config = {};

    for(let i = 0; i < props.length; i++){
      // Tooltipster requires that this either be set, or not be present (null is a no-no).
      if(props[i] == 'arrowColor'){
        if(this.get(props[i])){
          config[props[i]] = this.get(props[i]);
        }
      }
      // Trigger is a reserved word in Ember components, so we need to use something else.
      else if(props[i] == 'tipTrigger'){
        config['trigger'] = this.get(props[i]);
      }
      // Everything else can go on its merry way.
      else{
        config[props[i]] = this.get(props[i]);
      }
    }

    for(let i = 0; i < callbacks.length; i++){
      let callback = this.get(callbacks[i]);

      if(callbacks[i] !== 'functionInit' && typeOf(callback) == 'function'){
        config[callbacks[i]] = callback;
      }
    }

    let initCallback    = this.get('functionInit'),
      hasInitCallback = Ember.typeOf(initCallback) == 'function';

    if(this.get('showCloseButton')){
      this.set('contentAsHTML', true);
      config['contentAsHTML'] = true;

      config['functionInit'] = function(tip, content){
        let closeButton = $('<button></button>', {
            type: 'button',
            'class': 'close',
            'aria-label': 'Close'}
        ).prepend('<span>x</span>');

        closeButton.on('click', function(){
          tip.tooltipster('hide');
        });

        if(Ember.typeOf(content) === 'string') {
          content = $.parseHTML(`<div><div>${content}</div></div>`);
          content = $(content[0]);
        }
        else{
          content = $(content);
        }

        content.prepend(closeButton);

        if(hasInitCallback){
          content = initCallback(...arguments);
        }

        return content;
      }
    }
    else{
      if(hasInitCallback){
        config.functionInit = initCallback;
      }
    }

    if(content){
      config.content = content;
    }

    return config;
  },

  click() {
    this.sendAction();
  },
});
