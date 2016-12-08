import Ember from 'ember';
import mockAwardNotice from './mock-content/award-notice';
import mockMergeFields from './mock-content/merge-fields';

export default Ember.Route.extend({
    model() {
        return {
            editorContent: mockAwardNotice,
            mergeFields: this.normalizeMergeFields()
        }
    },


    normalizeMergeFields() {
        let results = [];

        for(let i = 0; i < mockMergeFields.mergeGroups.length; i++){
            let group = mockMergeFields.mergeGroups[i],
                // copy over treeView if it exists
                branch  = group.treeView ? {name: group.displayName, treeView: group.treeView} : {name: group.displayName};

            if(group.mergeFields && group.mergeFields.length){
                branch.children = [];

                for(let x = 0; x < group.mergeFields.length; x++){
                    let field = group.mergeFields[x];
                    // copy over treeView if it exists
                    field.treeView ? branch.children.push({name: field.displayName, placeholder: field.fieldName, treeView: field.treeView}) : branch.children.push({name: field.displayName, placeholder: field.fieldName});
                }
            }

            results.push(branch);
        }

        return results;
    }
});
