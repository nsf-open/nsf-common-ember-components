import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    const firstNames = ['Mike', 'Garey', 'Tae', 'Rae', 'Juhani', 'Anik'],
          lastNames  = ['Anderson', 'Smith', 'Zaxor', 'Kahn', 'Barnabas', 'Dude'],
          characters = ['Paladin', 'Shaman', 'Dark Elf', 'Barbarian', 'Mage', 'Dwarf'],
          recordSet = [];

    for(let i = 1; i <= 93; i++){
      recordSet.push(Ember.Object.extend({
        firstName : firstNames[Math.floor(Math.random() * 6)],
        lastName  : lastNames[Math.floor(Math.random() * 6)],
        character : characters[Math.floor(Math.random() * 6)],
        rank      : Math.floor(Math.random() * 20),
        hours     : Math.floor(Math.random() * 100)
      }).create());
    }

    return recordSet;
  }
});
