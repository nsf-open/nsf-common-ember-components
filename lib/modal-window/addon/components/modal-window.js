import Ember from 'ember';

const { computed, observer } = Ember;
const Modal = {};

Modal.TRANSITION_DURATION = 300;
Modal.BACKDROP_TRANSITION_DURATION = 150;

const observeOpen = function () {
    this.get('open') ? this.show() : this.hide();
};


export default Ember.Component.extend({

    /**
     * Visibility of the modal. Toggle to to show/hide with CSS transitions.
     *
     * @property open
     * @type boolean
     * @default true
     * @public
     */
    open: true,

    /**
     * The title of the modal, visible in the modal header. Is ignored if `header` is false.
     *
     * @property title
     * @type string
     * @public
     */
    title: null,

    /**
     * Display a close button (x icon) in the corner of the modal header.
     *
     * @property closeButton
     * @type boolean
     * @default true
     * @public
     */
    closeButton: true,

    /**
     * Set to false to disable fade animations.
     *
     * @property fade
     * @type boolean
     * @default true
     * @public
     */
    fade: true,

    /**
     * Used to apply Bootstrap's "in" class
     *
     * @property in
     * @type boolean
     * @default false
     * @private
     */
    'in': false,

    /**
     * Use a semi-transparent modal background to hide the rest of the page.
     *
     * @property backdrop
     * @type boolean
     * @default true
     * @public
     */
    backdrop: true,

    /**
     * @property showBackdrop
     * @type boolean
     * @default false
     * @private
     */
    showBackdrop: false,

    /**
     * Closes the modal when escape key is pressed.
     *
     * @property keyboard
     * @type boolean
     * @default true
     * @public
     */
    keyboard: true,

    /**
     * If true clicking a close button will hide the modal automatically.
     * If you want to handle hiding the modal by yourself, you can set this to false and use the closeAction to
     * implement your custom logic.
     *
     * @property autoClose
     * @type boolean
     * @default true
     * @public
     */
    autoClose: true,

    /**
     * Generate a modal header component automatically. Set to false to disable. In this case you would want to include an
     * instance of {{#crossLink "Components.ModalHeader"}}{{/crossLink}} in the components block template
     *
     * @property header
     * @type boolean
     * @default true
     * @public
     */
    header: true,

    /**
     * Generate a modal body component automatically. Set to false to disable. In this case you would want to include an
     * instance of {{#crossLink "Components.ModalBody"}}{{/crossLink}} in the components block template.
     *
     * Always set this to false if `header` is false!
     *
     * @property body
     * @type boolean
     * @default true
     * @public
     */
    body: true,

    /**
     * The id of the `.modal` element.
     *
     * @property modalId
     * @type string
     * @readonly
     * @private
     */
    modalId: computed('elementId', function () {
        return `${this.get('elementId')}-modal`;
    }),

    /**
     * The jQuery object of the `.modal` element.
     *
     * @property modalElement
     * @type object
     * @readonly
     * @private
     */
    modalElement: computed('modalId', function () {
        return Ember.$(`#${this.get('modalId')}`);
    }).volatile(),

    /**
     * The id of the backdrop element.
     *
     * @property backdropId
     * @type string
     * @readonly
     * @private
     */
    backdropId: computed('elementId', function () {
        return `${this.get('elementId')}-backdrop`;
    }),

    /**
     * The jQuery object of the backdrop element.
     *
     * @property backdropElement
     * @type object
     * @readonly
     * @private
     */
    backdropElement: computed('backdropId', function () {
        return Ember.$(`#${this.get('backdropId')}`);
    }).volatile(),

    /**
     * Use CSS transitions when showing/hiding the modal?
     *
     * @property usesTransition
     * @type boolean
     * @readonly
     * @private
     */
    usesTransition: computed('fade', function () {
        return Ember.$.support.transition && this.get('fade');
    }),

    /**
     * Property for size styling, set to null (default), 'lg' or 'sm'
     *
     * Also see the [Bootstrap docs](http://getbootstrap.com/javascript/#modals-sizes)
     *
     * @property size
     * @type String
     * @public
     */
    size: null,

    /**
     * If true clicking on the backdrop will close the modal.
     *
     * @property backdropClose
     * @type boolean
     * @default true
     * @public
     */
    backdropClose: true,

    /**
     * The action to be sent when the modal is closing.
     * This will be triggered by pressing the modal header's close button (x button).
     * Note that this will happen before the modal is hidden from the DOM, as the fade transitions will still need some
     * time to finish. Use the `closedAction` if you need the modal to be hidden when the action triggers.
     *
     * You can set `autoClose` to false to prevent closing the modal automatically, and do that in your closeAction by
     * setting `open` to false.
     *
     * @property closeAction
     * @type string
     * @default null
     * @public
     */
    closeAction: null,

    /**
     * The action to be sent after the modal has been completely hidden (including the CSS transition).
     *
     * @property closedAction
     * @type string
     * @default null
     * @public
     */
    closedAction: null,

    /**
     * The action to be sent when the modal is opening.
     * This will be triggered immediately after the modal is shown (so it's safe to access the DOM for
     * size calculations and the like). This means that if fade=true, it will be shown in between the
     * backdrop animation and the fade animation.
     *
     * @property openAction
     * @type string
     * @default null
     * @public
     */
    openAction: null,

    /**
     * The action to be sent after the modal has been completely shown (including the CSS transition).
     *
     * @property openedAction
     * @type string
     * @default null
     * @public
     */
    openedAction: null,

    actions: {
        close(){
            if(this.get('autoClose')){
                this.set('open', false);
            }

            this.sendAction('closeAction');
        }
    },

    _observeOpen: observer('open', observeOpen),

    /**
     * Give the modal (or its autofocus element) focus
     *
     * @method takeFocus
     * @private
     */
    takeFocus: function(){
        let focusElement = this.get('modalElement').find('[autofocus]').first();
        if (focusElement.length === 0) {
            focusElement = this.get('modalElement');
        }
        if (focusElement.length > 0) {
            focusElement.focus();
        }
    },

    /**
     * Show the modal
     *
     * @method show
     * @private
     */
    show: function(){
        this.checkScrollbar();
        this.setScrollbar();

        Ember.$('body').addClass('modal-open');

        this.resize();

        let callback = function () {
            if (this.get('isDestroyed')) {
                return;
            }

            this.get('modalElement')
                .show()
                .scrollTop(0);

            this.handleUpdate();
            this.set('in', true);
            this.sendAction('openAction');

            if (this.get('usesTransition')) {
                this.get('modalElement')
                    .one('bsTransitionEnd', Ember.run.bind(this, function () {
                        this.takeFocus();
                        this.sendAction('openedAction');
                    }))
                    .emulateTransitionEnd(Modal.TRANSITION_DURATION);
            } else {
                this.takeFocus();
                this.sendAction('openedAction');
            }
        };

        Ember.run.scheduleOnce('afterRender', this, this.handleBackdrop, callback);
    },

    /**
     * Hide the modal
     *
     * @method hide
     * @private
     */
    hide: function(){
        this.resize();
        this.set('in', false);

        if(this.get('usesTransition')){
            this.get('modalElement')
                .one('bsTransitionEnd', Ember.run.bind(this, this.hideModal))
                .emulateTransitionEnd(Modal.TRANSITION_DURATION);
        }
        else{
            this.hideModal();
        }
    },


    /**
     * Clean up after modal is hidden and call closedAction
     *
     * @method hideModal
     * @private
     */
    hideModal: function(){
        if (this.get('isDestroyed')) {
            return;
        }

        this.get('modalElement').hide();
        this.handleBackdrop(() => {
            Ember.$('body').removeClass('modal-open');
            this.resetAdjustments();
            this.resetScrollbar();
            this.sendAction('closedAction');
        });
    },


    /**
     * SHow/hide the backdrop
     *
     * @method handleBackdrop
     * @param callback
     * @private
     */
    handleBackdrop: function(callback){
        let doAnimate = this.get('usesTransition');

        if (this.get('open') && this.get('backdrop')) {
            this.set('showBackdrop', true);

            if (!callback) {
                return;
            }

            let waitForFade = function () {
                let $backdrop = this.get('backdropElement');
                Ember.assert('Backdrop element should be in DOM', $backdrop && $backdrop.length > 0);

                if (doAnimate) {
                    $backdrop
                        .one('bsTransitionEnd', Ember.run.bind(this, callback))
                        .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION);
                } else {
                    callback.call(this);
                }
            };

            Ember.run.scheduleOnce('afterRender', this, waitForFade);

        } else if (!this.get('open') && this.get('backdrop')) {
            let $backdrop = this.get('backdropElement');
            Ember.assert('Backdrop element should be in DOM', $backdrop && $backdrop.length > 0);

            let callbackRemove = function () {
                this.set('showBackdrop', false);
                if (callback) {
                    callback.call(this);
                }
            };
            if (doAnimate) {
                $backdrop
                    .one('bsTransitionEnd', Ember.run.bind(this, callbackRemove))
                    .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION);
            } else {
                callbackRemove.call(this);
            }
        } else if (callback) {
            callback.call(this);
        }
    },


    /**
     * Attach/Detach resize event listeners
     *
     * @method resize
     * @private
     */
    resize: function(){
        if(this.get('open')){
            Ember.$(window).on('resize.bs.modal', Ember.run.bind(this, this.handleUpdate));
        }
        else{
            Ember.$(window).off('resize.bs.modal');
        }
    },


    /**
     * @method handleUpdate
     * @private
     */
    handleUpdate: function(){
        this.adjustDialog();
    },


    /**
     * @method adjustDialog
     * @private
     */
    adjustDialog: function(){
        let modalIsOverflowing = this.get('modalElement')[0].scrollHeight > document.documentElement.clientHeight;
        this.get('modalElement').css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.get('scrollbarWidth') : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.get('scrollbarWidth') : ''
        });
    },


    /**
     * @method resetAdjustments
     * @private
     */
    resetAdjustments: function(){
        this.get('modalElement').css({
            paddingLeft: '',
            paddingRight: ''
        });
    },


    /**
     * @method checkScrollbar
     * @private
     */
    checkScrollbar: function(){
        let fullWindowWidth = window.innerWidth;

        // workaround for missing window.innerWidth in IE8
        if(!fullWindowWidth){
            let documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }

        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    },


    /**
     * @method setScrollbar
     * @private
     */
    setScrollbar: function(){
        let bodyPad = parseInt((Ember.$('body').css('padding-right') || 0), 10);

        this.originalBodyPad = document.body.style.paddingRight || '';

        if(this.bodyIsOverflowing) {
            Ember.$('body').css('padding-right', bodyPad + this.get('scrollbarWidth'));
        }
    },


    /**
     * @method resetScrollbar
     * @private
     */
    resetScrollbar: function(){
        Ember.$('body').css('padding-right', this.originalBodyPad);
    },


    /**
     * @property scrollbarWidth
     * @type number
     * @readonly
     * @private
     */
    scrollbarWidth: Ember.computed(function(){
        let scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure';
        this.get('modalElement').after(scrollDiv);
        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        Ember.$(scrollDiv).remove();
        return scrollbarWidth;
    }),


    didInsertElement: function(){
        Ember.run.scheduleOnce('afterRender', this, function(){
            if(this.get('open')){
                this.show();
            }
        });
    },


    willDestroyElement: function(){
        Ember.$(window).off('resize.bs.modal');
        Ember.$('body').removeClass('modal-open');
    }
});