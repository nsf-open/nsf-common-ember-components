import Ember from 'ember';
import SharedProperties from 'tree-view/utils/shared-properties';

const { Component, computed, get, getProperties, defineProperty, set, run, getOwner } = Ember;

/**
 *
 * @class TreeView
 * @namespace Components
 * @module tree-view
 * @submodule components
 * @extends Ember.Component
 */
export default Component.extend({
  classNames: ['tree-view'],

  attributeBindings: ['dataTestId:data-test-id'],

  dataTestId: 'tree-view',

  trunkClass: 'tv-trunk',

  data: null,

  disabled: false,

  focusWasOnMouseDown: false,

  sharedProperties: computed(function() {
    return SharedProperties.create();
  }).readOnly(),

  sharedPropAliasesToDefine: computed(function() {
    return ['labelField', 'childField', 'titleField', 'descField', 'descAsHtml', 'branchClass',
      'leafClass', 'branchIconClass', 'leafIconClass', 'branchIconOpenClass',
      'branchIconCloseClass', 'branchClickable', 'leafClickable', 'branchSelectable',
      'leafSelectable', 'multiSelectable', 'branchDraggable', 'leafDraggable', 'collapsible',
      'startCollapsed', 'collapseOn', 'collapseTarget', 'collapseDuration'];
  }).readOnly(),


  /**
   *
   */
  init() {
    const propNames = get(this, 'sharedPropAliasesToDefine'),
      props = getProperties(this, propNames);

    for(let i = 0; i < propNames.length; i++) {
      defineProperty(this, propNames[i], computed.alias(`sharedProperties.${propNames[i]}`));

      if({}.hasOwnProperty.call(props, propNames[i]) && props[propNames[i]] !== undefined) {
        set(this, propNames[i], props[propNames[i]]);
      }
    }

    this._super(...arguments);
  },


  /**
   *
   */
  didInsertElement() {
    this._super(...arguments);

    run.next(this, function() {
      this.sendAction('ready', this.getCallbackPackage());
    });
  },


  /**
   *
   */
  getCallbackPackage() {
    return {
      getNodeById: this.getNodeById.bind(this),
      findTreeNode: this.findTreeNode.bind(this),
    };
  },


  /**
   * The findTreeNode() method takes some DOM node and then walks its ancestors
   * looking for one which was inserted by Ember via component initialization.
   * Since 'dragstart' events are always emitted from a tree-view-node child
   * element, the tree-view-node root element is what will be found. Once found,
   * a lookup of the root element's id is made against the component's registry,
   * and the return value is a reference to the Ember component as it exists in
   * memory at that moment (anti-pattern, I know). From here we can pull the data
   * property of the component or do whatever else we need.
   *
   * TL;DR; Give findTreeNode() a DOM element and it'll return the parent
   * tree-view-node component to which that child belongs.
   */
  findTreeNode(element) {
    const parent = this.$(element).closest('[data-treeview-node]');

    if(parent.length) {
      return this.getNodeById(parent.attr('id'));
    }

    return null;
  },


  /**
   *
   */
  getNodeById(id) {
    return getOwner(this).lookup('-view-registry:main')[id];
  },


  /**
   *
   */
  click(event) {
    this.dispatchActions(event, 'click');
  },


  /**
   *
   */
  keyUp(event) {
    this.dispatchActions(event, 'keyUp');
  },

  /**
   *
   */
  dragStart(event) {
    this.dispatchActions(event, 'dragStart');
  },


  /**
   *
   *
   * @private
   * @method mouseDown
   * @param {Event} event
   */
  mouseDown() {
    set(this, 'focusWasOnMouseDown', true);
  },


  /**
   *
   */
  focusOut(event) {
    this.dispatchActions(event, 'focusOut');
  },


  /**
   *
   */
  focusIn(event) {
    this.dispatchActions(event, 'focusIn');
    set(this, 'focusWasOnMouseDown', false);
  },


  /**
   *
   */
  dispatchActions(event, trigger) {
    if(!event.treeViewData) {
      return;
    }

    const comp = event.treeViewData.component;

    if(get(comp, 'nodeIsDisabled')) {
      return;
    }

    if(trigger === 'click' || trigger === 'keyUp') {
      if(get(comp, 'nodeIsClickable')) {
        this.sendAction('onNodeClick', comp, trigger === 'keyUp');
        this.sendAction(
          get(comp, 'isBranch') ? 'onBranchClick' : 'onLeafClick', comp, trigger === 'keyUp'
        );
      }

      if(event.treeViewData.triggeredCollapse) {
        this.sendAction('onBranchToggle', comp, trigger === 'keyUp');
      }
    }
    else if(trigger === 'focusIn') {
      const wasClick = get(this, 'focusWasOnMouseDown');

      this.sendAction('onNodeFocusIn', comp, !wasClick);

      if(get(comp, 'isBranch')) {
        this.sendAction('onBranchFocusIn', comp, !wasClick);
      }
      else {
        this.sendAction('onLeafFocusIn', comp, !wasClick);
      }
    }
    else if(trigger === 'focusOut') {
      const wasClick = get(this, 'focusWasOnMouseDown');

      this.sendAction('onNodeFocusOut', comp, !wasClick);

      if(get(comp, 'isBranch')) {
        this.sendAction('onBranchFocusOut', comp, !wasClick);
      }
      else {
        this.sendAction('onLeafFocusOut', comp, !wasClick);
      }
    }
    else if(trigger === 'dragStart') {
      this.sendAction('onNodeDragStart', comp, event);

      if(get(comp, 'isBranch')) {
        this.sendAction('onBranchDragStart', comp, event);
      }
      else {
        this.sendAction('onLeafDragStart', comp, event);
      }
    }
  },
});
