import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),

  maxRank: 20,

  maxHoursPlayed: 200,


  firstNames: Ember.computed(function() {
    return ['Mike', 'Garey', 'Tae', 'Rae', 'Juhani', 'Anik'];
  }).readOnly(),


  lastNames: Ember.computed(function() {
    return ['Anderson', 'Smith', 'Zaxor', 'Kahn', 'Barnabas', 'Dude'];
  }).readOnly(),


  characters: Ember.computed(function() {
    return ['Paladin', 'Shaman', 'Dark Elf', 'Barbarian', 'Mage', 'Dwarf'];
  }).readOnly(),


  records: Ember.computed(function() {
    const recordSet  = [];

    for(let i = 0; i < 93; i++){
      recordSet.push(this.generateRecord());
    }

    return recordSet;
  }),


  dsRecords: Ember.computed(function() {
    return this.get('store').peekAll('user');
  }),


  init() {
    this._super(...arguments);

    for(let i = 0; i < 93; i++) {
      this.get('store').createRecord('user', this.generateRecord());
    }
  },


  generateRecord() {
    const { firstNames, lastNames, characters } = this.getProperties(['firstNames', 'lastNames', 'characters']);

    return {
      firstName   : firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName    : lastNames[Math.floor(Math.random() * lastNames.length)],
      character   : characters[Math.floor(Math.random() * characters.length)],
      rank        : Math.floor(Math.random() * this.get('maxRank')),
      hoursPlayed : Math.floor(Math.random() * this.get('maxHoursPlayed'))
    };
  }
});
