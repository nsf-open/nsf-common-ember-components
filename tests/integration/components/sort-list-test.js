import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';


const testArray = [
  {field1: 'Field E', field2: 1, field3: 'A'},
  {field1: 'Field D', field2: 2, field3: 'A'},
  {field1: 'Field C', field2: 3, field3: 'C'},
  {field1: 'Field B', field2: 4, field3: 'B'},
  {field1: 'Field A', field2: 5, field3: 'B'}
];


const testField1AscValues = 'Field A,Field B,Field C,Field D,Field E',
      testField1DecValues = 'Field E,Field D,Field C,Field B,Field A',
      testField3AscValues = 'A,A,B,B,C',
      testField3DecValues = 'C,B,B,A,A';


const testTemplate = () => {
  return hbs`
    {{#sort-list records=records sortsAreExclusive=sortsAreExclusive as |sorter|}}
      <button type="button" data-test="toggle-field1" onclick={{action sorter.sort 'field1'}}>Toggle</button>
      <button type="button" data-test="toggle-field2" onclick={{action sorter.sort 'field2'}}>Toggle</button>
      <button type="button" data-test="toggle-field3" onclick={{action sorter.sort 'field3'}}>Toggle</button>
    
      <ul>
        {{#each sorter.sortRecords as |item|}}
          <li>
            <span data-test="field1">{{item.field1}}</span>
            <span data-test="field2">{{item.field2}}</span>
            <span data-test="field3">{{item.field3}}</span>
          </li>
        {{/each}}
      </ul>
    {{/sort-list}}
   `;
};


const toggleField1 = (scope) => { return scope.$('button[data-test="toggle-field1"]'); },
      toggleField2 = (scope) => { return scope.$('button[data-test="toggle-field2"]'); },
      toggleField3 = (scope) => { return scope.$('button[data-test="toggle-field3"]'); },
      field1Values = (scope) => { return scope.$('ul li span[data-test="field1"]').map(function(){ return this.textContent.trim(); }).get().join(); },
      field2Values = (scope) => { return scope.$('ul li span[data-test="field2"]').map(function(){ return this.textContent.trim(); }).get().join(); },
      field3Values = (scope) => { return scope.$('ul li span[data-test="field3"]').map(function(){ return this.textContent.trim(); }).get().join(); };


moduleForComponent('sort-list', 'Integration | Component | sort list', {
  integration: true
});


/*
 Just making sure that the component renders.
 */
test('it renders', function(assert) {
  this.render(hbs`{{sort-list}}`);
  assert.equal(this.$().text().trim(), '');

  this.render(hbs`{{#sort-list}}template block text{{/sort-list}}`);
  assert.equal(this.$().text().trim(), 'template block text');
});


/*
 Basic (single property) sorting against a generic array.
 */
test('it sorts an array of objects', function(assert) {
  this.set('records', testArray);
  this.set('sortsAreExclusive', true);

  this.render(testTemplate());

  toggleField1(this).click();
  assert.equal(field1Values(this), testField1AscValues, 'Objects have been sorted in ascending value');

  toggleField1(this).click();
  assert.equal(field1Values(this), testField1DecValues, 'Objects have been sorted in descending value');
});


/*
 Basic (single property) sorting against an ArrayProxy.
 */
test('is sorts an ArrayProxy of objects', function(assert) {
  this.set('records', Ember.ArrayProxy.create({content: testArray}));
  this.set('sortsAreExclusive', true);

  this.render(testTemplate());

  toggleField1(this).click();
  assert.equal(field1Values(this), testField1AscValues, 'Objects have been sorted in ascending value');

  toggleField1(this).click();
  assert.equal(field1Values(this), testField1DecValues, 'Objects have been sorted in descending value');
});


/*
 Multi-dimensional sorting against a generic array.
 */
test('is sorts an array of objects against multiple properties', function(assert) {
  this.set('records', testArray);
  this.set('sortsAreExclusive', false);

  this.render(testTemplate());

  toggleField3(this).click();
  toggleField1(this).click();

  assert.equal(field3Values(this), testField3AscValues, 'Objects have been sorted in ascending value of field 3');
  assert.equal(field1Values(this), 'Field D,Field E,Field A,Field B,Field C', 'Objects have been sub-sorted in ascending value of field 1');
});
