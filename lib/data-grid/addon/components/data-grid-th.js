import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'th',

  attributeBindings: ['_ariaControls:aria-controls', '_ariaSort:aria-sort', '_tabIndex:tabindex', 'columnWidthString:width'],

  classNameBindings: ['_sortClass', '_sortDirectionClass'],

  label: null,

  tableId: null,

  registerColumn: null,

  deregisterColumn: null,

  columnVisibilityChange: null,

  width: null,

  inferredWidth: 0,

  inheritedWidth: 0,

  sortBy: null,

  sortClass: 'th-sort',

  sortAscClass: 'th-sort-asc',

  sortDescClass: 'th-sort-desc',

  sortProperties: null,

  sorter: null,

  _oldIsVisible: true,


  columnWidth: Ember.computed('width', 'inferredWidth', 'inheritedWidth', function() {
    const width    = this.getNumber(this.get('width')),
          inferW   = this.getNumber(this.get('inferredWidth')),
          inheritW = this.getNumber(this.get('inheritedWidth'));

    if(width || inferW || inheritW){
      return width + inferW + inheritW;
    }

    return null;
  }).readOnly(),


  columnWidthString: Ember.computed('columnWidth', function() {
    return this.get('columnWidth') ? `${this.get('columnWidth')}%` : null;
  }).readOnly(),


  _sortable: Ember.computed('sortBy', function(){
    return !Ember.isEmpty(this.get('sortBy'));
  }).readOnly(),


  _sortRule: Ember.computed('_sortable', 'sortBy', function(){
    if(this.get('_sortable')) {
      return this.get(`sorter.rules.${this.get('sortBy')}`);
    }

    return null;
  }).readOnly(),


  _ariaControls: Ember.computed('_sortable', 'tableId', function(){
    return this.get('_sortable') ? this.get('tableId') : null;
  }).readOnly(),


  _ariaSort: Ember.computed('_sortable', '_sortRule.directionLabel', function(){
    return this.get('_sortable') ? this.get('_sortRule.directionLabel') : null;
  }).readOnly(),


  _tabIndex: Ember.computed('_sortable', function(){
    return this.get('_sortable') ? '0' : null;
  }).readOnly(),


  _sortClass: Ember.computed('_sortable', 'sortClass', function(){
    return this.get('_sortable') ? this.get('sortClass') : null;
  }).readOnly(),


  _sortDirectionClass: Ember.computed('_sortable', 'sortClassAsc', 'sortClassDesc', '_sortRule.direction', function(){
    if(this.get('_sortable') && this.get('_sortRule.direction') !== 'off'){
      return ((this.get('_sortRule.direction') === 'asc') ? this.get('sortAscClass') : this.get('sortDescClass'));
    }

    return null;
  }).readOnly(),


  _onIsVisibleChange: Ember.observer('isVisible', function() {
    if(this.get('isVisible') !== this.get('_oldIsVisible')){
      this.set('_oldIsVisible', this.get('isVisible'));
      this.sendAction('columnVisibilityChange', this);
    }
  }),


  init() {
    this._super(...arguments);
    this.set('_oldIsVisible', this.get('isVisible'));
  },


  click() {
    if(this.get('_sortable')){
      this.get('sorter.sort')(this.get('sortBy'), this.get('sortProperties') || {});
    }
  },


  didInsertElement() {
    this._super(...arguments);
    this.registerColumn(this);

    if(!this.get('isVisible')){
      this.sendAction('columnVisibilityChange', this);
    }
  },


  willDestroyElement() {
    this._super(...arguments);
    this.deregisterColumn(this);
  },


  getNumber(input) {
    if(input === 0 || input === null || input === undefined) {
      return 0;
    }

    if(isNaN(+input)){
      return parseInt(input.replace(/[(px)%]/g, ''))
    }

    return input;
  },


  addInferredWidth(value) {
    this.set('inferredWidth', (this.get('inferredWidth') + value));
  },


  subtractInferredWidth(value) {
    this.set('inferredWidth', (this.get('inferredWidth') - value));
  },


  addInheritedWidth(value) {
    this.set('inheritedWidth', (this.get('inheritedWidth') + value));
  },


  subtractInheritedWidth(value) {
    this.set('inheritedWidth', (this.get('inheritedWidth') - value));
  }
})
