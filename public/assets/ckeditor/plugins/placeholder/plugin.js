/* global CKEDITOR:true */

(function(){
    var KEY_BACKSPACE = 8,
        KEY_DELETE    = 46;

    CKEDITOR.plugins.add('placeholder', {
        requires: 'widget',

        init: function(editor){
            editor.addContentsCss(this.path + 'styles/plugin.css');

            editor.widgets.add('placeholder', {
                hidpi: true,

                template: '<span class="placeholder-property"></span>',

                draggable: false,

                init: function(){
                    this.setData('placeholderKey', this.element.getText());

                    this.on('key', function(event){
                        if(event.data.keyCode === KEY_BACKSPACE || event.data.keyCode === KEY_DELETE){
                            event.cancel();
                        }
                    });
                },

                downcast: function(){
                    return new CKEDITOR.htmlParser.text('${'+ this.data.placeholderKey +'}');
                },

                data: function(){
                    this.element.setText('${'+ this.data.placeholderKey +'}');
                },

                getLabel: function(){
                    return this.editor.lang.widget.label.replace(/%1/, this.data.placeholderKey + ' ' + this.pathName);
                }
            });
        },

        afterInit: function(editor){
            var regex = /\${([\d\w\.]*?)(-noaccess)?}/ig;

            editor.dataProcessor.dataFilter.addRules({
                text: function(text, node){
                    var dtd = node.parent && CKEDITOR.dtd[node.parent.name];

                    if(dtd && !dtd.span){
                        return;
                    }

                    return text.replace(regex, function(string, match, access){
                        var wrapper = null,
                            inner   = new CKEDITOR.htmlParser.element('span', {'class': 'placeholder-property'});

                        inner.add(new CKEDITOR.htmlParser.text(match));
                        wrapper = editor.widgets.wrapElement(inner, 'placeholder');

                        return wrapper.getOuterHtml();
                    });
                }
            });
        }
    });
})();