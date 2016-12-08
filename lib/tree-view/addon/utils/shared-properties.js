import Ember from 'ember';

export default Ember.Object.extend({
  labelField: 'name',
  childField: 'children',
  titleField: 'title',
  descField: 'description',

  descAsHtml: false,

  branchClass: 'tv-branch',
  leafClass: 'tv-leaf',

  branchIconClass: 'fa fa-folder-o',
  leafIconClass: null,
  branchIconCloseClass: 'fa fa-plus-circle',
  branchIconOpenClass: 'fa fa-minus-circle',

  branchClickable: false,
  leafClickable: true,

  branchSelectable: true,
  leafSelectable: true,
  multiSelectable: true,

  branchDraggable: false,
  leafDraggable: true,

  collapsible: true,
  startCollapsed: true,
  collapseOn: 'click',
  collapseTarget: 'wrapper',
  collapseDuration: 250,
});
