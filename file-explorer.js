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
  this.expanded = false;
}

TreeNode.prototype.toggleExpansion = function() {
  this.expanded = !this.expanded;
};

TreeNode.prototype.addChild = function(child) {
  if (!this.children) {
    this.children = [];
  }
  this.children.push(child);
};

function LeftPanel(containerId, root) {
  this.containerId = containerId;
  this.root = root;
  this.selectedFolder = root;
}

function generateFolderNodesDom(node, level) {
  if (node.type === NODE_TYPES.FILE) {
    return '';
  }
  var result = '<div class="folder-level-' + level + '">' + node.name + '</div>';
  if (!node.children || !node.expanded) {
    return result;
  }

  result += '<div class="folder-children">';
  for (var i = 0; i < node.children.length; i++) {
    result += generateFolderNodesDom(node.children[i], level + 1);
  }
  result += '</div>';

  return result;
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
  var nodesDom = generateFolderNodesDom(this.root, 0);
  document.getElementById(this.containerId).innerHTML = nodesDom;
};

function generateTreeNodes(data) {
  var treeNode = new TreeNode(data.type, data.name, data.modified, data.size, null);
  if (data.type === NODE_TYPES.FILE || !data.children) {
    return treeNode;
  }
  treeNode.children = [];
  data.children.forEach(function(child) {
    treeNode.addChild(generateTreeNodes(child)); 
  });
  return treeNode;
}

var leftPanel = new LeftPanel('left-panel', generateTreeNodes(data));
leftPanel.render();
