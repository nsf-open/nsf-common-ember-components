import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  character: DS.attr('string'),
  rank: DS.attr('number'),
  hoursPlayed: DS.attr('number')
});
