import Ember from 'ember';
import ComponentChildMixin from 'component-utils/mixins/component-child';

const TabListItem = Ember.Component.extend(ComponentChildMixin, {
    tagName: 'li',
    classNames: ['nav-item'],

    disabled: false,
    selected: false,

    text: null,
    value: null,

    _index: null,

    actions: {
        select() {
            if(!this.get('selected') && !this.get('disabled')){
                this.get('targetParent')._updateSelectedTab(this);
            }
        }
    }
});

TabListItem.reopenClass({
    positionalParams: ['text']
});

export default TabListItem;
