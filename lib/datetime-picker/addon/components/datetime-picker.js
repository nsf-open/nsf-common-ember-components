import Ember from 'ember';
import callAction from 'datetime-picker/utils/call-action';

const { Component, get, set, setProperties, computed, isEmpty } = Ember;

export default Component.extend({
  concatenatedProperties: ['textFieldClassNames'],
  classNames: ['date'],
  classNameBindings: ['showCalendarIcon:input-group'],
  textFieldClassNames: ['form-control'],


  pickerObject: null,
  pickerInstance: null,
  textFieldName: null,
  placeholder: null,
  open: false,
  disabled: false,
  showCalendarIcon: true,
  date: null,
  actionTriggerDateChange: true,


  iconCalendar: 'fa fa-calendar',
  iconTime: 'fa fa-clock-o',
  iconDate: 'fa fa-calendar',
  iconUp: 'fa fa-angle-up',
  iconDown: 'fa fa-angle-down',
  iconPrevious: 'fa fa-angle-left',
  iconNext: 'fa fa-angle-right',
  iconToday: 'fa fa-crosshairs',
  iconClear: 'fa fa-trash',
  iconClose: 'fa fa-remove',

  icons: computed('iconTime', 'iconDate', 'iconUp', 'iconDown', 'iconPrevious',
    'iconNext', 'iconToday', 'iconClear', 'iconClose', function() {
      return {
        time: get(this, 'iconTime'),
        date: get(this, 'iconDate'),
        up: get(this, 'iconUp'),
        down: get(this, 'iconDown'),
        previous: get(this, 'iconPrevious'),
        next: get(this, 'iconNext'),
        today: get(this, 'iconToday'),
        clear: get(this, 'iconClear'),
        close: get(this, 'iconClose'),
      };
    }).readOnly(),


  widgetPositioningVertical: 'auto',
  widgetPositioningHorizontal: 'auto',

  widgetPositioning: computed('widgetPositioningVertical', 'widgetPositioningHorizontal',
    function() {
      return {
        vertical: get(this, 'widgetPositioningVertical'),
        horizontal: get(this, 'widgetPositioningHorizontal'),
      };
    }).readOnly(),


  tooltipToday: 'Go to today',
  tooltipClear: 'Clear selection',
  tooltipClose: 'Close the picker',
  tooltipSelectMonth: 'Select month',
  tooltipPrevMonth: 'Previous month',
  tooltipNextMonth: 'Next month',
  tooltipSelectYear: 'Select year',
  tooltipPrevYear: 'Previous year',
  tooltipNextYear: 'Next year',
  tooltipSelectDecade: 'Select decade',
  tooltipPrevDecade: 'Previous decade',
  tooltipNextDecade: 'Next decade',
  tooltipPrevCentury: 'Previous century',
  tooltipNextCentury: 'Next century',

  tooltips: computed('tooltipToday', 'tooltipClear', 'tooltipClose', 'tooltipSelectMonth',
    'tooltipPrevMonth', 'tooltipNextMonth', 'tooltipSelectYear', 'tooltipPrevYear',
    'tooltipNextYear', 'tooltipSelectDecade', 'tooltipPrevDecade', 'tooltipNextDecade',
    'tooltipPrevCentury', 'tooltipNextCentury', function() {
      return {
        today: get(this, 'tooltipToday'),
        clear: get(this, 'tooltipClear'),
        close: get(this, 'tooltipClose'),
        selectMonth: get(this, 'tooltipSelectMonth'),
        prevMonth: get(this, 'tooltipPrevMonth'),
        nextMonth: get(this, 'tooltipNextMonth'),
        selectYear: get(this, 'tooltipSelectYear'),
        prevYear: get(this, 'tooltipPrevYear'),
        nextYear: get(this, 'tooltipNextYear'),
        selectDecade: get(this, 'tooltipSelectDecade'),
        prevDecade: get(this, 'tooltipPrevDecade'),
        nextDecade: get(this, 'tooltipNextDecade'),
        prevCentury: get(this, 'tooltipPrevCentury'),
        nextCentury: get(this, 'tooltipNextCentury'),
      };
    }).readOnly(),


  format: false, //
  dayViewHeaderFormat: 'MMMM YYYY', //
  extraFormats: false, //
  stepping: 1, //
  minDate: false, //
  maxDate: false, //
  useCurrent: true, //
  collapse: true, //
  defaultDate: false, //
  disabledDates: false, //
  enabledDates: false, //
  useStrict: false, //
  sideBySide: false, //
  daysOfWeekDisabled: [], //
  calendarWeeks: false, //
  viewMode: 'days', //
  toolbarPlacement: 'default', //
  showTodayButton: false, //
  showClear: false, //
  showClose: false, //
  widgetParent: null,
  keepOpen: false, //
  inline: false, //
  keepInvalid: false, //
  debug: false, //
  ignoreReadonly: false, //
  disabledTimeIntervals: false, //
  allowInputToggle: false, //
  focusOnShow: true, //
  enabledHours: false, //
  disabledHours: false, //
  viewDate: false, //


  settableProperties: computed(function() {
    return ['date', 'format', 'stepping', 'dayViewHeaderFormat', 'extraFormats', 'minDate',
      'maxDate', 'useCurrent', 'collapse', 'defaultDate', 'disabledDates', 'enabledDates',
      'useStrict', 'daysOfWeekDisabled', 'calendarWeeks', 'viewMode', 'toolbarPlacement',
      'showTodayButton', 'showClose', 'showClear', 'sideBySide', 'keepOpen', 'inline',
      'keepInvalid', 'debug', 'ignoreReadonly', 'disabledTimeIntervals', 'allowInputToggle',
      'focusOnShow', 'enabledHours', 'disabledHours', 'viewDate'];
  }).readOnly(),


  iconProperties: computed(function() {
    return ['iconCalendar', 'iconTime', 'iconDate', 'iconUp', 'iconDown', 'iconPrevious',
      'iconNext', 'iconToday', 'iconClear', 'iconClose'];
  }).readOnly(),


  tooltipProperties: computed(function() {
    return ['tooltipToday', 'tooltipClose', 'tooltipClear', 'tooltipSelectMonth',
      'tooltipPrevMonth', 'tooltipNextMonth', 'tooltipSelectYear', 'tooltipPrevYear',
      'tooltipNextYear', 'tooltipSelectDecade', 'tooltipNextDecade', 'tooltipSelectCentury',
      'tooltipPrevCentury', 'tooltipNextCentury'];
  }).readOnly(),


  defaultToFalseProperties: computed(function() {
    return ['minDate', 'maxDate', 'defaultDate', 'disabledDates', 'enabledDates', 'enabledHours',
      'disabledHours', 'viewDate'];
  }),


  didInsertElement() {
    this._super(...arguments);

    let target = null;

    if(get(this, 'showCalendarIcon')) {
      target = this.$();
    }
    else {
      target = this.$(`.${get(this, 'textFieldClassNames').join('.')}`);
    }

    const pickerObject = target.datetimepicker(this._buildConfig()),
      pickerInstance = pickerObject.data('DateTimePicker');

    pickerObject.on('dp.hide', e => {
      this.send('onHide', e);
    });

    pickerObject.on('dp.show', () => {
      this.send('onShow');
    });

    pickerObject.on('dp.change', e => {
      this.send('onChange', e);
    });

    pickerObject.on('dp.error', e => {
      this.send('onError', e);
    });

    pickerObject.on('dp.update', e => {
      this.send('onUpdate', e);
    });

    if(get(this, 'open')) {
      pickerInstance.show();
    }

    setProperties(this, {
      pickerObject,
      pickerInstance,
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    get(this, 'pickerObject').off('dp.hide dp.show dp.change dp.error dp.update');
    get(this, 'pickerInstance').destroy();
  },

  didUpdateAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);

    let props = get(this, 'settableProperties').concat(
        get(this, 'iconProperties'),
        get(this, 'tooltipProperties')
      ),
      changed = {};

    // Step 1: Figure out what changed
    for(let key in newAttrs){
      switch(Ember.typeOf(newAttrs[key])) {
        case 'string':
        case 'number':
        case 'boolean': {
          if (newAttrs[key] !== oldAttrs[key]) {
            changed[key] = this._coerceToDefault(key, newAttrs[key]);
          }
          break;
        }
        case 'object': {
          if (newAttrs[key].value !== oldAttrs[key].value) {
            changed[key] = this._coerceToDefault(key, newAttrs[key].value);
          }
          break;
        }
      }
    }

    let iconsUpdated = false,
      tooltipsUpdated = false;

    // Step 2: Apply Changes

    for(let key in changed) {
      if(props.indexOf(key) !== -1) {
        // Date is special in that it gets updated via the picker's onChange event.
        // The didUpdateAttrs method will be called regardless however, so we need to
        // use a flag to distinguish between internal and external changes.
        if(key === 'date' && !get(this, 'actionTriggerDateChange')) {
          get(this, 'pickerInstance')[key](changed[key]);
        }

        // Icons are set in bulk via a single icons object. The `icons` computed
        // property exists to collate the individual property values into a properly
        // formatted object, so we can ignore all `iconXYZ` property changes after the
        // first. In normal usage only a couple attrs will be updated at a time, but this
        // is here for some additional performance gains just in case.
        else if(!iconsUpdated && key.substr(0, 4) === 'icon') {
          get(this, 'pickerInstance').icons(get(this, 'icons'));
          iconsUpdated = true;
        }
        // Tooltips work in the same way as icons.
        else if(!tooltipsUpdated && key.substr(0, 7) === 'tooltip') {
          get(this, 'pickerInstance').tooltips(get(this, 'tooltips'));
          tooltipsUpdated = true;
        }
        // Everything else may proceed as usual.
        else {
          get(this, 'pickerInstance')[key](changed[key]);
        }
      }
    }
  },

  _buildConfig() {
    const props = get(this, 'settableProperties'),
      date = get(this, 'date'),
      result = {
        date,
        icons: get(this, 'icons'),
        tooltips: get(this, 'tooltips'),
        datepickerInput: (`#${get(this, 'elementId')}-input`),
      };

    for(let i = 0; i < props.length; i++) {
      result[props[i]] = this._coerceToDefault(props[i], get(this, props[i]));
    }

    return result;
  },

  _coerceToDefault(name, value) {
    const props = get(this, 'defaultToFalseProperties');

    if(props.indexOf(name) !== -1) {
      if(value === null || isEmpty(value)) {
        return false;
      }
    }

    return value;
  },

  actions: {
    onHide({ date }) {
      callAction(this, 'onHide', date);
    },

    onShow() {
      callAction(this, 'onShow');
    },

    onChange({ date, oldDate }) {
      setProperties(this, {
        date: (date === false) ? null : date,
        actionTriggerDateChange: true,
      });

      callAction(this, 'onChange', date, oldDate);
    },

    onError({ date }) {
      callAction(this, 'onError', date);
    },

    onUpdate({ change, viewDate }) {
      callAction(this, 'onUpdate', change, viewDate);
    },
  },
});
