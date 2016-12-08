import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'thead',

  tableId: null,

  sorter: null,

  registerColumn: null,

  deregisterColumn: null,

  columnVisibilityChange: null
});
