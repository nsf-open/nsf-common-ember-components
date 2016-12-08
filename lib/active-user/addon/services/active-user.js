import Ember from 'ember';

export default Ember.Service.extend({
    _user: null,

    user: Ember.computed('_user', function(){
        return this.get('_user');
    }).readOnly(),

    model: Ember.computed.alias('user'),

    exists: Ember.computed('_user', function(){
        return this.get('_user') !== null;
    }).readOnly(),

    getUser(){
        return this.get('_user');
    },

    setUser(user){
        this.set('_user', user);
    },

    /**
     * The array containing all of the valid permission strings.
     *
     * @property permissions
     * @type array
     * @default []
     * @readOnly
     */
    permissions: Ember.computed(function() {
        return Ember.A();
    }).readOnly(),

    /**
     * The array containing all of the valid role strings.
     *
     * @property roles
     * @type array
     * @default []
     * @readOnly
     */
    roles: Ember.computed(function() {
        return Ember.A();
    }).readOnly(),

    /**
     * Add one or more permission strings to the permissions array. This method will accept the following arguments:
     * * A single string
     * * N number of strings
     * * An array of strings
     *
     * @method addPermissions
     *
     * @example
     * addPermissions('post.create');                // Adds the permission 'post.create'
     * addPermissions('post.create', 'post.edit');   // Adds the permissions 'post.create', and 'post.edit'
     * addPermissions(['post.create', 'post.edit']); // Adds the permissions 'post.create', and 'post.edit'
     */
        addPermissions() {
        this.get('permissions').addObjects(this._coerceToArray(arguments));
    },

    /**
     * Removes one or more permission strings to the permissions array. This method will accept the following arguments:
     * * A single string
     * * N number of strings
     * * An array of strings
     *
     * @method removePermissions
     *
     * @example
     * removePermissions('post.create');                // Removes the permission 'post.create'
     * removePermissions('post.create', 'post.edit');   // Removes the permissions 'post.create', and 'post.edit'
     * removePermissions(['post.create', 'post.edit']); // Removes the permissions 'post.create', and 'post.edit'
     */
        removePermissions() {
        this.get('permissions').removeObjects(this._coerceToArray(arguments));
    },

    /**
     * Add one or more role strings to the roles array. This method will accept the following arguments:
     * * A single string
     * * N number of strings
     * * An array of strings
     *
     * @method addRoles
     *
     * @example
     * addRoles('post.admin');                   // Adds the role 'post.admin'
     * addRoles('post.admin', 'post.creator');   // Adds the roles 'post.admin', and 'post.creator'
     * addRoles(['post.admin', 'post.creator']); // Adds the roles 'post.admin', and 'post.creator'
     */
        addRoles() {
        this.get('roles').addObjects(this._coerceToArray(arguments));
    },

    /**
     * Removes one or more role strings to the roles array. This method will accept the following arguments:
     * * A single string
     * * N number of strings
     * * An array of strings
     *
     * @method addRoles
     *
     * @example
     * removeRoles('post.admin');                   // Removes the role 'post.admin'
     * removeRoles('post.admin', 'post.creator');   // Removes the roles 'post.admin', and 'post.creator'
     * removeRoles(['post.admin', 'post.creator']); // Removes the roles 'post.admin', and 'post.creator'
     */
        removeRoles() {
        this.get('roles').removeObjects(this._coerceToArray(arguments));
    },

    /**
     * Checks whether any of the supplied arguments are contained in the permissions array. This method will accept
     * the following arguments:
     * * A single string
     * * N number of strings
     * * An array of strings
     *
     * @method hasPermission
     *
     * @example
     * // Assume that the permission strings 'post.create' and 'post.edit' have been added to the permissions array.
     *
     * hasPermission('post.create')                 // Returns true
     * hasPermission(['post.create', post.delete])  // Returns true
     * hasPermission('post.create', 'post.delete')  // Returns true
     * hasPermission('post.delete', 'post.admin')   // Returns false
     */
    hasPermission() {
        let checkFor = this._coerceToArray(arguments);
        return this._containsAny(checkFor, 'permissions');
    },

    /**
     * Checks whether any of the supplied arguments are contained in the roles array. This method will accept
     * the following arguments:
     * * A single string
     * * N number of strings
     * * An array of strings
     *
     * @method hasRole
     *
     * @example
     * // Assume that the role strings 'post.creator' and 'post.admin' have been added to the permissions array.
     *
     * hasRole('post.creator')                // Returns true
     * hasRole(['post.admin', post.reviewer]) // Returns true
     * hasRole('post.admin', 'post.reviewer') // Returns true
     * hasRole('post.reviewer')               // Returns false
     */
    hasRole() {
        let checkFor = this._coerceToArray(arguments);
        return this._containsAny(checkFor, 'roles');
    },

    /**
     * This utility function will always return an array. The rules are:
     * * If the provided argument is an array, and the first element of that array is an array, then that element is returned.
     * * If the provided argument is an array, the the first element of that array is not an array, then the argument is returned.
     * * If the provided argument is not an array, then the argument is added to a new array and returned.
     *
     * @method _coerceToArray
     */
    _coerceToArray(obj) {
        if (Ember.isArray(obj)) {
            if (obj.length === 1) {
                if (Ember.isArray(obj[0])) {
                    return obj[0];
                }
                else {
                    return obj;
                }
            }
            else {
                return obj;
            }
        }

        return [obj];
    },

    /**
     * A quick check to see if two arrays have any intersection.
     *
     * @method _containsAny
     *
     * @param checkFor {array}
     * @param within {array}
     *
     * @returns {boolean} True if one or more equal values exist within both array arguments, false otherwise.
     *
     * @private
     */
    _containsAny(checkFor, within) {
        within = this.get(within);

        for (let i = 0; i < checkFor.length; i++) {
            if (within.includes(checkFor[i])) {
                return true;
            }
        }

        return false;
    }
});