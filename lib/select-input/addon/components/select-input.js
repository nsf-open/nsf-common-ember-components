import Ember from 'ember';
import DS from 'ember-data';


/**
 * The SelectInput component Ember-izes the &lt;select&gt; element with custom functionality and styling.
 */
export default Ember.Component.extend({
    classNames: ['select-input', 'form-group'],
    classNameBindings: ['isError:has-error'],

    /**
     * If set, the prompt string will appear as the first option of the select dropdown. No value will be set.
     *
     * @property prompt
     * @type string
     * @default null
     */
    prompt: null,

    /**
     * The property name of each object provided to `options` whose value will be used as the `value` attribute of the
     * generated `option` element.
     *
     * @property valueField
     * @type string
     * @default value
     */
    valueField: 'value',

    /**
     * The property name of each object provided to `options` whose value will be used as the text of the generated
     * `option` element.
     *
     * @property textField
     * @type string
     * @default label
     */
    textField: 'label',

    /**
     *
     */
    options: null,

    /**
     *
     */
    selected: null,

    /**
     * A boolean indicating whether the select element is disabled.
     *
     * @property disabled
     * @type boolean
     * @default false
     */
    disabled: false,


    loadingMessage: 'One Moment...',
    loadingIcon: 'fa fa-spinner fa-spin',
    isLoading: false,

    errorMessage: null,
    errorIcon: 'fa fa-exclamation-triangle',
    isError: false,


    caretIcon: 'fa fa-caret-down',


    label: null,
    labelSrOnly: false,


    /**
     *
     * @property selectId
     * @type string
     * @readOnly
     */
    selectId: Ember.computed('elementId', function(){
        return `${this.get('elementId')}-select`;
    }).readOnly(),


    /**
     *
     */
    _options: Ember.computed('options', 'prompt', function(){
        let options = this.get('options'),
            results = [];

        this.setProperties({
            isError: false,
            errorMessage: null
        });

        if(options instanceof Ember.RSVP.Promise || options instanceof DS.PromiseArray || options instanceof DS.PromiseObject){
            Ember.run.scheduleOnce('sync', this, () => {
                this.setProperties({
                    isLoading: true,
                    disabled: true
                });
            });

            options.then(
                success => {
                    this.setProperties({
                        isLoading: false,
                        disabled: false,
                        options: success
                    });
                },
                fault => {
                    this.setProperties({
                        isLoading: false,
                        disabled: false,
                        isError: true,
                        errorMessage: fault
                    });
                }
            );
        }
        else{
            let prompt   = this.get('prompt'),
                text     = this.get('textField'),
                value    = this.get('valueField');

            if(options){
                if(options instanceof DS.RecordArray){
                    results = options.map(item => { return {text: item.get(text), value: item.get(value)}; });
                }
                else if(Ember.isArray(options) && options.length){
                    if(options[0] instanceof Ember.Object){
                        results = options.map(item => { return {text: item.get(text), value: item.get(value)}; });
                    }
                    else if(Ember.typeOf(options[0]) === 'string'){
                        results = options.map(item => { return {text: item, value: item}; });
                    }
                    else{
                        results = options.map(item => { return {text: item[text], value: item[value]}; });
                    }
                }
                else if(options instanceof Ember.Object){
                    results = [{text: options.get(text), value: options.get(value)}];
                }
                else if(Ember.typeOf(options) === 'string'){
                    results = [{text: options, value: options}];
                }
                else{
                    results = [{text: options[text], value: options[value]}];
                }
            }

            if(prompt){
                results.unshift({text: prompt, value: null});
            }
        }

        return results;
    }).readOnly(),

    actions: {
        onChange() {
            let selected = this.get('_options')[this.$('option:selected').index()];

            if(selected){
                this.set('selected', selected.value);
            }
            else{
                this.set('selected', null);
            }

            this.sendAction('action', selected.value);
        }
    }
});
