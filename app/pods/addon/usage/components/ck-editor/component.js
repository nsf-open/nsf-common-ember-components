import Ember from 'ember';

export default Ember.Component.extend({
    editorOptions: {
        skin: 'office2013'
    },

    editorOptionsString: Ember.computed('editorOptions', function(){
        return "editorOptions: " + JSON.stringify(this.get('editorOptions'), null, 2);
    })
});