import Ember from 'ember';
import moment from 'moment';

const PickerPropertyMixin = Ember.Mixin.create({
    field          : null,
    isArrayField   : false,
    pickerPropName : null,
    pickerDefault  : null,


    picker: Ember.computed('field', function(){
        let value = this.get('field');

        if(Ember.isNone(value) || Ember.isEmpty(value)){
            return this.get('pickerDefault');
        }
        else{
            if(value === 'true'){
                return true;
            }
            else if( value === 'false'){
                return false;
            }
            else if(this.get('isArrayField')){
                return value.split('\n');
            }

            return value;
        }
    }).readOnly(),


    pretty: Ember.computed('picker', function(){
        let value  = this.get('picker'),
            type   = Ember.typeOf(value),
            result = `${this.get('pickerPropName')}=`;

        switch(type){
            case 'string': {
                return result + `"${value}"`;
            }
            case 'boolean':
            case 'number': {
                return result + `${value}`;
            }
            case 'array': {
                return result + this.prettyPrintArray(value, Ember.typeOf(value[0]) == 'string');
            }
            default: {
                if(moment.isMoment(value)){
                    return result + `"${value.format()}"`;
                }

                return result + `${value}`;
            }
        }
    }).readOnly(),


    prettyPrintArray(input, asStrings = true) {
        let output = [];

        for(let i = 0; i < input.length; i++){
            if(asStrings){
                output.push(`"${input[i]}"`);
            }
            else{
                output.push(`${input[i]}`);
            }
        }

        return "[" + output.join(', ') + "]";
    }
});

export default Ember.Component.extend({
    format: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'format',
            pickerDefault: false
        }).create();
    }),


    extraFormats: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'extraFormats',
            pickerDefault: false,
            isArrayField: true
        }).create();
    }),


    dayViewHeaderFormat: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'MMMM YYYY',
            pickerPropName: 'dayViewHeaderFormat',
            pickerDefault: 'MMMM YYYY'
        }).create()
    }),


    useStrict: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'useStrict',
            pickerDefault: false
        }).create();
    }),


    defaultDate: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'defaultDate',
            pickerDefault: false
        }).create();
    }),


    useCurrent: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'true',
            pickerPropName: 'useCurrent',
            pickerDefault: true
        }).create();
    }),


    viewDate: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'viewDate',
            pickerDefault: false
        }).create();
    }),


    minDate: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'minDate',
            pickerDefault: false
        }).create();
    }),


    maxDate: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'maxDate',
            pickerDefault: false
        }).create();
    }),


    daysOfWeekDisabled: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: {
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false
            },

            pickerPropName: 'daysOfWeekDisabled',
            pickerDefault: [],

            picker: Ember.computed('field.{sunday,monday,tuesday,wednesday,thursday,friday,saturday}', function(){
                let results = [],
                    order   = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

                for(let i = 0; i < order.length; i ++){
                    if(this.get(`field.${order[i]}`)){
                        results.push(i);
                    }
                }

                return results;
            }).readOnly()
        }).create();
    }),


    disabledDates: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'disabledDates',
            pickerDefault: false,
            isArrayField: true
        }).create();
    }),


    enabledDates: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'enabledDates',
            pickerDefault: false,
            isArrayField: true
        }).create();
    }),


    disabledHours: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'disabledHours',
            pickerDefault: false,
            isArrayField: true
        }).create();
    }),


    enabledHours: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            pickerPropName: 'enabledHours',
            pickerDefault: false,
            isArrayField: true
        }).create();
    }),


    viewMode: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'days',
            pickerPropName: 'viewMode',
            pickerDefault: 'days'
        }).create();
    }),


    toolbarPlacement: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'default',
            pickerPropName: 'toolbarPlacement',
            pickerDefault: 'default'
        }).create();
    }),


    stepping: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 1,
            pickerPropName: 'stepping',
            pickerDefault: 1
        }).create();
    }),


    collapse: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: true,
            pickerPropName: 'collapse',
            pickerDefault: true
        }).create();
    }),


    calendarWeeks: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'calendarWeeks',
            pickerDefault: false
        }).create();
    }),


    showTodayButton: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'showTodayButton',
            pickerDefault: false
        }).create();
    }),


    showClose: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'showClose',
            pickerDefault: false
        }).create();
    }),


    showClear: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'showClear',
            pickerDefault: false
        }).create();
    }),


    sideBySide: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'sideBySide',
            pickerDefault: false
        }).create();
    }),


    keepOpen: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'keepOpen',
            pickerDefault: false
        }).create();
    }),


    inline: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'inline',
            pickerDefault: false
        }).create();
    }),


    keepInvalid: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'keepInvalid',
            pickerDefault: false
        }).create();
    }),


    debug: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'debug',
            pickerDefault: false
        }).create();
    }),


    ignoreReadonly: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'ignoreReadonly',
            pickerDefault: false
        }).create();
    }),


    allowInputToggle: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'allowInputToggle',
            pickerDefault: false
        }).create();
    }),


    focusOnShow: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: false,
            pickerPropName: 'focusOnShow',
            pickerDefault: false
        }).create();
    }),


    iconCalendar: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-calendar',
            pickerPropName: 'iconCalendar',
            pickerDefault: 'fa fa-calendar'
        }).create();
    }),


    iconTime: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-clock-o',
            pickerPropName: 'iconTime',
            pickerDefault: 'fa fa-clock-o'
        }).create();
    }),


    iconDate: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-calendar',
            pickerPropName: 'iconDate',
            pickerDefault: 'fa fa-calendar'
        }).create();
    }),


    iconUp: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-angle-up',
            pickerPropName: 'iconUp',
            pickerDefault: 'fa fa-angle-up'
        }).create();
    }),


    iconDown: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-angle-down',
            pickerPropName: 'iconDown',
            pickerDefault: 'fa fa-angle-down'
        }).create();
    }),


    iconPrevious: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-angle-left',
            pickerPropName: 'iconPrevious',
            pickerDefault: 'fa fa-angle-left'
        }).create();
    }),


    iconNext: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-angle-right',
            pickerPropName: 'iconNext',
            pickerDefault: 'fa fa-angle-right'
        }).create();
    }),


    iconToday: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-crosshairs',
            pickerPropName: 'iconToday',
            pickerDefault: 'fa fa-crosshairs'
        }).create();
    }),


    iconClear: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-trash',
            pickerPropName: 'iconClear',
            pickerDefault: 'fa fa-trash'
        }).create();
    }),


    iconClose: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'fa fa-remove',
            pickerPropName: 'iconClose',
            pickerDefault: 'fa fa-remove'
        }).create();
    }),


    tooltipToday: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Go to today',
            pickerPropName: 'tooltipToday',
            pickerDefault: 'Go to today'
        }).create();
    }),


    tooltipClose: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Close the picker',
            pickerPropName: 'tooltipClose',
            pickerDefault: 'Close the picker'
        }).create();
    }),


    tooltipClear: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Clear selection',
            pickerPropName: 'tooltipClear',
            pickerDefault: 'Clear selection'
        }).create();
    }),


    tooltipSelectMonth: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Select month',
            pickerPropName: 'tooltipSelectMonth',
            pickerDefault: 'Select month'
        }).create();
    }),


    tooltipPrevMonth: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Previous month',
            pickerPropName: 'tooltipPrevMonth',
            pickerDefault: 'Previous month'
        }).create();
    }),


    tooltipNextMonth: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Next month',
            pickerPropName: 'tooltipNextMonth',
            pickerDefault: 'Next month'
        }).create();
    }),


    tooltipSelectYear: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Select year',
            pickerPropName: 'tooltipSelectYear',
            pickerDefault: 'Select year'
        }).create();
    }),


    tooltipPrevYear: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Previous year',
            pickerPropName: 'tooltipPrevYear',
            pickerDefault: 'Previous year'
        }).create();
    }),


    tooltipNextYear: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Next year',
            pickerPropName: 'tooltipNextYear',
            pickerDefault: 'Next year'
        }).create();
    }),


    tooltipSelectDecade: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Select decade',
            pickerPropName: 'tooltipSelectDecade',
            pickerDefault: 'Select decade'
        }).create();
    }),


    tooltipPrevDecade: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Previous decade',
            pickerPropName: 'tooltipPrevDecade',
            pickerDefault: 'Previous decade'
        }).create();
    }),


    tooltipNextDecade: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Next decade',
            pickerPropName: 'tooltipNextDecade',
            pickerDefault: 'Next decade'
        }).create();
    }),


    tooltipSelectCentury: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Select century',
            pickerPropName: 'tooltipSelectCentury',
            pickerDefault: 'Select century'
        }).create();
    }),


    tooltipPrevCentury: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Previous century',
            pickerPropName: 'tooltipPrevCentury',
            pickerDefault: 'Previous century'
        }).create();
    }),


    tooltipNextCentury: Ember.computed(function(){
        return Ember.Object.extend(PickerPropertyMixin, {
            field: 'Next century',
            pickerPropName: 'tooltipNextCentury',
            pickerDefault: 'Next century'
        }).create();
    }),


    actions: {
        onMinDateChange(date) {
            this.set('minDate.field', date);
        },

        onMaxDateChange(date) {
            this.set('maxDate.field', date);
        },

        onDefaultDateChange(date) {
            this.set('defaultDate.field', date);
        },

        onViewDateChange(date) {
            this.set('viewDate.field', date);
        }
    }
});