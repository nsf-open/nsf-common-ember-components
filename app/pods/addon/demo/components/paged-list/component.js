import Ember from 'ember';

const { Component, get } = Ember;

export default Component.extend({
  pageSize: 10,

  currentPage: 1,

  records: Ember.computed(function(){
    const recordSet = Ember.ArrayProxy.create({content: Ember.A([])});

    for(let i = 1; i <= 93; i++){
      recordSet.pushObject(Ember.Object.extend({name: `Record ${i}`}).create());
    }

    return recordSet;
  }),

  actions: {
    addRecord() {
      const records = this.get('records');
      records.pushObject(Ember.Object.extend({name: `New Record ${get(records, 'length')}`}).create());
    }
  }
});
