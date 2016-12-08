/* global require:true; */
import Ember from 'ember';
import CodeSnippet from 'nsf-ember-commons/components/code-snippet';

var Highlight = require('highlight.js');

CodeSnippet.reopen({
    rawSource: null,

    _source: Ember.computed('source', 'rawSource', 'language', function(){
        let raw  = this.get('rawSource'),
            src  = this.get('source'),
            lang = this.get('language');

        if(raw){
            src = this._unindent(raw);
        }

        return (lang) ? Highlight.highlight(lang, src) : Highlight.highlightAuto(src);
    }),

    didInsertElement() {
        // Stop the parent class from calling highlight when the component first renders
    }
});