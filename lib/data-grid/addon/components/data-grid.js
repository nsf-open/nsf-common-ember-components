import Ember from 'ember';


export default Ember.Component.extend({
  classNames: ['data-grid'],

  classNameBindings: ['vScrollEnabled:data-grid-v-scroll', 'hScrollEnabled:data-grid-h-scroll'],

  attributeBindings: ['dataTestId:data-test-id'],

  dataTestId: 'data-grid',

  records: null,

  pageSize: 10,

  currentPage: 1,

  sortsAreExclusive: true,

  defaultSortDirection: 'asc',

  ascendingSortValue: null,

  descendingSortValue: null,

  vScrollEnabled: true,

  vScrollRowCount: 5,

  hScrollEnabled: false,

  hScrollColumnCount: 5,


  tableId: Ember.computed('elementId', function(){
    return `${this.get('elementId')}-table`;
  }).readOnly(),


  tableCss: Ember.computed('vScrollEnabled', 'vScrollRowCount', 'tableId', function() {
    return this.computeTableCss();
  }),


  columns: Ember.computed(function() {
    return Ember.ArrayProxy.extend({
      addObject(object) {
        const startLength = this.get('length'),
              receiver    = this._super(object),
              endLength   = this.get('length');

        if(endLength > startLength){
          this.set(`${endLength - 1}`, object);
        }

        return receiver;
      },

      removeObject(object) {
        return this._super(object);
      }
    }).create({content: Ember.A([])});
  }).readOnly(),


  _onRecordsUpdate: Ember.observer('records.[]', function() {
    Ember.run.scheduleOnce('afterRender', this, 'notifyPropertyChange', 'tableCss');
  }),


  didInsertElement() {
    this._super(...arguments);
    Ember.run.next(this, 'notifyPropertyChange', 'tableCss');
  },


  actions: {
    registerColumn(column) {
      Ember.run.schedule('sync', this, () => {
        this.get('columns').addObject(column);
      });
    },

    deregisterColumn(column) {
      Ember.run.schedule('sync', this, () => {
        this.get('columns').removeObject(column);
      });
    },

    columnVisibilityChange(column) {

    },

    onPageChange(currentPage, startIndex, endIndex) {
      Ember.run.scheduleOnce('afterRender', this, 'notifyPropertyChange', 'tableCss');
    }
  },


  computeTableCss() {
    if(!this.$()){
      return null;
    }

    if(!this.get('vScrollEnabled')){
      const $head = this.$('table thead');

      if($head && $head.length) {
        $head.children('tr').css('border-right-width', '');
      }

      return null;
    }

    const { tableId, columns, vScrollRowCount } = this.getProperties(['tableId', 'columns', 'vScrollRowCount']),
      $table  = this.$('table'),
      $head   = this.$('table thead'),
      $body   = this.$('table tbody'),
      $rows   = this.$('table tbody tr'),
      hHeight = $head.height();

    let css = `
        #${tableId} thead{ height: ${hHeight}px; }
        #${tableId} tbody{ top: ${hHeight}px; }
      `;

    css += columns.map(
      (item, idx) => {
        if(item.get('columnWidth')){
          return `
          #${tableId} tbody tr td:nth-child(${idx + 1}), 
          #${tableId} thead tr th:nth-child(${idx + 1}){
            width: ${item.get('columnWidthString')};
          }`;
        }
        else{
          return '';
        }
      }
    ).join('');

    const bHeight = $rows.toArray().slice(0, vScrollRowCount).map(
      row => this.$(row).outerHeight()
    ).reduce(
      (prev, curr) => prev + curr
    );

    css += `
          #${tableId} tbody{height: ${bHeight}px;}
          #${tableId}{height: ${hHeight + bHeight}px;}
        `;

    if($rows.length > vScrollRowCount) {
      Ember.run.next(this, function() {
        if($body.prop('scrollHeight') > $body.height()){
          const nWidth = $body[0].clientWidth,
            sWidth = $body.width() - nWidth;

          $head.children('tr').css('border-right-width', `${sWidth + 1}px`);
        }
      });
    }
    else {
      css += `#${tableId} tbody{overflow: hidden;}`;
      $head.children('tr').css('border-right-width', '');
    }

    return css;
  },















  /*
   columnVisibilityChange(column) {
   const isVisible = column.get('isVisible'),
   width     = column.get('columnWidth'),
   visible   = this.get('columns').filterBy('isVisible'),
   size      = width / visible.length;

   if(isVisible) {

   }
   else {
   visible.forEach(item => {
   item.addInheritedWidth(size);
   });
   }

   this.notifyPropertyChange('tableCss');

   //visibleColumns = this.get('columns').filterBy('isVisible'),
   //length         = visibleColumns.length;





   //const isVisible = column.get('isVisible'),
   //transfer  = this.columnWidthForTransfer(column, isVisible);

   //this.visibleColumns().forEach(item => {
   //if(isVisible) {
   //if(item !== column){
   //item.subtractInheritedWidth(transfer);
   //}
   //}
   //else{
   //item.addInheritedWidth(transfer);
   //}
   //});

   //this.notifyPropertyChange('tableCss');

  },

  fillInUnsetColumnWidths() {
    if(this.get('vScrollEnabled')) {
      const percentage = this.widthForUnsetColumns();

      if(percentage) {
        this.columnsWithoutWidth().setEach('inferredWidth', percentage);
      }
    }
    else {
      this.get('columns').setEach('inferredWidth', null);
    }
  },
  */

  /*
  visibleColumns() {
    return this.get('columns').filterBy('isVisible');
  },


  hiddenColumns() {
    return this.get('columns').filterBy('isVisible', false);
  },
  */


  //columnsWithWidth() {
  //  return this.get('columns').filterBy('columnWidth');
  //},


  //columnsWithoutWidth() {
  //  return this.get('columns').filterBy('columnWidth', null);
  //},

  /*
  widthForUnsetColumns() {
    const areSet = this.columnsWithWidth(),
          notSet = this.columnsWithoutWidth();

    if(notSet.length === 0){
      return null;
    }

    const percent = areSet.mapBy('columnWidth').reduce((a, b) => a + b);
    return (100 - percent) / notSet.length;
  },
  */


  /*
  columnWidthForTransfer(column, isAdding = false) {
    const width  = column.get('columnWidth'),
          length = this.visibleColumns().length;


    console.log(`Dividing ${width} by ${length} equals ${width / length}`)

    return width / length;
  }
  */
});
