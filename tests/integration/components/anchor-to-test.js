import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('anchor-to', 'Integration | Component | anchor to', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(3);

  this.render(hbs`{{anchor-to 'Scroll Down' href='#someAnchor' title='Scroll to the anchor'}}`);

  let $anchor = this.$('[data-test-id="anchor-to"]');

  assert.equal($anchor.text().trim(), 'Scroll Down', 'The component renders');
  assert.equal($anchor.attr('title'), 'Scroll to the anchor', 'The title attribute is set');
  assert.equal($anchor.attr('href'), '#someAnchor', 'The href attribute is set');
});
