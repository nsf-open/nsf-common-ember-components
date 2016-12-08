import Ember from 'ember';
import ENV from 'nsf-ember-commons/config/environment';

export default Ember.Object.extend({
    assets: Ember.inject.service('addon-descriptor'),

    name        : null,
    prettyName  : null,
    latest      : null,
    version     : null,
    type        : null,
    changeLog   : null,


    isLatest: Ember.computed('version', 'latest', function(){
        return this.get('version') === this.get('latest');
    }).readOnly(),


    prettyType: Ember.computed('type.[]', function(){
        return this.get('type').join(' + ');
    }).readOnly(),


    bower: Ember.computed(function(){
        return {
            dependencies: {},
            devDependencies: {}
        };
    }),


    mergedBower: Ember.computed('bower.{dependencies,devDependencies}', 'requires.@each.hasBowerDependencies', 'requires.@each.hasBowerDevDependencies', function(){
        let bower = Object.assign({}, this.get('bower')),
            reqs  = this.get('requires');

        for(let i = 0; i < reqs.length; i++){
            if(reqs[i]){
                bower.dependencies    = Object.assign(bower.dependencies, reqs[i].get('mergedBower.dependencies'));
                bower.devDependencies = Object.assign(bower.devDependencies, reqs[i].get('mergedBower.devDependencies'));
            }
        }

        return bower;
    }),


    bowerToFormat: Ember.computed('mergedBower.{dependencies,devDependencies}', function(){
        let dep     = this.get('mergedBower.dependencies'),
            dev     = this.get('mergedBower.devDependencies'),
            depKeys = Object.keys(dep),
            devKeys = Object.keys(dev),
            output  = {};

        if(!depKeys.length && !devKeys.length){
            return null;
        }

        if(depKeys.length){
            output.dependencies = dep;
        }

        if(devKeys.length){
            output.devDependencies = dev;
        }

        return JSON.stringify(output, null, 2);
    }),


    hasBowerDependencies: Ember.computed('mergedBower.dependencies', function(){
        return Object.keys(this.get('mergedBower.dependencies')).length > 0;
    }),


    hasBowerDevDependencies: Ember.computed('mergedBower.devDependencies', function(){
        return Object.keys(this.get('bower.devDependencies')).length > 0;
    }),


    node: Ember.computed(function(){
        return {
            dependencies: {},
            devDependencies: {}
        };
    }),


    mergedNode: Ember.computed('node.{dependencies,devDependencies}', 'requires.@each.hasNodeDependencies', 'requires.@each.hasNodeDevDependencies', function(){
        let node = Object.assign({}, this.get('node')),
            reqs = this.get('requires');

        for(let i = 0; i < reqs.length; i++){
            if(reqs[i]){
                node.dependencies    = Object.assign(node.dependencies, reqs[i].get('mergedNode.dependencies'));
                node.devDependencies = Object.assign(node.devDependencies, reqs[i].get('mergedNode.devDependencies'));
            }
        }

        return node;
    }),


    nodeToFormat: Ember.computed('mergedNode.{dependencies,devDependencies}', 'mergedAddonPath.[]', function(){
        let dep     = this.get('mergedNode.dependencies'),
            dev     = this.get('mergedNode.devDependencies'),
            depKeys = Object.keys(dep),
            devKeys = Object.keys(dev),
            paths   = this.get('mergedAddonPath'),
            output  = {};

        if(!depKeys.length && !devKeys.length && !paths.length){
            return null;
        }

        if(depKeys.length){
            output.dependencies = dep;
        }

        if(devKeys.length){
            output.devDependencies = dev;
        }

        if(paths.length){
            output['ember-addon'] = {};
            output['ember-addon'].paths = paths;
        }

        return JSON.stringify(output, null, 2);
    }),


    hasNodeDependencies: Ember.computed('mergedNode.dependencies', function(){
        return Object.keys(this.get('mergedNode.dependencies')).length > 0;
    }),


    hasNodeDevDependencies: Ember.computed('mergedNode.devDependencies', function(){
        return Object.keys(this.get('mergedNode.devDependencies')).length > 0;
    }),


    requires: Ember.computed(function(){
        return [];
    }),


    appImports: Ember.computed(function(){
        return [];
    }),


    mergedAppImports: Ember.computed('appImports', 'requires.@each.mergedAppImports', function(){
        let output = this.get('appImports').slice(0),
            reqs   = this.get('requires');

        for(let i = 0; i < reqs.length; i++){
            if(reqs[i]){
                output = output.concat(reqs[i].get('mergedAppImports'));
            }
        }

        return output;
    }),


    appImportsToFormat: Ember.computed('mergedAppImports.[]', function(){
        let imports = this.get('mergedAppImports');

        if(imports && imports.length){
            return `app.import("${imports.join('");\napp.import("')}");`;
        }

        return null;
    }),


    addonPath: Ember.computed('name', function(){
        return `${ENV.EmberCommons.config.extLocalRoot}/${this.get('name')}`;
    }),


    mergedAddonPath: Ember.computed('addonPath', 'requires.@each.mergedAddonPath', function(){
        let output = [this.get('addonPath')],
            reqs   = this.get('requires');

        for(let i = 0; i < reqs.length; i++){
            if(reqs[i]){
                output = output.concat(reqs[i].get('mergedAddonPath'));
            }
        }

        return output;
    }),


    svnExternal: Ember.computed('name', 'version', function(){
        return `${ENV.EmberCommons.config.extRoot}/${this.get('name')}-${this.get('version')} ${ENV.EmberCommons.config.extLocalRoot}/${this.get('name')}`;
    }),


    mergedSvnExternal: Ember.computed('svnExternal', 'requires.@each.mergedSvnExternal', function(){
        let output = [this.get('svnExternal')],
            reqs   = this.get('requires');

        for(let i = 0; i < reqs.length; i++){
            if(reqs[i]){
                output = output.concat(reqs[i].get('mergedSvnExternal'));
            }
        }

        return output;
    }),


    svnExternalToFormat: Ember.computed('mergedSvnExternal.[]', function(){
        let externals = this.get('mergedSvnExternal');

        if(externals && externals.length){
            return externals.join('\n');
        }

        return null;
    })
});
