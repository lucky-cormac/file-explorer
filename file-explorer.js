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
          type: 'folder',
          name: 'ChildDocuments',
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

function TreeNode(id, type, name, modified, size, children) {
  this.id = id;
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
    return null;
  }

  var child = null;
  var container = document.createElement('div');

  var folderEntry = document.createElement('div');
  folderEntry.className = 'folder-level-' + level;
  folderEntry.addEventListener('click', function() {
    node.toggleExpansion();

    if (!node.children) {
      return;
    }

    if (node.expanded) {
      for (var i = 0; i < node.children.length; i++) {
        child = generateFolderNodesDom(node.children[i], level + 1);
        if (child) {
          document.getElementById(node.id + '-children').appendChild(child);
        }
      }
    } else {
      document.getElementById(node.id + '-children').innerHTML = '';
    }
  });
  var folderName = document.createTextNode(node.name);
  folderEntry.appendChild(folderName);

  var folderChildren = document.createElement('div');
  folderChildren.className = 'folder-children';
  folderChildren.id = node.id + '-children';

  container.appendChild(folderEntry);
  container.appendChild(folderChildren);

  return container;
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
  var nodesDom = generateFolderNodesDom(this.root, 1);
  document.getElementById(this.containerId).appendChild(nodesDom);
};

function generateTreeNodes(data, level) {
  var nodeLevel = level || 1;
  var treeNode = new TreeNode(data.name + '-' + nodeLevel, data.type, data.name, data.modified, data.size, null);
  if (data.type === NODE_TYPES.FILE || !data.children) {
    return treeNode;
  }
  treeNode.children = [];
  data.children.forEach(function(child) {
    treeNode.addChild(generateTreeNodes(child, nodeLevel + 1)); 
  });
  return treeNode;
}

var leftPanel = new LeftPanel('left-panel', generateTreeNodes(data));
leftPanel.render();
