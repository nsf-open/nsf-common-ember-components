import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',

  attributeBindings: ['_tableSummary:summary'],

  records: null,

  sorter: null,

  summary: null,

  registerColumn: null,

  deregisterColumn: null,

  columnVisibilityChange: null,

  _computedSummary: Ember.computed(function() {
    return null;
  }).readOnly(),

  _tableSummary: Ember.computed('summary', '_computedSummary', function() {
    const summary = this.get('summary');
    return !Ember.isEmpty(summary) ? summary : this.get('_computedSummary');
  }).readOnly()
});
