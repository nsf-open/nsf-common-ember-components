/* global CKEDITOR:true; */
/* eslint-disable */
import Ember from 'ember';

const { Component, computed, run, get, set, typeOf } = Ember;

/**
 * actions:
 *   - ready: called after all the 'instanceReady' events of each created editor fires.
 *   - focusChange: called when a new editor gains focus. Useful for always knowing
 *   what the last selected editor was.
 */
export default Component.extend({
  classNames: computed(function() {
    return ['ck-editor-inline'];
  }),

  content: null,

  options: null,

  editableBlockAttr: 'data-editable-block',

  _editorInstances: null,

  _focusedEditor: null,


  didInsertElement() {
    run.scheduleOnce('afterRender', this, function() {
      const editableContent = this.$().find(`*[${get(this, 'editableBlockAttr')}]`);

      if (editableContent.length) {
        set(this, '_editorInstances', []);
        let readyCount = 0;

        for (let i = 0; i < editableContent.length; i++) {
          const instance = this.createEditor(editableContent[i]);

          instance.once('instanceReady', () => {
            readyCount++;

            if (readyCount === editableContent.length) {
              this.sendAction('ready', get(this, '_editorInstances'), this.getFunctionPackage());
            }
          });
        }
      }
    });

    this._super(...arguments);
  },


  willDestroyElement() {
    let instances = get(this, '_editorInstances');

    if (instances) {
      for(let i = 0; i < instances.length; i++){
        instances[i].destroy();
      }
    }

    this._super(...arguments);
  },


  getFunctionPackage() {
    return {
      create: this.createEditor.bind(this),
      destroy: this.destroyEditor.bind(this),
      save: this.saveContent.bind(this),
    };
  },


  createEditor(rootNode) {
    rootNode.id = this.getRandomEditorId();
    rootNode.contentEditable = true;
    let instance = CKEDITOR.inline(rootNode, get(this, 'options') || {});

    instance.on('focus', (event) => {
      set(this, '_focusedEditor', event.editor);
      this.sendAction('focusChange', event.editor);
    });

    this.get('_editorInstances').push(instance);
    return instance;
  },


  destroyEditor(obj, noUpdate) {
    let editor = null;

    if (!obj) {
      return false;
    }

    if (typeOf(obj) === 'string') {
      editor = CKEDITOR.instances[obj];
    } else if (obj instanceof CKEDITOR.editor) {
      editor = obj;
    } else if (obj.nodeType === 1) {
      editor = CKEDITOR.instances[obj.id];
    }

    if (editor) {
      let originalElement = editor.element.$;

      if (originalElement) {
        let instances = this.get('_editorInstances'),
          i = 0;

        for (i; i < instances.length; i ++) {
          if (instances[i].id === editor.id) {
            break;
          }
        }

        instances.splice(i, 1);
        editor.destroy(noUpdate);

        if (editor === this.get('_focusedEditor')) {
          set(this, '_focusedEditor', null);
          this.sendAction('focusChange', null);
        }

        // Final cleanup of attributes that CKEDITOR added.
        originalElement.removeAttribute('id');
        originalElement.removeAttribute('contenteditable');
        originalElement.removeAttribute('style');

        set(this, '_editorInstances', instances);
        return instances;
      }
    }

    return false;
  },


  /**
   *
   */
  saveContent() {
    let container = document.createElement('div');
    container.innerHTML = this.$().html();

    let editables = container.querySelectorAll(`*[${this.get('editableBlockAttr')}]`);

    for (let i = 0; i < editables.length; i++) {
      let element = document.createElement(editables[i].tagName);
      element.setAttribute(this.get('editableBlockAttr'), '');
      element.innerHTML = CKEDITOR.instances[editables[i].id].getData();

      editables[i].parentNode.replaceChild(element, editables[i]);
    }

    return container.innerHTML;
  },


  /**
   * Creates a string comprised of a random assortment of uppercase, lowercase,
   * and numbers prefixed with "editor-". These results cannot be guaranteed
   * perfectly unique, but it is quick, and the likelihood of ID collisions is
   * pretty darn low.
   *
   * @param [length=8] {int}
   * @returns {string}
   */
  getRandomEditorId(length = 8) {
    let chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
      result = [];

    for (let i = 0; i < length; i++) {
        result.push(chars.charAt(Math.floor(Math.random() * 62)));
    }

    return 'editor-' + result.join('');
  },
});
