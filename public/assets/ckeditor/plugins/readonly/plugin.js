/* global CKEDITOR:true; */
(function(){
    var KEY_BACKSPACE = 8,
        KEY_DELETE    = 46;

    var Config = {
        readOnlyAttr    : 'data-editor-readonly',
        noAccessAttr    : 'data-editor-noaccess',
        fieldId         : 'data-field-id',
        cannotDeleteMsg : 'Your current selection contains a non-removable block of content. You will need to change your selection before you can delete.'
    };


    var rangeContentContainsAttr = function(ranges, attr){
        if(!ranges){
            return false;
        }

        var containsAttr = false;

        for(var i = 0; i < ranges.length; i++){
            if (ranges[i].collapsed) {
                continue;
            }

            var walker    = new CKEDITOR.dom.walker(ranges[i]),
                node      = null;

            while(node = walker.next()){
                if(node.type !== CKEDITOR.NODE_TEXT && node.hasAttribute(attr)){
                    containsAttr = true;
                    break;
                }
            }

            if(containsAttr){
                break;
            }
        }

        return containsAttr;
    };


    CKEDITOR.plugins.add('readonly', {
        requires: 'widget',

        init: function(editor){
            var config = CKEDITOR.tools.extend({}, Config, editor.config.readonly || {}, true);

            editor.addContentsCss(this.path + 'styles/plugin.css');
            editor.filter.allow('span['+ config.readOnlyAttr +']; span['+ config.noAccessAttr +']; span[' + config.fieldId +']');

            editor.widgets.add('readonly', {
                hidpi: true,

                pathName: 'readonly',

                upcast: function(node){
                    if(node.attributes.hasOwnProperty(config.readOnlyAttr)){
                        return true;
                    }
                }
            });

            editor.widgets.add('noaccess', {
                hidpi: true,

                draggable: false,

                pathName: 'noaccess',

                init: function(){
                    this.on('key', function(event){
                        if(event.data.keyCode == KEY_BACKSPACE || event.data.keyCode == KEY_DELETE){
                            event.cancel();
                        }
                    });
                },

                upcast: function(node){
                    if(node.attributes.hasOwnProperty(config.noAccessAttr)){
                        return true;
                    }
                }
            });

            editor.addFeature(editor.widgets.registered.readonly);
            editor.addFeature(editor.widgets.registered.noaccess);

            // Disable delete and backspace keys if the selection has a no access node.
            editor.on('key', function(event){
                if(event.data.keyCode == KEY_BACKSPACE || event.data.keyCode == KEY_DELETE){
                    var ranges = editor.getSelection().getRanges();

                    if(rangeContentContainsAttr(ranges, config.noAccessAttr)){
                        window.alert(config.cannotDeleteMsg);
                        event.cancel();
                    }
                }
            });

            // Disable paste if the selection has a no access node.
            editor.on('paste', function(event){
                var ranges = editor.getSelection().getRanges();

                if(rangeContentContainsAttr(ranges, config.noAccessAttr)){
                    window.alert(config.cannotDeleteMsg);
                    event.cancel();
                }
            });

            // Disable cut if the selection has a no access node.
            editor.on('contentDom', function(){
                editor.document.findOne('*[contenteditable="true"]').on('cut', function(event){
                    var ranges = editor.getSelection().getRanges();

                    if(rangeContentContainsAttr(ranges, config.noAccessAttr)){
                        window.alert(config.cannotDeleteMsg);
                        event.cancel();
                    }
                });
            } );
        }
    });
})();
