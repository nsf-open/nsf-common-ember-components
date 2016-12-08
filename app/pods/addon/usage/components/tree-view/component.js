import Ember from 'ember';

export default Ember.Component.extend({
    basicData: Ember.computed(function(){
        return [{
            name: 'Option A'
        }, {
            name: 'Option B'
        }, {
            name: 'Option C',
            children: [{
                name: 'Option C.1'
            }, {
                name: 'Option C.2',
                children: [{
                    name: 'Option C.2.a'
                }]
            }, {
                name: 'Option C.3'
            }]
        }];
    }),

    customData: Ember.computed(function(){
        return [{
            name: 'Option A',
            treeView: {
                disabled: true
            }
        }, {
            name: 'Option B',
            treeView: {
                icon: 'fa fa-file'
            }
        }, {
            name: 'Option C',
            children: [{
                name: 'Option C.1'
            }, {
                name: 'Option C.2',
                children: [{
                    name: 'Option C.2.a'
                }],
                treeView: {
                    collapsible: false,
                    startCollapsed: false
                }
            }, {
                name: 'Option C.3'
            }]
        }];
    })
});