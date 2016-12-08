import Ember from 'ember';

const { Component, computed, get, getProperties } = Ember;

export default Component.extend({
  tagName: 'nav',

  classNames: ['pagination'],

  attributeBindings: ['ariaLabel:aria-label'],

  ariaLabel: null,

  btnClass: null,

  btnActiveClass: 'active',

  btnDisabledClass: 'disabled',

  currentPage: 1,

  pageCount: 0,

  showPageLinks: true,

  pageLinkCount: 4,


  _currentPage: Ember.computed('currentPage', function() {
    return parseInt(get(this, 'currentPage'));
  }).readOnly(),


  pageNumbers: computed('showPageLinks', 'pageLinkCount', 'pageCount', '_currentPage', function() {
    if(!get(this, 'showPageLinks')){
      return null;
    }

    let start   = 1,
        end     = get(this, 'pageCount'),
        max     = get(this, 'pageLinkCount'),
        current = get(this, '_currentPage'),
        result  = [];

    if(end > max){
      start = current - Math.ceil(max / 2);
      end   = current + Math.floor(max / 2);

      const adjustStart = 1 - start;

      if(adjustStart > 0) {
        start += adjustStart;
        end   += adjustStart;
      }

      const adjustEnd = end - get(this, 'pageCount');

      if(adjustEnd > 0){
        start -= adjustEnd;
        end   -= adjustEnd;
      }
    }

    for(let i = start; i <= end; i++){
      result.push(i);
    }

    return result;
  }).readOnly(),


  actions: {
    firstPage() {
      this.sendAction('firstPage', ...arguments);
    },

    prevPage() {
      this.sendAction('prevPage', ...arguments);
    },

    nextPage() {
      this.sendAction('nextPage', ...arguments);
    },

    lastPage() {
      this.sendAction('lastPage', ...arguments);
    },

    changePage() {
      this.sendAction('changePage', ...arguments);
    },
  },
});
