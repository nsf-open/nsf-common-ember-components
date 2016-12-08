/* global CKEDITOR:true; */
(function(){
    var Config = {
        readOnlyAttr       : 'data-editor-readonly',
        noAccessAttr       : 'data-editor-noaccess',
        futureReadOnlyAttr : 'data-editor-future-readonly',
        futureNoAccessAttr : 'data-editor-future-noaccess',
        readOnlyLabel      : 'Mark as read only',
        noAccessLabel      : 'Mark as no access (read only, and cannot be deleted)',
        noSelectionMessage : 'You must first highlight the content you want to mark as read only.',

        invalidSelectionMessage_1: 'Your highlighted selection already contains one or more read only areas.',
        invalidSelectionMessage_3: 'Your highlighted selection already contains one or more no access areas.',
        invalidSelectionMessage_4: ''
    };

    Config.selectors = {
        readOnly       : '*['+ Config.readOnlyAttr +'="true"]',
        noAccess       : '*['+ Config.noAccessAttr +'="true"]',
        futureReadOnly : '*['+ Config.futureReadOnlyAttr +'="true"]',
        futureNoAccess : '*['+ Config.futureNoAccessAttr +'="true"]'
    };

    var Const = {
        NODE_CONTAINS_READ_ONLY: 1,
        NODE_CONTAINS_FUTURE_READ_ONLY: 2,
        NODE_CONTAINS_NO_ACCESS: 3,
        NODE_CONTAINS_FUTURE_NO_ACCESS: 4
    };


    /**
     * Writes additional filter rules into the target editor to allow the data-* attributes required for this plugin.
     *
     * @param editor {CKEDITOR.editor} The target editor instance.
     */
    function buildEditorFilterRules(editor) {
        var results   = ['span'],
            attrNames = ['readOnlyAttr', 'noAccessAttr', 'futureReadOnlyAttr', 'futureNoAccessAttr'];

        for(var i = 0; i < attrNames.length; i ++){
            results.push('*['+ Config[attrNames[i]] +']');
        }

        editor.filter.allow(results.join('; '), 'readonly');
    }


    /**
     * Creates the toolbar buttons on the target editor instance to trigger read-only and no-access commands.
     *
     * @param editor {CKEDITOR.editor} The target editor instance.
     */
    function buildEditorUiButtons(editor) {
        editor.ui.addButton('readonly', {
            label: Config.readOnlyLabel,
            command: 'markAsReadOnly',
            toolbar: 'insert'
        });

        editor.ui.addButton('noaccess', {
            label: Config.noAccessLabel,
            command: 'markAsNoAccess',
            toolbar: 'insert'
        });
    }


    /**
     * Defines the read-only and no-access widgets that marked elements will be upcast to and downcast from to enforce editing
     * rules.
     *
     * @param editor {CKEDITOR.editor} The target editor instance.
     */
    function defineWidgets(editor) {
        editor.widgets.add('readonly', {
            draggable: false,

            //template: ('<div '+ Config.readOnlyAttr +'="true"></div>'),

            init: function(){
                this.setData('isEditable', this.element.hasAttribute(Config.futureReadOnlyAttr));
                this.element.addClass(this.data.isEditable ? 'cke_plugin_readonly_editable' : 'cke_plugin_readonly');

                this.on('doubleclick', function(event){

                });
            },

            upcast: function(element){
                //var attrs = element.attributes;

                //if(attrs[Config.readOnlyAttr] === 'true' || attrs[Config.futureReadOnlyAttr] === 'true'){
                // return element;
                // }

                return false;
            }
        });
    }


    /**
     * Determines whether the current selection is allowed to be turned into a read-only or no-access block. This means:
     *
     * Blocks to be marked "future read only" cannot contain "read only", "no access", or "future no access" children.
     * Blocks to be marked "future no access" cannot contain "read only", or "no access" children.
     *
     * If given an array of nodes to be checked, this method will return on the first violation found.
     *
     * @param proposedState
     * @param nodes
     */
    function isUpcastAllowed(nodes, proposedState) {
        if(!nodes){
            return true;
        }

        function search(node){
            var children;

            if(proposedState === Config.futureReadOnlyAttr || proposedState === Config.futureNoAccessAttr){
                children = node.find(Config.selectors.readOnly);

                if(children && children.count()){
                    return Const.NODE_CONTAINS_READ_ONLY;
                }

                children = node.find(Config.selectors.noAccess);

                if(children && children.count()){
                    return Const.NODE_CONTAINS_NO_ACCESS;
                }
            }

            if(proposedState === Config.futureReadOnlyAttr){
                children = node.find(Config.selectors.futureNoAccess);

                if(children && children.count()){
                    return Const.NODE_CONTAINS_FUTURE_NO_ACCESS;
                }
            }

            return true;
        }

        var i, result;

        if(nodes instanceof CKEDITOR.dom.nodeList){
            for(i = 0; i < nodes.count(); i++){
                if(result = search(nodes.getItem(i)) !== true){
                    return result;
                }
            }
        }
        else if(CKEDITOR.tools.isArray(nodes)){
            for(i = 0; i < nodes.length; i++){
                if(result = search(nodes[i]) !== true){
                    return result;
                }
            }
        }
        else{
            return search(nodes);
        }

        return true;
    }


    /**
     *
     * @param nodes
     * @param toState
     */
    function upcast(nodes, toState) {
        if(!nodes){
            return;
        }

        var i;

        if(nodes instanceof CKEDITOR.dom.nodeList){
            for(i = 0; i < nodes.count(); i++){
                nodes.getItem(i).setAttribute(toState, 'true');
            }
        }
        else if(CKEDITOR.tools.isArray(nodes)){
            for(i = 0; i < nodes.length; i++){
                nodes[i].setAttribute(toState, 'true');
            }
        }
        else{
            nodes.setAttribute(toState, 'true');
        }
    }


    /**
     *
     * @param nodes
     * @param fromState
     */
    function downcast(nodes, fromState) {
        if(!nodes){
            return;
        }

        var i;

        if(nodes instanceof CKEDITOR.dom.nodeList){
            for(i = 0; i < nodes.count(); i++){
                nodes.getItem(i).removeAttribute(fromState);
            }
        }
        else if(CKEDITOR.tools.isArray(nodes)){
            for(i = 0; i < nodes.length; i++){
                nodes[i].removeAttribute(fromState);
            }
        }
        else{
            nodes.removeAttribute(fromState);
        }
    }


    CKEDITOR.plugins.add('readonly', {
        requires: 'widget',

        hidpi: true,

        icons: 'readonly',

        init: function(editor){
            CKEDITOR.tools.extend(Config, editor.config.readonly || {}, true);

            editor.addContentsCss(this.path + 'styles/plugin.css');
            buildEditorFilterRules(editor);
            buildEditorUiButtons(editor);
            defineWidgets(editor);

            editor.addCommand('markAsReadOnly', {
                exec: function(editor){
                    var ranges = editor.getSelection().getRanges();

                    if(!ranges.length){
                        return;
                    }
                    else if(ranges.length === 1 && ranges[0].collapsed){
                        window.alert(Config.noSelectionMessage);
                        return;
                    }

                    var updateRequired = false;

                    editor.fire('lockSnapshot');

                    for(var i = 0; i < ranges.length; i++){
                        var range       = ranges[i],
                            ancestor    = range.getCommonAncestor(true, true),
                            pinnedStart = range.checkBoundaryOfElement(ancestor, CKEDITOR.START),
                            pinnedEnd   = range.checkBoundaryOfElement(ancestor, CKEDITOR.END);

                        if(pinnedStart && pinnedEnd){
                            var isAllowed = isUpcastAllowed(ancestor, Config.futureReadOnlyAttr);

                            if(isAllowed !== true){
                                window.alert(Config['invalidSelectionMessage_'+ isAllowed]);
                                break;
                            }

                            downcast(ancestor.find(Config.selectors.futureReadOnly), Config.futureReadOnlyAttr);
                            upcast(ancestor, Config.futureReadOnlyAttr);
                            updateRequired = true;
                        }
                    }

                    if(updateRequired){
                        // A little hacky, but this will trigger a re-parse and build for the widgets.
                        editor.setData(editor.getData());
                    }

                    editor.fire('unlockSnapshot');
                }
            });
        }


        /*
        afterInit: function(editor){
            editor.dataProcessor.dataFilter.addRules({
                text: function(element){
                    console.log('text', element);
                },

                attributeNames: [function(element){
                    console.log(element);
                }]
            });
        }
        */
    });
})();