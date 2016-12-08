import Ember from 'ember';

export default Ember.Component.extend({
  objectSelectOptions: Ember.computed(function(){
    return [{
      label: 'Option A', value: 'A'
    }, {
      label: 'Option B', value: 'B'
    }, {
      label: 'Option C', value: 'C'
    }];
  }),

  stringSelectOptions: Ember.computed(function(){
    return ['Option A', 'Option B', 'Option C'];
  }),

  promiseSelectOptions: Ember.computed(function(){
    return new Ember.RSVP.Promise(resolve => {
      setTimeout(() => {
        resolve(['Option A', 'Option B', 'Option C']);
      }, 15000);
    });
  }),

  failedPromiseSelectOptions: Ember.computed(function(){
    return new Ember.RSVP.Promise((resolve, reject) => {
      setTimeout(() => {
        reject('An error occurred');
      }, 5000);
    });
  })
});
