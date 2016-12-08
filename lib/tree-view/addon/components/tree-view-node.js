/* eslint no-param-reassign: ["error", { "props": false }] */
import Ember from 'ember';

const { Component, computed, get, set, isEmpty, defineProperty, run } = Ember;

/**
 *
 *
 * @class TreeViewNode
 * @namespace Components
 * @module tree-view
 * @submodule components
 * @extends Ember.Component
 */
export default Component.extend({
  tagName: 'li',

  dataTestId: Ember.computed('isBranch', function() {
    return this.get('isBranch') ? 'tree-view-branch' : 'tree-view-leaf';
  }).readOnly(),

  data: null,

  sharedProperties: null,

  dataTreeViewNode: true,

  /* ------- Node State Values ------- */
  disabled: false,

  isCollapsed: false,

  depth: 1,

  nextDepth: computed('depth', function() {
    return get(this, 'depth') + 1;
  }).readOnly(),

  isBranch: computed('children.[]', function() {
    return !isEmpty(get(this, 'children'));
  }).readOnly(),

  isLeaf: computed.not('isBranch').readOnly(),

  nodeIsDisabled: computed('data.treeView.disabled', 'disabled', function() {
    return get(this, 'disabled') || get(this, 'data.treeView.disabled');
  }).readOnly(),

  nodeIsClickable: computed('isBranch', 'nodeIsDisabled', 'branchClickable',
    'leafClickable', function() {
      if(!get(this, 'nodeIsDisabled')) {
        return get(this, 'isBranch') ? get(this, 'branchClickable') : get(this, 'leafClickable');
      }

      return false;
    }).readOnly(),

  nodeIsCollapsible: computed('isBranch', 'nodeIsDisabled', 'collapsible', function() {
    return get(this, 'isBranch') && !get(this, 'nodeIsDisabled') && get(this, 'collapsible');
  }).readOnly(),

  nodeIsDraggable: computed('isBranch', 'nodeIsDisabled', 'branchDraggable',
    'leafDraggable', function() {
      if(!get(this, 'nodeIsDisabled')) {
        return get(this, 'isBranch')
          ? (get(this, 'branchDraggable') || null)
          : (get(this, 'leafDraggable') || null);
      }

      return null;
    }).readOnly(),


  /* ------- Computed Class Names ------- */
  nodeClass: computed('isBranch', 'sharedProperties.{branchClass,leafClass}', function() {
    return `${(get(this, 'isBranch')
        ? get(this, 'sharedProperties.branchClass')
        : get(this, 'sharedProperties.leafClass'))}-node`;
  }).readOnly(),

  descriptionClass: computed('nodeClass', function() {
    return `${get(this, 'nodeClass')}-description`;
  }).readOnly(),

  hasDescriptionClass: computed('nodeClass', 'description', function() {
    return get(this, 'description') ? (`${get(this, 'nodeClass')}-with-desc`) : null;
  }).readOnly(),

  wrapperClass: computed('nodeClass', function() {
    return `${get(this, 'nodeClass')}-wrapper`;
  }).readOnly(),

  labelClass: computed('nodeClass', function() {
    return `${get(this, 'nodeClass')}-label`;
  }).readOnly(),

  disabledClass: computed('nodeClass', 'nodeIsDisabled', function() {
    return get(this, 'nodeIsDisabled') ? (`${get(this, 'nodeClass')}-disabled`) : null;
  }).readOnly(),

  clickableClass: computed('nodeClass', 'nodeIsClickable', function() {
    return get(this, 'nodeIsClickable') ? (`${get(this, 'nodeClass')}-clickable`) : null;
  }).readOnly(),

  collapsibleClass: computed('nodeClass', 'nodeIsCollapsible', function() {
    return get(this, 'nodeIsCollapsible') ? (`${get(this, 'nodeClass')}-collapsible`) : null;
  }).readOnly(),

  collapsibleStateClass: computed('collapsibleClass', 'isCollapsed', function() {
    if(get(this, 'collapsibleClass')) {
      return (get(this, 'collapsibleClass') + (get(this, 'isCollapsed') ? '-close' : '-open'));
    }

    return null;
  }).readOnly(),

  draggableClass: computed('nodeClass', 'nodeIsDraggable', function() {
    return get(this, 'nodeIsDraggable') ? (`${get(this, 'nodeClass')}-draggable`) : null;
  }).readOnly(),

  iconWrapperClass: computed('nodeClass', function() {
    return `${get(this, 'nodeClass')}-icon-wrapper`;
  }).readOnly(),

  iconClass: computed('isBranch', 'branchIconClass', 'branchIconOpenClass', 'branchIconCloseClass',
    'leafIconClass', 'nodeIsCollapsible', 'isCollapsed', function() {
      if(get(this, 'isBranch')) {
        if(get(this, 'nodeIsCollapsible')) {
          return get(this, 'isCollapsed')
            ? get(this, 'branchIconCloseClass')
            : get(this, 'branchIconOpenClass');
        }

        return get(this, 'branchIconClass');
      }
      return get(this, 'leafIconClass');
    }).readOnly(),


  /* ------- Interactive/Accessibility State Values ------- */
  nodeTabIndex: computed('nodeIsClickable', 'nodeIsCollapsible', 'collapseTarget', function() {
    if(get(this, 'nodeIsCollapsible')) {
      return get(this, 'collapseTarget') === 'wrapper' ? '0' : null;
    }

    return get(this, 'nodeIsClickable') ? '0' : null;
  }).readOnly(),

  nodeAriaHasPopup: computed('nodeIsCollapsible', 'collapseTarget', function() {
    return get(this, 'nodeIsCollapsible')
      && get(this, 'collapseTarget') === 'wrapper'
        ? 'true' : false;
  }).readOnly(),

  nodeAriaExpanded: computed('nodeIsCollapsible', 'collapseTarget', 'isCollapsed', function() {
    if(get(this, 'nodeIsCollapsible') && get(this, 'collapseTarget') === 'wrapper') {
      return get(this, 'isCollapsed') ? 'false' : 'true';
    }

    return false;
  }).readOnly(),

  iconTabIndex: computed('nodeIsCollapsible', 'collapseTarget', function() {
    return (get(this, 'nodeIsCollapsible')
      && get(this, 'collapseTarget') === 'icon')
        ? '0' : null;
  }).readOnly(),

  iconAriaHasPopup: computed('nodeIsCollapsible', 'collapseTarget', function() {
    return get(this, 'nodeIsCollapsible')
      && get(this, 'collapseTarget') === 'icon'
        ? 'true' : false;
  }).readOnly(),

  iconAriaExpanded: computed('nodeIsCollapsible', 'collapseTarget', 'isCollapsed', function() {
    if(get(this, 'nodeIsCollapsible') && get(this, 'collapseTarget') === 'icon') {
      return get(this, 'isCollapsed') ? 'false' : 'true';
    }

    return false;
  }).readOnly(),


  init() {
    set(this, 'classNameBindings',
      ['nodeClass', 'hasDescriptionClass', 'disabledClass',
        'clickableClass', 'collapsibleClass', 'collapsibleStateClass',
        'draggableClass', 'data.treeView.customClass']
    );

    set(this, 'attributeBindings', ['dataTreeViewNode:data-treeview-node', 'dataTestId:data-test-id']);

    this._super(...arguments);

    this._defineBasicOverride('labelField');
    this._defineBasicOverride('childField');
    this._defineBasicOverride('titleField');
    this._defineBasicOverride('descField');
    this._defineBasicOverride('descAsHtml');
    this._defineBasicOverride('collapsible');
    this._defineBasicOverride('startCollapsed');
    this._defineBasicOverride('collapseOn');
    this._defineBasicOverride('collapseTarget');
    this._defineBasicOverride('collapseDuration');

    this._defineBasicOverride('branchClickable', 'clickable');
    this._defineBasicOverride('leafClickable', 'clickable');
    this._defineBasicOverride('branchDraggable', 'draggable');
    this._defineBasicOverride('leafDraggable', 'draggable');
    this._defineBasicOverride('leafIconClass', 'icon');
    this._defineBasicOverride('branchIconClass', 'icon');
    this._defineBasicOverride('branchIconOpenClass', 'iconOpen');
    this._defineBasicOverride('branchIconCloseClass', 'iconClose');


    defineProperty(this, 'label', computed('labelField', function() {
      return get(this, `data.${get(this, 'labelField')}`);
    }).readOnly());

    defineProperty(this, 'children', computed('childField', function() {
      return get(this, `data.${get(this, 'childField')}`);
    }).readOnly());

    defineProperty(this, 'title', computed('titleField', function() {
      return get(this, `data.${get(this, 'titleField')}`);
    }).readOnly());

    defineProperty(this, 'description', computed('descField', function() {
      return get(this, `data.${get(this, 'descField')}`);
    }).readOnly());

    run.schedule('sync', this, function() {
      if(get(this, 'isBranch') && get(this, 'nodeIsCollapsible')) {
        set(this, 'isCollapsed', get(this, 'startCollapsed'));
      }
    });
  },

  _defineBasicOverride(propName, embeddedPropName, sharedPropName) {
    const embed = embeddedPropName || propName,
      share = sharedPropName || propName;

    defineProperty(this, propName,
      computed(`data.treeView.${embed}`, `sharedProperties.${share}`,
      function() {
        const dataSrc = get(this, `data.treeView.${embed}`);

        if(dataSrc !== undefined) {
          return dataSrc;
        }

        return get(this, `sharedProperties.${share}`);
      }).readOnly());
  },


  click(event) {
    if(this._buildTreeViewEventData(event, 'click')) {
      if(event.treeViewData.triggeredCollapse) {
        this.toggleProperty('isCollapsed');
      }
    }
  },


  keyUp(event) {
    const code = event.keyCode ? event.keyCode : event.which;

    if(code === 13 || code === 32) { // Enter and space bar
      if(this._buildTreeViewEventData(event, 'keyUp')) {
        if(event.treeViewData.triggeredCollapse) {
          this.toggleProperty('isCollapsed');
        }
      }
    }
  },


  focusIn(event) {
    this._buildTreeViewEventData(event, 'focusIn');
  },


  focusOut(event) {
    this._buildTreeViewEventData(event, 'focusOut');
  },


  dragStart(event) {
    this._buildTreeViewEventData(event, 'dragStart');
  },


  _buildTreeViewEventData(event, trigger) {
    if(event.treeViewData || get(this, 'nodeIsDisabled')) {
      return false;
    }

    const attrs = event.target.attributes,
      dataPackage = { component: this };

    let origin = null;

    if(attrs['data-treeview-node-wrapper']) {
      origin = 'wrapper';
    }
    else if(attrs['data-treeview-node-label']) {
      origin = 'label';
    }
    else if(attrs['data-treeview-node-icon-wrapper'] || attrs['data-treeview-node-icon']) {
      origin = 'icon';
    }
    else {
      return false; // Well it had to come from somewhere!
    }

    dataPackage.eventSource = origin;

    if(get(this, 'nodeIsCollapsible')) {
      const collapseOn = get(this, 'collapseOn'),
        target = get(this, 'collapseTarget'),
        meetsOn = collapseOn === 'click' && (trigger === 'click' || trigger === 'keyUp'),
        meetsTarget = target === 'wrapper' || (target === 'icon' && origin === 'icon');

      if(meetsOn && meetsTarget) {
        dataPackage.triggeredCollapse = true;
        dataPackage.willCollapse = !get(this, 'isCollapsed');
      }
    }

    event.treeViewData = dataPackage;
    return true;
  },
});
