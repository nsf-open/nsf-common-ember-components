import Ember from 'ember';

const { Component, computed, get, getProperties, set, isArray } = Ember;

export default Component.extend({
  records: null,

  pageSize: 10,

  currentPage: 1,


  _pageSize: Ember.computed('pageSize', function() {
    return parseInt(get(this, 'pageSize'));
  }).readOnly(),


  _currentPage: Ember.computed('currentPage', function() {
    return parseInt(get(this, 'currentPage'));
  }).readOnly(),


  recordCount: computed('records.[]', function() {
    const records = get(this, 'records');
    return isArray(records) ? get(records, 'length') : 0;
  }).readOnly(),


  pageCount: computed('recordCount', '_pageSize', function() {
    return Math.ceil(get(this, 'recordCount') / get(this, '_pageSize'));
  }).readOnly(),


  isPaged: computed('pageCount', function() {
    return this.get('pageCount') > 1;
  }).readOnly(),


  startIndex: computed('recordCount', '_pageSize', '_currentPage', function() {
    const recordCount = get(this, 'recordCount'),
      pageSize = get(this, '_pageSize'),
      currentPage = get(this, '_currentPage');

    if(!recordCount) {
      return 0;
    }
    else if(recordCount <= pageSize) {
      return 1;
    }
    else {
      return currentPage === 1 ? 1 : (pageSize * (currentPage - 1)) + 1;
    }
  }).readOnly(),


  endIndex: computed('recordCount', '_pageSize', 'startIndex', function() {
    const recordCount = get(this, 'recordCount'),
      pageSize = get(this, '_pageSize'),
      startIndex = get(this, 'startIndex');

    if(!recordCount){
      return 0;
    }
    else if(recordCount <= pageSize) {
      return recordCount;
    }
    else {
      const result = parseInt(startIndex) + parseInt(pageSize) - 1;

      if(result > recordCount) {
        return (startIndex + (recordCount % pageSize)) - 1;
      }

      return result;
    }
  }).readOnly(),


  hasPrevPage: computed('_currentPage', function() {
    return get(this, '_currentPage') > 1;
  }).readOnly(),


  hasNextPage: computed('_currentPage', 'pageCount', function() {
    return get(this, '_currentPage') < get(this, 'pageCount');
  }).readOnly(),


  noPrevPage: computed.not('hasPrevPage'),


  noNextPage: computed.not('hasNextPage'),


  pageRecords: computed('records.[]', 'startIndex', 'endIndex', function() {
    const { records, startIndex, endIndex } = getProperties(this, ['records', 'startIndex', 'endIndex']);

    if(!startIndex && !endIndex){
      return null;
    }
    else{
      return records.filter((item, index) => {
        return index >= (startIndex - 1) && index <= (endIndex - 1);
      });
    }
  }).readOnly(),


  didUpdateAttrs({newAttrs, oldAttrs}) {
    if(newAttrs.pageSize){
      if(oldAttrs.pageSize && newAttrs.pageSize.value !== oldAttrs.pageSize.value){
        this.set('currentPage', 1);
      }
    }

    this._super(...arguments);
  },


  dispatchChangeAction() {
    this.sendAction('onPageChange', get(this, 'currentPage'), get(this, 'startIndex'), get(this, 'endIndex'));
  },


  actions: {
    nextPage() {
      if(get(this, 'hasNextPage')){
        this.incrementProperty('currentPage');
        this.dispatchChangeAction();
      }
    },

    prevPage() {
      if(get(this, 'hasPrevPage')){
        this.decrementProperty('currentPage');
        this.dispatchChangeAction();
      }
    },

    firstPage() {
      if(get(this, 'currentPage') > 1){
        set(this, 'currentPage', 1);
        this.dispatchChangeAction();
      }
    },

    lastPage() {
      if(get(this, 'currentPage') < get(this, 'pageCount')){
        set(this, 'currentPage', get(this, 'pageCount'));
        this.dispatchChangeAction();
      }
    },

    changePage(index) {
      if(index > 0 && index <= get(this, 'pageCount')){
        set(this, 'currentPage', index);
        this.dispatchChangeAction();
      }
    },

    changePageSize(value) {
      if(get(this, 'pageSize') !== value){
        set(this, 'pageSize', value);
        this.dispatchChangeAction();
      }
    }
  },
});
