const data = {
  type: 'folder',
  name: 'Files',
  modified: new Date(),
  size: null,
  children: [
    {
      type: 'folder',
      name: 'Documents',
      modified: new Date(),
      size: null,
      children: [
        {
          type: 'file',
          name: 'Document.txt',
          modified: new Date(),
          size: 1024,
          children: null
        }
      ]
    }, {
      type: 'folder',
      name: 'Images',
      modified: new Date(),
      size: null,
      children: []
    }, {
      type: 'folder',
      name: 'System',
      modified: new Date(),
      size: null,
      children: []
    }, {
      type: 'file',
      name: 'Description.rtf',
      modified: new Date(),
      size: 1024,
      children: null
    }, {
      type: 'file',
      name: 'Description.txt',
      modified: new Date(),
      size: 2048,
      children: null
    }
  ]
};

var NODE_TYPES = {
  FILE: 'file',
  FOLDER: 'folder'
};

function TreeNode(type, name, modified, size, children) {
  this.type = type;
  this.name = name;
  this.modified = modified;
  this.size = size;
  this.children = children;
}

TreeNode.prototype.addChild = function(child) {
  this.children.push(child);
};

function LeftPanel(containerId, root) {
  this.containerId = containerId;
  this.root = root;
  this.selectedFolder = root;
}

function renderFolderNodes(root, level) {
  
}

LeftPanel.prototype.getRoot = function() {
  return this.root;
};

LeftPanel.prototype.setRoot = function(root) {
  this.root = root;
};

LeftPanel.prototype.getSelectedFolder = function() {
  return this.selectedFolder;
};

LeftPanel.prototype.setSelectedFolder = function(selectedFolder) {
  this.selectedFolder = selectedFolder;
}

LeftPanel.prototype.render = function() {
  
};
