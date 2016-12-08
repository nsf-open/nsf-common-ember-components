import Ember from 'ember';
import ENV from 'nsf-ember-commons/config/environment';
import Addon from 'nsf-ember-commons/utils/commons-addon';

export default Ember.Service.extend({

    packageList: Ember.computed(function(){
        let results = [],
            keys    = Object.keys(ENV.EmberCommons.addons);

        for(let i = 0; i < keys.length; i++){
            results.push(this.get(keys[i]));
        }

        return results.sort(function(a, b){
            return a.getWithDefault('prettyName', a.get('name')).localeCompare(b.getWithDefault('prettyName', b.get('name')));
        });
    }).readOnly(),


    letterSortedPackageList: Ember.computed('packageList', function(){
        let list    = this.get('packageList'),
            hold    = {},
            results = [];

        for(let i = 0; i < list.length; i++){
            let firstChar = list[i].getWithDefault('prettyName', list[i].get('name')).charAt(0).toUpperCase();

            if(results.indexOf(firstChar) === -1){
                results.push(firstChar);
            }

            if(hold.hasOwnProperty(firstChar)){
                hold[firstChar].push(list[i]);
            }
            else{
                hold[firstChar] = [list[i]];
            }
        }

        return results.map(item => {
            return {letter: item, list: hold[item]}
        });
    }).readOnly(),


    componentPackageList: Ember.computed.filter('packageList', function(item){
        if(Ember.isArray(item.get('type'))){
            return item.get('type').indexOf('component') !== -1;
        }
        else{
            return false;
        }
    }).readOnly(),


    servicePackageList: Ember.computed.filter('packageList', function(item){
        if(Ember.isArray(item.get('type'))) {
            return item.get('type').indexOf('service') !== -1;
        }
        else{
            return false;
        }
    }).readOnly(),


    otherPackageList: Ember.computed.filter('packageList', function(item){
        if(Ember.isArray(item.get('type'))) {
            return item.get('type').indexOf('mixin') !== -1 || item.get('type').indexOf('utility') !== -1;
        }
        else{
            return false;
        }
    }).readOnly(),


    _versionRegex: Ember.computed(function(){
        return /^([\w-]+)(?:-)(\d[_\.]\d[_\.]\d|latest)$/;
    }).readOnly(),


    unknownProperty(key) {
        let matches = key.match(this.get('_versionRegex')),
            version = 'latest';

        if(matches){
            key     = matches[1];
            version = matches[2].replace(/_/g, '.');
        }

        if(this.addonHasVersion(key, version)){
            let def = this.defineAddon(key, version);
            this.set(`${key}-${version.replace(/\./g, '_')}`, def);
            return def;
        }

        return null;
    },


    addonExists(name) {
        return ENV.EmberCommons.addons.hasOwnProperty(name);
    },


    addonHasVersion(name, version) {
        if(this.addonExists(name)){
            if(version === 'latest' || version === ENV.EmberCommons.addons[name].latest){
                return true;
            }
            else{
                let versions = ENV.EmberCommons.addons[name].versions;

                if(!versions || version.length === 0){
                    return false;
                }

                for(let i = 0; i < versions.length; i++){
                    if(Ember.typeOf(versions[i]) === 'string'){
                        if(version === versions[i]){
                            return true;
                        }
                    }
                    else{
                        if(version === versions[i].version){
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    },


    getAddonShellDefinition(name, version){
        if(!this.addonHasVersion(name, version)){
            return null;
        }

        let def = ENV.EmberCommons.addons[name];

        if(version === 'latest' || version === def.latest){
            def.version = def.latest;
            return def;
        }

        for(let i = 0; i < def.versions.length; i++){
            if(Ember.typeOf(def.versions[i]) === 'string'){
                if(version === def.versions[i]){
                    break;
                }
            }
            else{
                if(version === def.versions[i].version){

                    if(def.versions[i].bower){
                        def.bower = def.bower || {};

                        if(def.versions[i].bower.dependencies){
                            def.bower.dependencies = def.versions[i].bower.dependencies;
                        }

                        if(def.versions[i].bower.devDependencies){
                            def.bower.devDependencies = def.versions[i].bower.devDependencies;
                        }
                    }

                    if(def.versions[i].node){
                        def.node = def.node || {};

                        if(def.versions[i].node.dependencies){
                            def.node.dependencies = def.versions[i].node.dependencies;
                        }

                        if(def.versions[i].node.devDependencies){
                            def.node.devDependencies = def.versions[i].node.devDependencies;
                        }
                    }

                    if(def.versions[i].appImports){
                        def.appImports = def.versions[i].appImports;
                    }

                    if(def.versions[i].requires){
                        def.requires = def.versions[i].requires;
                    }

                    break;
                }
            }
        }

        def.version = version;
        return def;
    },


    defineAddon(name, version) {
        let def = this.getAddonShellDefinition(name, version);

        let addon = Addon.create({
            name       : def.name,
            prettyName : def.prettyName,
            latest     : def.latest,
            version    : def.version,
            type       : def.type,
            changeLog  : def.changeLog
        });

        if(def.bower){
            if(def.bower.dependencies){
                addon.set('bower.dependencies', def.bower.dependencies);
            }

            if(def.bower.devDependencies){
                addon.set('bower.devDependencies', def.bower.devDependencies);
            }
        }

        if(def.node){
            if(def.node.dependencies){
                addon.set('node.dependencies', def.node.dependencies);
            }

            if(def.node.devDependencies){
                addon.set('node.devDependencies', def.node.devDependencies);
            }
        }

        if(def.appImports){
            addon.set('appImports', def.appImports);
        }

        if(def.requires){
            let keys = Object.keys(def.requires);

            for(let i = 0; i < keys.length; i++){
                if(this.addonHasVersion(keys[i], def.requires[keys[i]])){
                    addon.get('requires').push(this.get(`${keys[i]}-${def.requires[keys[i]]}`));
                }
            }
        }

        return addon;
    }
});