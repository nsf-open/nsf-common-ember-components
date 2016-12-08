import Ember from 'ember';
import ComponentParentMixin from 'component-utils/mixins/component-parent';
import TabListItem from './tab-list-item';

export default Ember.Component.extend(ComponentParentMixin, {
    tagName: 'ul',
    ariaRole: 'tabpanel',
    classNames: ['nav', 'nav-tabs'],


    tabs: Ember.computed('children.[]', function() {
        return this.get('children').filter(item => { return item instanceof TabListItem; });
    }).readOnly(),


    selectedTab: null,


    _findSelectedTab() {
        return this.get('tabs').find(item => { return item.get('selected'); });
    },


    _updateSelectedTab(newTab) {
        let currentTab = this.get('selectedTab');

        if(currentTab){
            currentTab.set('selected', false);
        }

        newTab.set('selected', true);
        this.set('selectedTab', newTab);

        let actionValue = newTab.get('value');
        actionValue     = actionValue || newTab.get('_index');

        this.sendAction('action', actionValue);
    },


    init() {
        this._super(...arguments);

        Ember.run.scheduleOnce('afterRender', this, function(){
            this.get('tabs').forEach((item, index) => { item.set('_index', index); });

            let startingTab = this._findSelectedTab();

            if(startingTab){
                this._updateSelectedTab(startingTab);
            }
            else{
                this._updateSelectedTab(this.get('tabs').objectAt(0));
            }
        });
    }
});
