import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dropdown-list', 'Integration | Component | dropdown list', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(6);

  this.render(hbs`{{dropdown-list}}`);
  assert.equal(this.$().text().trim(), '', 'The component renders');

  let toggle = () => { return this.$('[data-test-id="dropdown-list-toggle"]'); },
    options = () => { return this.$('[data-test-id="dropdown-list-options"]'); };

  this.render(hbs`
    {{#dropdown-list as |isOpen|}}
      {{dropdown-list-toggle (if isOpen 'Close' 'Open')}}
      {{#dropdown-list-options}}
        <li>Option A</li>
      {{/dropdown-list-options}}
    {{/dropdown-list}}
  `);

  assert.ok(options().length, 'The options block renders');
  assert.equal(toggle().text().trim(), 'Open', 'The toggle renders');

  toggle().click();

  assert.equal(toggle().text().trim(), 'Close', 'Clicking the toggle sets the dropdown to the "open" state');

  toggle().click();

  assert.equal(toggle().text().trim(), 'Open', 'Clicking the toggle again sets the dropdown to the "close" state');

  this.render(hbs`
    {{#dropdown-list open=true as |isOpen|}}
      {{dropdown-list-toggle (if isOpen 'Close' 'Open')}}
      {{#dropdown-list-options}}
        <li>Option A</li>
      {{/dropdown-list-options}}
    {{/dropdown-list}}
  `);

  assert.equal(toggle().text().trim(), 'Close', 'Rendering the dropdown with "open=true" starts the dropdown in the "open" state');
});
