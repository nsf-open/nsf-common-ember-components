/* global CKEDITOR:true */

let initializer = {
    name: 'ck-editor',
    initialize: function(){
        CKEDITOR.disableAutoInline = true;
    }
};

export default initializer;