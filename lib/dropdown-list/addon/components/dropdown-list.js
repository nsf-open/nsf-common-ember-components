import Ember from 'ember';
import ComponentParentMixin from 'component-utils/mixins/component-parent';
import DropdownListToggle from './dropdown-list-toggle';
import DropdownListOptions from './dropdown-list-options';

/**
 * @class DropdownMenu
 * @namespace Components
 * @extends Ember.Component
 */
export default Ember.Component.extend(ComponentParentMixin, {
  classNames: ['dropdown'],

  classNameBindings: ['open'],

  attributeBindings: ['dataTestId:data-test-id'],

  dataTestId: 'dropdown-list',

  open: false,

  closeOnInteraction: true,

  toggle: Ember.computed('children.length', function() {
      return this.get('children').find(item => { return item instanceof DropdownListToggle; });
  }),

  options: Ember.computed('children.length', function() {
      return this.get('children').find(item => { return item instanceof DropdownListOptions; });
  }),

  outsideClickHandler: Ember.computed(function() {
      return (function(self) {
          function clickClose(event) {
            if(self.get('closeOnInteraction') || !self.$().find(event.target).length){
              self.set('open', false);
            }
          }

          Ember.$(document).click(clickClose);

          return function() {
              Ember.$(document).off('click', clickClose);
          };
      }(this));
  }),

  _onDidInsertElement: Ember.on('didInsertElement', function() {
      Ember.run.schedule('sync', this, function() {
          this.get('outsideClickHandler');
      });

      this._super.apply(this, arguments);
  }),

  _onWillDestroyElement: Ember.on('willDestroyElement', function() {
      Ember.run.schedule('sync', this, function() {
          this.get('outsideClickHandler')();
      });

      this._super.apply(this, arguments);
  })
});
