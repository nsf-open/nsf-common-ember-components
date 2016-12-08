import Ember from 'ember';

const { Component, assert, typeOf, get, $ } = Ember;

/**
 * The AnchorTo component lets you simulate the functionality of using
 * an anchor to jump to another area of content within the same document
 * while using [Ember's "hash"](http://emberjs.com/api/classes/Ember.Location.html)
 * location type.
 *
 * A simple example:
 *
 *     {{anchor-to href="#mainContent"}}Jump to content{{anchor-to}}
 *
 *     .
 *     .
 *     .
 *
 *     {{!Further down the page}}
 *     <div id="mainContent">
 *         <p>Hello World!</p>
 *     </div>
 *
 * @class AnchorTo
 * @namespace Components
 * @module anchor-to
 * @submodule components
 * @extends Ember.Component
 * @public
 */
const AnchorTo = Component.extend({
  tagName: 'a',

  attributeBindings: ['href', 'title', 'data-test-id'],

  'data-test-id': 'anchor-to',

  /**
   * The href attribute value for the link. Unlike a normal anchor,
   * this fancy fellow can be any jQuery selector string.
   *
   * @property href
   * @type string
   * @default null
   * @public
   */
  href: null,

  /**
   * An optional title attribute for the link.
   *
   * @property title
   * @type string
   * @default null
   * @public
   */
  title: null,

  /**
   * An optional text property whose value will be used if this
   * component has not been given a content block.
   *
   * @property text
   * @type string
   * @default null
   * @public
   */
  text: null,


  init() {
    this._super(...arguments);

    assert(
      'The href property must be set on an anchor-to component!',
      typeOf(get(this, 'href')) === 'string'
    );
  },


  click() {
    const target = $(get(this, 'href'));
    $('html, body').scrollTop(target.offset().top);

    return false;
  },
});

AnchorTo.reopenClass({
  positionalParams: ['text']
});

export default AnchorTo;
