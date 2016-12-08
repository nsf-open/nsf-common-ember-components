import Ember from 'ember';

/**
 * The IfPermission component is a tagless component that functions in similar fashion to Ember's built-in {{if}} component.
 * It will query the PermissionsService on your behalf, and is used to selectively render UI based on the permissions set.
 *
 * @namespace Components
 * @class IfPermissionComponent
 *
 * @example
 * {{if-permission 'post.create' 'post.edit'}}
 *  <p>This will be rendered if one or more of the positionally supplied arguments exist in the PermissionsService permissions array.</p>
 * {{else}}
 *  <p>This will be rendered if none of the positionally supplied arguments exist in the PermissionsService permissions array.</p>
 * {/if-permission}}
 */
const IfPermissionComponent = Ember.Component.extend({
    tagName: '',

    activeUser: Ember.inject.service('activeUser'),

    isAuthorized: Ember.computed('params.[]', 'activeUser.permissions.[]', function() {
        return this.get('activeUser').hasPermission(this.get('params'));
    }).readOnly()
});

IfPermissionComponent.reopenClass({
    positionalParams: 'params'
});

export default IfPermissionComponent;
