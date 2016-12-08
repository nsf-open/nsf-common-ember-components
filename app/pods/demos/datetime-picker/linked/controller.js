import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    startDate: null,

    endDate: null,

    rightNow: Ember.computed(function(){
        return moment();
    }).readOnly(),

    actions: {
        onStartDateChange(date) {
            if(date === false){
                this.set('endDate', null);
            }
        }
    }
});
