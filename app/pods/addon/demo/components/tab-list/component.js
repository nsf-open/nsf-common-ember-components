import Ember from 'ember';

export default Ember.Component.extend({

  selectedTabValue: null,

  tabMessage: Ember.computed('selectedTabValue', function(){
    return `Option ${this.get('selectedTabValue')} is currently selected.`;
  }),

  actions: {
    onTabSelect(value) {
      this.set('selectedTabValue', value);
    }
  }
});
