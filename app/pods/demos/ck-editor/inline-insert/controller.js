/* global CKEDITOR:true; */
import Ember from 'ember';
import mockAwardNotice from './mock-content/award-notice';

export default Ember.Controller.extend({
    editors: null,

    focusedEditor: null,

    callbacks: null,

    editorOptions: {
        extraPlugins: 'readonly2'
    },

    editorContent: mockAwardNotice,

    actions: {
        editorsReady(editors, callbacks) {
            this.set('editors', editors);
            this.set('callbacks', callbacks);

            CKEDITOR.document.getById('idiomsList').on('dragstart', function(event){
                CKEDITOR.plugins.clipboard.initDragDataTransfer(event);

                let target       = event.data.getTarget().getAscendant('li', true).findOne('p'),
                    dataTransfer = event.data.dataTransfer;

                dataTransfer.setData('idiom', target.getText());
                dataTransfer.setData('text/html', target.getText());
            });

            for(let i = 0; i < editors.length; i++){
                editors[i].on('paste', function(event){
                    let idiom = event.data.dataTransfer.getData('idiom');

                    if(!idiom){
                        return;
                    }

                    event.data.dataValue = '<span data-editor-readonly="true">'+ idiom + '</span>';
                });
            }
        },

        editorFocusChange(focusedEditor) {
            this.set('focusedEditor', focusedEditor);
        },

        doubleClick(event) {
            if(this.get('focusedEditor')){
                let item = Ember.$(event.target).closest('li').find('p');
                this.get('focusedEditor').insertHtml('<span data-editor-readonly="true">'+ item.text() + '</span>');
            }
            else{
                window.alert('I cannot find your cursor! First, please select the location that you would like to insert this new content to.');
            }

        },

        saveContent() {
            let blob = new Blob([this.get('callbacks').save()], {type: 'text/html'}),
                url  = window.URL.createObjectURL(blob);

            window.open(url, 'Editor Content', '_blank');

            window.URL.revokeObjectURL(url);
        }
    }
});