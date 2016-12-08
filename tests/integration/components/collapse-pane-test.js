import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('collapse-pane', 'Integration | Component | collapse pane', {
    integration: true
});

test('it renders', function(assert) {
  let toggle = () => { return this.$('[data-test-id="collapse-pane-toggle"]'); },
    body = () => { return this.$('[data-test-id="collapse-pane-body"]') };

  this.render(hbs`
    {{#collapse-pane}}
      {{collapse-pane-toggle text="Toggle Me"}}
      {{#collapse-pane-body duration=0}}
        <p>Lorem Ipsum</p>
      {{/collapse-pane-body}}
    {{/collapse-pane}}
  `);

  assert.equal(toggle().text().trim(), 'Toggle Me', 'The toggle rendered');
  assert.equal(body().text().trim(), 'Lorem Ipsum', 'The body rendered');

  toggle().trigger('click');

  return wait().then(() => {
    assert.equal(body().css('display'), 'none', 'Clicking the toggle hid the body');
  });
});
