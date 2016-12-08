import Ember from 'ember';

export default Ember.Controller.extend({
    editor: null,

    callbacks: null,

    actions: {
        editorReady(editor, callbacks){
            this.set('editor', editor);
            this.set('callbacks', callbacks);
        }
    }
})