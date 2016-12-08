import Ember from 'ember';

export default Ember.Controller.extend({
  pageSizeOptions: Ember.computed(function() {
    return [{
      label: 'Show 5', value: 5
    },{
      label: 'Show 10', value: 10
    }, {
      label: 'Show 25', value: 25
    }, {
      label: 'Show 50', value: 50
    }, {
      label: 'Show All', value: 10000
    }];
  }),

  pageSize: 10,

  vScrollEnabled: true,

  actions: {
    onPageSizeChange(value) {
      this.set('pageSize', value);
    },

    onModelRefresh() {
      this.get('target.router').refresh();
    }
  }
});
