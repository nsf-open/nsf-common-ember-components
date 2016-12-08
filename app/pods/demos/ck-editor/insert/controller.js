/* global CKEDITOR:true; */
import Ember from 'ember';

export default Ember.Controller.extend({

    // The CKEditor instance provided by the editorReady action.
    editor: null,

    // An object of callback methods also provided by the editorReady action.
    editorCallbacks: null,

    // An object of callback methods provided by the treeViewReady action.
    treeViewCallbacks: null,

    // An object of CKEDITOR.config properties. Here we are adding a custom 'readonly' plugin to the editor.
    editorOptions: {
        extraPlugins: 'readonly'
    },


    actions: {

        // This method is provided to the tree-view component's 'ready' action.
        treeViewReady(callbacks) {
            this.set('treeViewCallbacks', callbacks);
        },

        // This method is provided to the ck-editor component's 'ready' action.
        editorReady(editor, callbacks) {
            this.set('editor', editor);
            this.set('editorCallbacks', callbacks);

            /*
              The CKEDITOR clipboard plugin intercepts 'dragdrop' and handles them in similar fashion to a variety of 'paste' style
              events in the editor instance. All we need to do here is check whether or not there is some dataTransfer information,
              and if so perform any final translations on it before it gets inserted.
             */
            editor.on('paste', function(event){
                // Check for data which may have been set as the result of the 'dragstart' event defined above.
                let fieldKey = event.data.dataTransfer.getData('fieldKey');
                let fieldName = event.data.dataTransfer.getData('fieldName');

                // No data, no problem. Stop here.
                if(!fieldKey){
                    return;
                }

                /*
                  Modify the data.dataValue property value. This is going to be what CKEDITOR will finally insert into the target editor. What we
                  are doing here is wrapping the value that we set on the event during 'dragstart' with some raw HTML that contains data attributes
                  which the readonly plugin which we told the editor to load can look for and create a widgets with.
                 */
                event.data.dataValue = '<span data-editor-placeholder-content="'+ fieldKey +'" data-editor-readonly="true" data-field-id="' + fieldKey + '">'+ fieldName.toUpperCase() +'</span>';
            });
        },

        // This method is provided to the tree-view component's 'onLeafDragStart' action.
        leafDragStart(component, event) {
            // The initDragDataTransfer() method expects the sort of event which is usually created by CKEDITOR listeners, instead of
            // vanilla JavaScript events. The coerceEvent() method makes vanilla or jQuery events look like a CKEDITOR event (tricky, eh).
            let editorEvent = this.get('editorCallbacks').coerceEvent(event);

            // For a CKEditor instance to properly support drag and drop the initDragDataTransfer() method needs to be called
            // on the clipboard plugin. All that needs to be known here is that it works.
            CKEDITOR.plugins.clipboard.initDragDataTransfer(editorEvent);

            // Set our content into the event's dataTransfer object. In this case, the content that we want to insert into the editor
            // is contained in the placeholder property.
            editorEvent.data.dataTransfer.setData('fieldKey', component.data.placeholder);
            editorEvent.data.dataTransfer.setData('fieldName', component.data.name);
            editorEvent.data.dataTransfer.setData('text/html', component.data.placeholder);
        },

        saveContent() {
            let blob = new Blob([this.get('editorCallbacks').save()], {type: 'text/html'}),
                url  = window.URL.createObjectURL(blob);

            window.open(url, 'Editor Content', '_blank');
            window.URL.revokeObjectURL(url);
        }
    }
});
