YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Components.AnchorTo",
        "Components.CKEditor",
        "Components.CollapsePane",
        "Components.CollapsePaneBody",
        "Components.CollapsePaneToggle",
        "Components.ToolTip",
        "Mixins.ComponentChild",
        "Mixins.ComponentParent",
        "Mixins.WindowScrollObserver"
    ],
    "modules": [
        "anchor-to",
        "ck-editor",
        "collapse-pane",
        "component-utils",
        "components",
        "mixins",
        "tool-tip"
    ],
    "allModules": [
        {
            "displayName": "anchor-to",
            "name": "anchor-to"
        },
        {
            "displayName": "ck-editor",
            "name": "ck-editor"
        },
        {
            "displayName": "collapse-pane",
            "name": "collapse-pane"
        },
        {
            "displayName": "component-utils",
            "name": "component-utils",
            "description": "Reusable mixins and utilities for Ember components."
        },
        {
            "displayName": "components",
            "name": "components",
            "description": "The AnchorTo component lets you simulate the functionality of using an anchor to jump to another area of content within the\nsame document while using [Ember's \"hash\"](http://emberjs.com/api/classes/Ember.Location.html) location type.\n\nA simple example:\n\n    {{anchor-to href=\"#mainContent\"}}Jump to content{{anchor-to}}\n\n    .\n    .\n    .\n\n    {{!Further down the page}}\n    <div id=\"mainContent\">\n        <p>Hello World!</p>\n    </div>"
        },
        {
            "displayName": "mixins",
            "name": "mixins",
            "description": "Component mixins."
        },
        {
            "displayName": "tool-tip",
            "name": "tool-tip"
        }
    ],
    "elements": []
} };
});