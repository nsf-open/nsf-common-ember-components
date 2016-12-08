import Ember from 'ember';

const { Component, computed, get, run } = Ember;

/**
 *
 * @class TreeViewBranch
 * @namespace Components
 * @module tree-view
 * @submodule components
 * @extends Ember.Component
 */
export default Component.extend({
  tagName: 'ul',

  classNameBindings: ['sharedProperties.branchClass', 'depthClass'],

  isCollapsed: false,

  collapseDuration: 250,

  disabled: false,

  sharedProperties: null,

  depth: 1,

  depthClass: computed('sharedProperties.branchClass', 'depth', function() {
    return `${get(this, 'sharedProperties.branchClass')}-depth-${get(this, 'depth')}`;
  }),

  didInsertElement() {
    this._super(...arguments);

    run.scheduleOnce('afterRender', this, function() {
      if(get(this, 'isCollapsed')) {
        this.$().slideUp({ duration: 0 });
      }
      else {
        this.$().slideDown({ duration: 0 });
      }
    });
  },

  didUpdateAttrs(props) {
    if(props.oldAttrs.isCollapsed.value !== props.newAttrs.isCollapsed.value) {
      if(props.newAttrs.isCollapsed.value) {
        this.$().slideUp({ duration: get(this, 'collapseDuration') });
      }
      else {
        this.$().slideDown({ duration: get(this, 'collapseDuration') });
      }
    }
  },
});
