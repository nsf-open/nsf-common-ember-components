import Ember from 'ember';

const { Component, Object, computed, typeOf, isEmpty, get, set, setProperties } = Ember;


export default Component.extend({
  records: null,

  sortsAreExclusive: true,

  defaultDirection: 'asc',

  ascendingValue: null,

  descendingValue: null,


  ruleIndex: computed(function() {
    return [];
  }).readOnly(),


  ruleOrder: computed(function() {
    return [];
  }).readOnly(),


  sortRecords: computed('records.[]', function() {
    return this.recomputeSort();
  }).readOnly(),


  rules: computed(function(){
    return Object.extend({
      unknownProperty(property) {
        const rule = Object.extend(
          {
            property: null,

            sortOn: null,

            subSort: null,

            subSortPin: null,

            direction: 'off',

            startDirection: null,

            isNew: true,

            order: 0,

            ascendingValue: null,

            descendingValue: null,

            isAscending: computed('direction', function() {
              return get(this, 'direction') === 'asc';
            }).readOnly(),

            isDescending: computed('direction', function() {
              return get(this, 'direction') === 'desc';
            }).readOnly(),

            isOff: computed('isAscending', 'isDescending', function() {
              return !get(this, 'isAscending') && !get(this, 'isDescending');
            }).readOnly(),

            directionLabel: computed('isAscending', 'isOff', function() {
              if(get(this, 'isOff')){
                return null;
              }

              return this.get('isAscending') ? 'ascending' : 'descending';
            }).readOnly(),

            value: computed('ascendingValue', 'descendingValue', 'isAscending', 'isOff', function() {
              if(get(this, 'isOff')){
                return null;
              }

              return get(this, 'isAscending') ? get(this, 'ascendingValue') : get(this, 'descendingValue');
            }).readOnly(),

            subSortArray: computed('subSort', function() {
              const subSort = get(this, 'subSort');

              if(!isEmpty(subSort)){
                return subSort.split(',').map(item => { return item ? item.trim() : item; });
              }

              return null;
            }).readOnly(),

            subSortPinArray: computed('subSortPin', function() {
              const subSortPin = get(this, 'subSortPin');

              if(!isEmpty(subSortPin)){
                return subSortPin.split(',').map(item => { return item ? item.trim().toLowerCase() : item; });
              }

              return null;
            }).readOnly(),

            toggleDirection() {
              const newDir = get(this, 'direction');

              if(newDir === 'asc') {
                set(this, 'direction', 'desc');
              }
              else if(newDir === 'desc') {
                set(this, 'direction', 'asc');
              }
              else {
                set(this, 'direction', get(this, 'startDirection'));
              }
            }
          }
        ).create({property});

        set(this, property, rule);
        return rule;
      }
    }).create();
  }),





  updateSortCriteria(property, {direction = null, sortOn = null,
    subSort = null, subSortPin = null, ascendingValue = null,
    descendingValue = null, deferSort = false} = {}) {
      const rule  = get(this, `rules.${property}`),
            isNew = get(rule, 'isNew'),
            order = get(this, 'ruleOrder');

      if(isNew) {
        setProperties(rule, {
          startDirection : direction || get(this, 'defaultDirection'),
          direction      : direction || get(this, 'defaultDirection'),
          sortOn         : sortOn || property,
          isNew          : false
        });

        get(this, 'ruleIndex').push(property);
      }

      setProperties(rule, {
        ascendingValue  : ascendingValue || get(this, 'ascendingValue'),
        descendingValue : descendingValue || get(this, 'descendingValue'),
        subSort         : subSort,
        subSortPin      : subSortPin
      });

      if(direction) {
        set(rule, 'direction', direction);
      }
      else {
        if(!isNew){
          rule.toggleDirection();
        }
      }

      if(get(this, 'sortsAreExclusive')) {
        order.forEach(item => {
          if(item !== property){
            set(this, `rules.${item}.direction`, 'off');
            set(this, `rules.${item}.order`, 0);
          }
        });

        order.length = 0;
        order.push(property);
        set(rule, 'order', 1);
      }
      else {
        const index = order.indexOf(property);

        if(index === -1) {
          order.push(property);
          set(rule, 'order', order.length);
        }
      }

      if(!deferSort){
        this.notifyPropertyChange('sortRecords');
      }
  },


  recomputeSort() {
    const order = get(this, 'ruleOrder'),
          rules = [];

    for(let i = 0; i < order.length; i++) {
      rules.push(get(this, `rules.${order[i]}`));
    }

    return get(this, 'records').slice().sort((a, b) => {
      let result = 0, c0, c1, subSort, subSortPin, subSortPinDir;

      for(let i = 0; i < rules.length; i++) {
        c0 = get(a, get(rules[i], 'sortOn'));
        c1 = get(b, get(rules[i], 'sortOn'));

        if(c0 < c1) {
          result = get(rules[i], 'isAscending') ? -1 : 1;
          break;
        }

        if(c0 > c1) {
          result = get(rules[i], 'isAscending') ? 1 : -1;
          break;
        }

        subSort = get(rules[i], 'subSortArray');

        // If the first order sort is equal we will dive into second order sorts.
        if(subSort) {
          subSortPin = get(rules[i], 'subSortPinArray');

          for(let x = 0; x < subSort.length; x++) {
            c0 = get(a, subSort[x]);
            c1 = get(b, subSort[x]);

            subSortPinDir = (subSortPin && subSortPin.length > x) ? subSortPin[x] : get(rules[i], 'direction');

            if(c0 < c1){
              result = (subSortPinDir === 'asc') ? -1 : 1;
              break;
            }

            if(c0 > c1){
              result = (subSortPinDir === 'asc') ? 1 : -1;
              break;
            }
          }
        }
      }

      return result;
    });
  },


  actions: {
    sort(property, options = {}) {
      const prop = typeOf(property)  === 'string'  ? property  : null,
            opts = (options instanceof Event)? {} : options;

      if(prop){
        this.updateSortCriteria(prop, opts);
      }

      return false;
    },


    cancel(property) {
      const order = get(this, 'ruleOrder'),
            index = order.indexOf(property);

      if(index !== -1){
        order.splice(index, 1);

        set(this, `rules.${property}.direction`, 'off');
        set(this, `rules.${property}.order`, 0);

        order.forEach((item, index) => {
          set(this, `rules.${item}.order`, (index + 1));
        });

        if(order.length){
          this.notifyPropertyChange('sortRecords');
        }
      }

      return false;
    }
  }
});
