import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('ck-editor', 'Integration | Component | ck editor', {
    integration: true
});


test('it renders', function(assert) {
    assert.expect(8);

    let io1     = "<p>The quick brown fox jumped over the lazy dog</p>",
        io2     = "<p>All work and no play makes Jack a dull boy</p>",
        plugins = assert.async(),
        lang    = assert.async(),
        config  = assert.async(),
        loaded  = assert.async(),
        ready   = assert.async(),
        update  = assert.async();


    this.set('editorContent', io1);

    this.on('editorConfigLoaded', function(editor){
        assert.ok(editor, 'The "configLoaded" action fired');
        config();
    });

    this.on('editorPluginsLoaded', function(editor){
        assert.ok(editor, 'The "pluginsLoaded" action fired');
        plugins();
    });

    this.on('editorLangLoaded', function(editor){
        assert.ok(editor, 'The "langLoaded" action fired');
        lang();
    });

    this.on('editorLoaded', function(editor){
        assert.ok(editor, 'The "loaded" action fired');
        loaded();
    });

    let editorCallbacks = null;

    this.on('editorReady', (editor, callbacks) => {
        assert.ok(editor, 'The "ready" action fired');
        assert.equal(callbacks.save().trim(), io1, 'Input and output matches correctly');

        editorCallbacks = callbacks;

        this.set('editorContent', io2);
        ready();
    });

    this.on('editorContentUpdated', (editor) => {
        assert.ok(editor, 'The "contentUpdated" action fired');
        assert.equal(editorCallbacks.save().trim(), io2, 'Input and output matches correctly after update');

        update();
    });


    this.render(hbs`
        {{ck-editor
            content        = editorContent
            configLoaded   = (action 'editorConfigLoaded')
            pluginsLoaded  = (action 'editorPluginsLoaded')
            langLoaded     = (action 'editorLangLoaded')
            loaded         = (action 'editorLoaded')
            ready          = (action 'editorReady')
            contentUpdated = (action 'editorContentUpdated')
        }}
    `);
});
