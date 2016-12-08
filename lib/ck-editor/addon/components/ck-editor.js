/* global CKEDITOR:true */
import Ember from 'ember';

const { Component, run, computed, get, set, setProperties } = Ember;

/**
 * The CKEditor component provides the minimal bootstrapping needed to load
 * an instance of the CKEditor WYSIWYG into an Ember application.
 *
 *
 * @class CKEditor
 * @namespace Components
 * @module ck-editor
 * @submodule components
 * @extends Ember.Component
 * @public
 */
export default Component.extend({
  /**
   * Configuration options for the CKEditor instance. Note that this property
   * is not bound to the created editor instance and is only used when first
   * initializing CKEditor.
   *
   * See [CKEditor.config](http://docs.ckeditor.com/#!/api/CKEDITOR.config) for more information.
   *
   * @property options
   * @type object
   * @default null
   * @writeOnce
   * @public
   */
  options: null,

  /**
   * The editor instance content as a string. Note that this property is one-way:
   * you can set it to update the contents of the editor instance, but it will not
   * be updated as the editor content is modified. Use the `save()` callback hook
   * provided by the `ready` action to retrieve the latest content from the editor.
   *
   * @property content
   * @type string
   * @default null
   * @public
   */
  content: null,

  /**
   * A boolean flag set once the CKEditor instance has finished initializing
   * (via its instanceReady event).
   *
   * @property isInitialized
   * @type boolean
   * @default false
   * @protected
   */
  isInitialized: false,

  /**
   * A reference to the CKEditor instance being hosted by this component.
   *
   * @property instance
   * @type CKEDITOR.editor
   * @default null
   * @protected
   */
  instance: null,

  /**
   * Signals that the content property has been updated internally.
   *
   * @property ignoreContentAttrUpdate
   * @type boolean
   * @default false
   * @private
   */
  ignoreContentAttrUpdate: false,

  /**
   * The unique ID of the CKEditor instance.
   *
   * @property editorId
   * @type string
   * @readOnly
   * @protected
   */
  editorId: computed('elementId', function() {
    return `${get(this, 'elementId')}-editor`;
  }).readOnly(),


  didInsertElement() {
    this._super(...arguments);

    run.scheduleOnce('afterRender', this, function() {
      this._initializeEditor();
    });
  },


  willDestroyElement() {
    /**
     * Action called when the `destroy()` is about to be called on the editor
     * instance because the component is being destroyed. This is useful for
     * cleaning up anything that was bound to or relied on the editor instance
     * outside of the component.
     *
     * @event willDestroyEditor
     * @param {CKEDITOR.editor} editor A reference to the CKEDITOR.editor instance.
     */
    this.sendAction('willDestroyEditor', get(this, 'instance'));

    get(this, 'instance').destroy();

    this._super(...arguments);
  },


  didUpdateAttrs(attrs) {
    const oldCon = attrs.oldAttrs.content,
      newCon = attrs.newAttrs.content;

    if(newCon && (!oldCon || oldCon.value !== newCon.value) && get(this, 'isInitialized')) {
      if(get(this, 'ignoreContentAttrUpdate')) {
        set(this, 'ignoreContentAttrUpdate', false);
      }
      else {
        get(this, 'instance').setData(newCon.value, {
          callback: () => {
            this.sendAction('contentUpdated', get(this, 'instance'));
          },
        });
      }
    }
  },


  /**
   * Creates an object of bound callback methods for this CKEditor instance.
   *
   * @method _getFunctionPackage
   * @returns {object}
   * @private
   */
  _getFunctionPackage() {
    return {
      save: function() {
        const content = get(this, 'instance').getData();

        run.next(this, function() {
          setProperties(this, {
            content,
            ignoreContentAttrUpdate: true,
          });
        });

        return content;
      }.bind(this),


      coerceEvent(event) {
        const { dom: { event: CKEvent, element: CKElement } } = CKEDITOR,
          e = event.originalEvent || event;

        return {
          cancel: e.stopPropagation,
          data: new CKEvent(e),
          editor: undefined,
          listenerData: undefined,
          name: e.type,
          sender: new CKElement(e.target),
          stop: e.stopImmediatePropagation,
        };
      },
    };
  },


  /**
   * Handles the creation of a CKEditor instance and its startup callbacks.
   *
   * @method _initializeEditor
   * @private
   */
  _initializeEditor() {
    if(!get(this, 'isInitialized')) {
      const instance = CKEDITOR.replace(get(this, 'editorId'), get(this, 'options') || {});

      instance.once('pluginsLoaded', () => {
        /**
         * Action called when the editor instance emits its `pluginsLoaded` event.
         *
         * @event pluginsLoaded
         * @param {CKEDITOR.editor} editor A reference to the CKEDITOR.editor instance.
         */
        this.sendAction('pluginsLoaded', instance);
      });

      instance.once('langLoaded', () => {
        /**
         * Action called when the editor instance emits its `langLoaded` event.
         *
         * @event langLoaded
         * @param {CKEDITOR.editor} editor A reference to the CKEDITOR.editor instance.
         */
        this.sendAction('langLoaded', instance);
      });

      instance.once('configLoaded', () => {
        /**
         * Action called when the editor instance emits its `configLoaded` event.
         *
         * @event configLoaded
         * @param {CKEDITOR.editor} editor A reference to the CKEDITOR.editor instance.
         */
        this.sendAction('configLoaded', instance);
      });

      instance.once('loaded', () => {
        /**
         * Action called when the editor instance emits its `loaded` event.
         *
         * @event loaded
         * @param {CKEDITOR.editor} editor A reference to the CKEDITOR.editor instance.
         */
        this.sendAction('loaded', instance);
      });

      instance.once('instanceReady', () => {
        /**
         * Action called when the editor instance emits its `instanceReady` event.
         *
         * @event ready
         * @param {CKEDITOR.editor} editor A reference to the CKEDITOR.editor instance.
         * @param {Object} callbacks An object containing bound function callbacks
         * to make certain operations on the editor instance easier. The following
         * callbacks are provided:
         *  - `save`: Calls the editor instance's `getData()` method to serialize its
         *  current contents. Returns the serialized string after it has been sanitized.
         */
        this.sendAction('ready', instance, this._getFunctionPackage());
      });

      set(this, 'instance', instance);
      set(this, 'isInitialized', true);
    }
  },
});
