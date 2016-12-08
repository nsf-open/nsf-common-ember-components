export default {
    "mergeGroups": [{
        "groupID": "Panel_grp",
        "groupName": "Panel_Merge_grp",
        "displayName": "Panel Merge Group",
        "groupDesc": "A group of Panel merge fields",
        "treeView": {
          "startCollapsed": false
        },
        "mergeFields": [{
            "fieldID": "Panel_Id",
            "fieldName": "Panel_Id",
            "displayName": "Panel ID",
            "fieldDesc": "Unique identification of panel",
            "readOnly": true,
            "removable": false,
            "clause": false
        }, {
            "fieldID": "Panel_Desc",
            "fieldName": "Panel_Desc",
            "displayName": "Panel Description",
            "fieldDesc": "Description of panel",
            "readOnly": true,
            "removable": false,
            "clause": false
        }, {
            "fieldID": "Panel_Date",
            "fieldName": "Panel_Date",
            "displayName": "Panel Date",
            "fieldDesc": "Date of panel",
            "readOnly": true,
            "removable": false,
            "clause": false
        }]
    }, {
        "groupID": "Award_grp",
        "groupName": "Award_Merge_grp",
        "displayName": "Award Merge Group",
        "groupDesc": "A group of Award merge fields",
        "mergeFields": [{
            "fieldID": "Award_exp_date",
            "fieldName": "Award_exp_date",
            "displayName": "Award Expiration Date",
            "fieldDesc": "Expiration date of award",
            "readOnly": true,
            "removable": false,
            "clause": false
        }, {
            "fieldID": "Award_Id",
            "fieldName": "Award_Id",
            "displayName": "Award ID",
            "fieldDesc": "Unique identification of award",
            "readOnly": true,
            "removable": false,
            "clause": false
        }, {
            "fieldID": "Award_Desc",
            "fieldName": "Award_Desc",
            "displayName": "Award Description",
            "fieldDesc": "Description of award",
            "readOnly": true,
            "removable": false,
            "clause": false
        }, {
            "fieldID": "Award_Date",
            "fieldName": "Award_Date",
            "displayName": "Award Date",
            "fieldDesc": "Date of award",
            "readOnly": true,
            "removable": false,
            "clause": false
        }]
    }]
}
