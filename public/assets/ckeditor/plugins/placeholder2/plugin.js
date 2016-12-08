/* global CKEDITOR:true; */
(function(){

    var Config = {
        placeholderRegex : /\${([\d\w\._\-]*?)}/ig,
        contentWrapAttr  : 'data-editor-placeholder-content',
        delimiters       : {start: '${', end: '}'}
    };


    var InstanceHelper = function(editor){
        this.id     = editor.id;
        this.editor = editor;
        this.config = CKEDITOR.tools.extend({}, Config, editor.config.placeholder || {}, true);

        editor.filter.allow('span[' + this.config.contentWrapAttr + ']');

        this.wrapInDelimiters = function(propKey){
            return this.config.delimiters.start + propKey + this.config.delimiters.end;
        };

        this.findElements = function(){
            return this.editor.document.find('*['+ this.config.contentWrapAttr +']');
        };

        this.isPlaceholder = function(object){
            if(object instanceof CKEDITOR.dom.node){
                if(object.hasAttribute(this.config.contentWrapAttr)){
                    return object.getAttribute(this.config.contentWrapAttr);
                }
            }
            else if(object instanceof CKEDITOR.htmlParser.node){
                if(object && object.attributes.hasOwnProperty(this.config.contentWrapAttr)){
                    return object.attributes[this.config.contentWrapAttr];
                }
            }

            return false;
        };

        this.listUnique = function(){

        };
    };


    CKEDITOR.plugins.add('placeholder2', {
        helpers: {},

        helperFor: function(editor){
            return this.helpers[editor.id];
        },




        editorProps: {},


        getEditorProps: function(editor){
            if(this.editorProps.hasOwnProperty(editor.id)){
                return this.editorProps[editor.id];
            }

            return null;
        },


        getPlaceholderElements: function(editor){
            var props = this.getEditorProps(editor);
            return editor.document.find('*['+ props.config.contentWrapAttr +']');
        },


        listUnique: function(editor){
            var props    = this.getEditorProps(editor),
                elements = this.getPlaceholderElements(editor),
                results  = [],
                holder   = null;

            for(var i = 0; i < elements.count(); i++){
                holder = elements.getItem(i).getAttribute(props.config.contentWrapAttr);

                if(results.indexOf(holder) === -1){
                    results.push(holder);
                }
            }

            return results.sort();
        },


        init: function(editor) {
            var helper = new InstanceHelper(editor);
            this.helpers[editor.id] = helper;


            var config = {},
                self   = this;

            CKEDITOR.tools.extend(config, Config, editor.config.placeholder || {}, true);
            editor.filter.allow('span[' + config.contentWrapAttr + ']; div[' + config.contentWrapAttr + ']');

            this.editorProps[editor.id] = {config: config};

            /*
            editor.addCommand('placeholderToContent', {
                exec: function(editor, data){
                    editor.fire('lockSnapshot');

                    var elements = self.getPlaceholderElements(editor),
                        holder   = null;

                    for(var i = 0; i < elements.count(); i++){
                        holder = elements.getItem(i).getAttribute(config.contentWrapAttr);

                        if(data.hasOwnProperty(holder)){
                            elements.getItem(i).setHtml(data[holder].value);
                        }
                    }

                    editor.fire('unlockSnapshot');
                    return true;
                }
            });

            editor.addCommand('contentToPlaceholder', {
                exec: function(editor){
                    editor.fire('lockSnapshot');

                    var elements = editor.document.find('*['+ config.contentWrapAttr +']');
                    var holder   = null;

                    for(var i = 0; i < elements.count(); i++){
                        holder = elements.getItem(i).getAttribute(config.contentWrapAttr);
                        elements.getItem(i).setHtml(holder);
                    }

                    editor.fire('unlockSnapshot');
                    return true;
                }
            });
            */
        },



        afterInit: function(editor){
            var helper = this.helperFor(editor);

            editor.dataProcessor.dataFilter.addRules({
                text: function(text, node){
                    var dtd = node.parent && CKEDITOR.dtd[node.parent.name];

                    if(dtd && (!dtd.span || helper.isPlaceholder(node.parent) !== false)){
                        return;
                    }

                    return text.replace(helper.config.placeholderRegex, function(string, match){
                        var attributes = {};
                        attributes[helper.config.contentWrapAttr] = match;

                        var wrapper = new CKEDITOR.htmlParser.element('span', attributes);
                        wrapper.add(new CKEDITOR.htmlParser.text(string));
                        return wrapper.getOuterHtml();
                    });
                }
            });

            editor.dataProcessor.htmlFilter.addRules({
                elements: {
                    span: function(element){
                        var propName = helper.isPlaceholder(element);

                        if(propName !== false){
                            return new CKEDITOR.htmlParser.text(helper.wrapInDelimiters(propName));
                        }
                    }
                }
            });
        }
    });
})();