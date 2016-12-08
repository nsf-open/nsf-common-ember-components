import Ember from 'ember';

export default Ember.Component.extend({
    treeData: [{
        name: 'Option A',
        children: [{
            name: 'Option A.1',
            description: 'This is a brief description of what Option A.1 has to offer you. Option A.1 is a great option. You will be happy you picked it... no remorse here, none at all.'
        }, {
            name: 'Option A.2'
        }, {
            name: 'Option A.3',
            treeView: {
                startCollapsed: true
            },
            children: [{
                name: 'Option A.3.a'
            }, {
                name: 'Option A.3.b'
            }]
        }, {
            name: 'Option A.4'
        }]
    }, {
        name: 'Option B',
        children: [{
            name: 'Option B.1'
        }, {
            name: 'Option B.2'
        }]
    }],

    actionLog: Ember.computed(function(){
        return Ember.ArrayProxy.create({content: Ember.A([])});
    }),

    actions: {
        leafClick(component, withKey) {
            this.get('actionLog').unshiftObject(`<code>Click</code> with ${withKey? 'keyboard': 'mouse'} on leaf ${component.get('data.name')}`);
        },

        branchToggle(component, withKey) {
            this.get('actionLog').unshiftObject(`<code>Toggle</code> with ${withKey? 'keyboard': 'mouse'} on branch ${component.get('data.name')}`);
        },

        nodeFocusIn(component, withKey) {
            this.get('actionLog').unshiftObject(`<code>FocusIn</code> with ${withKey? 'keyboard': 'mouse'} on ${component.get('isBranch')? 'branch': 'leaf'} ${component.get('data.name')}`);
        },

        nodeFocusOut(component, withKey) {
            this.get('actionLog').unshiftObject(`<code>FocusOut</code> with ${withKey? 'keyboard': 'mouse'} on ${component.get('isBranch')? 'branch': 'leaf'} ${component.get('data.name')}`);
        }
    }
});