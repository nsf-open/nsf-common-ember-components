import Ember from 'ember';
import IfPermissionComponent from './if-permission';

/**
 * The UnlessPermission component is a tagless component that functions in similar fashion to Ember's built-in {{if}} component.
 * It will query the PermissionsService on your behalf, and is used to selectively render UI based on the permissions set.
 * UnlessPermission is functionally the inverse of IfPermission.
 *
 * @namespace Components
 * @class UnlessPermissionComponent
 *
 * @example
 * {{if-permission 'post.create' 'post.edit'}}
 *  <p>This will be rendered if none of the positionally supplied arguments exist in the PermissionsService permissions array.</p>
 * {{else}}
 *  <p>This will be rendered if one or more of the positionally supplied arguments exist in the PermissionsService permissions array.</p>
 * {/if-permission}}
 */
export default IfPermissionComponent.extend({
    isNotAuthorized: Ember.computed.not('isAuthorized')
});