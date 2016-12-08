/* jshint node: true */

var TYPE_COMPONENT = 'component',
    TYPE_SERVICE   = 'service',
    TYPE_MIXIN     = 'mixin',
    TYPE_UTILITY   = 'utility';

var BOWER_ROOT = 'bower_components';

module.exports = {
  'active-user': {
    name: 'active-user',
    prettyName: 'ActiveUser',
    type: [TYPE_SERVICE, TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'anchor-to': {
    name: 'anchor-to',
    prettyName: 'AnchorTo',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'ck-editor': {
    name: 'ck-editor',
    prettyName: 'CKEditor',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0'],
    bower: {
      dependencies: {ckeditor: "^4.5.10"}
    },
    node: {
      devDependencies: {'broccoli-funnel': "^1.0.6"}
    }
  },


  'collapse-pane': {
    name: 'collapse-pane',
    prettyName: 'CollapsePane',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0'],
    requires: {
      'component-utils': 'latest'
    }
  },


  'component-utils': {
    name: 'component-utils',
    prettyName: 'Component Utilities',
    type: [TYPE_MIXIN, TYPE_UTILITY],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'data-grid': {
    name: 'data-grid',
    prettyName: 'DataGrid',
    type: [TYPE_COMPONENT],
    latest: '1.0.0-alpha',
    versions: ['1.0.0-alpha'],
    requires: {
      'sort-list': 'latest',
      'paged-list': 'latest'
    }
  },


  'datetime-picker': {
    name: 'datetime-picker',
    prettyName: 'DateTime Picker',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0'],
    node: {
      dependencies: {
        "eonasdan-bootstrap-datetimepicker": "^4.17.42"
      },
      devDependencies: {
        "broccoli-funnel": "^1.0.6",
        "broccoli-merge-trees": "^1.1.1",
        "ember-cli-moment-shim": "2.2.1"
      }
    }
  },


  'dropdown-list': {
    name: 'dropdown-list',
    prettyName: 'Dropdown List',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0'],
    requires: {
      'component-utils': 'latest'
    }
  },


  'modal-window': {
    name: 'modal-window',
    prettyName: 'Modal Window',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'paged-list': {
    name: 'paged-list',
    prettyName: 'Paged List',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'select-input': {
    name: 'select-input',
    prettyName: 'Select Input',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'sort-list': {
    name: 'sort-list',
    prettyName: 'Sort List',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0']
  },


  'tab-list': {
    name       : 'tab-list',
    prettyName : 'TabList',
    type       : [TYPE_COMPONENT],
    latest     : '1.0.0',
    versions   : ['1.0.0'],
    requires   : {'component-utils': 'latest'}
  },


  'tool-tip': {
    name: 'tool-tip',
    prettyName: 'ToolTip',
    type: [TYPE_COMPONENT],
    latest: '1.0.0',
    versions: ['1.0.0'],
    bower: {
      dependencies: {tooltipster: '~3.3.0'}
    }
  },


  'tree-view': {
    name       : 'tree-view',
    prettyName : 'TreeView',
    type       : [TYPE_COMPONENT],
    latest     : '1.0.0',
    versions   : ['1.0.0']
  },


  'webtrend-analytics': {
    name: 'webtrend-analytics',
    prettyName: 'WebTrend Analytics',
    type: [TYPE_SERVICE, TYPE_COMPONENT, TYPE_MIXIN],
    latest: '1.0.0',
    versions: ['1.0.0']
  }
};
