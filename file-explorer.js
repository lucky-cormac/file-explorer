// Node types
var NODE_TYPES = {
  FILE: 'file',
  FOLDER: 'folder'
};

// TreeNode Structure
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

// File Explorer
function FileExplorer(containerId, root) {
  this.containerId = containerId;
  this.root = root;
}

FileExplorer.prototype.getRoot = function() {
  return this.root;
};

FileExplorer.prototype.setRoot = function(root) {
  this.root = root;
};

FileExplorer.prototype.getSelectedFolder = function() {
  return this.selectedFolder;
};

FileExplorer.prototype.setSelectedFolder = function(selectedFolder) {
  this.selectedFolder = selectedFolder;
}

FileExplorer.prototype.render = function() {
  var explorerRef = this;

  function nodeHasChildFolder(node) {
    if (!node.children || !node.children.length) {
      return false;
    }
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].type === NODE_TYPES.FOLDER) {
        return true;
      }
    }
    return false;
  }

  function toggleCaretIcon(icon) {
    if (icon.classList.contains('fa-caret-right')) {
      icon.classList.remove('fa-caret-right');
      icon.classList.add('fa-caret-down');
    } else if (icon.classList.contains('fa-caret-down')) {
      icon.classList.remove('fa-caret-down');
      icon.classList.add('fa-caret-right');
    }
  }

  function addCaretIcon(nodeDom, node) {
    var child = null;
    var iconContainer = document.createElement('div');
    iconContainer.className = 'caret-icon';
    if (nodeHasChildFolder(node)) {
      var caretIcon = document.createElement('i');
      caretIcon.className = node.expanded ? 'fas fa-caret-down' : 'fas fa-caret-right';
      caretIcon.addEventListener('click', function() {
        node.toggleExpansion();
        toggleCaretIcon(this);
    
        if (!node.children) {
          return;
        }
    
        if (node.expanded) {
          for (var i = 0; i < node.children.length; i++) {
            child = generateFolderNodesDom(node.children[i]);
            if (child) {
              document.getElementById(node.id + '-children').appendChild(child);
            }
          }
        } else {
          document.getElementById(node.id + '-children').innerHTML = '';
        }
      });
      iconContainer.appendChild(caretIcon);
    }
    
    nodeDom.appendChild(iconContainer);
  }

  function addFolderWrapper(nodeDom, node) {
    var folderWrapper = document.createElement('div');
    folderWrapper.className = 'folder-wrapper';
    if (explorerRef.selectedFolder === node) {
      folderWrapper.className = 'folder-wrapper selected';
    }

    folderWrapper.addEventListener('click', function() {
      explorerRef.selectedFolder = node;
      var folderWrappers = document.getElementsByClassName('folder-wrapper');
      for (var i = 0; i < folderWrappers.length; i++) {
        folderWrappers[i].classList.remove('selected');
      }
      this.classList.add('selected');

      var folderItemsDom = generateFolderViewDom(node);
      var folderViewFrame = document.getElementById('folder-view');
      if (folderViewFrame.children.length === 2) {
        folderViewFrame.children[1].remove();
      }
      folderViewFrame.appendChild(folderItemsDom);
    });

    var folderIcon = document.createElement('i');
    folderIcon.className = 'folder-icon fas fa-folder-open';
    folderWrapper.appendChild(folderIcon);

    var folderName = document.createTextNode(node.name);
    folderWrapper.appendChild(folderName);

    nodeDom.appendChild(folderWrapper);
  }

  function generateFolderNodesDom(node) {
    if (node.type === NODE_TYPES.FILE) {
      return null;
    }
  
    var child = null;
    var container = document.createElement('div');
  
    var folderEntry = document.createElement('div');
    folderEntry.className = 'folder-entry';
    folderEntry.id = node.id + '-entry';

    addCaretIcon(folderEntry, node);
    addFolderWrapper(folderEntry, node);
  
    var folderChildren = document.createElement('div');
    folderChildren.className = 'folder-children';
    folderChildren.id = node.id + '-children';

    if (node.expanded && node.children) {
      for (var i = 0; i < node.children.length; i++) {
        child = generateFolderNodesDom(node.children[i]);
        if (child) {
          folderChildren.appendChild(child);
        }
      }
    }
  
    container.appendChild(folderEntry);
    container.appendChild(folderChildren);
  
    return container;
  }

  function generateFolderViewFrame() {
    var table = document.createElement('table');
    table.id = 'folder-view';
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '7');
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th class="item-icon"></th><th class="item-name">Name</th><th class="item-modified">Date Modified</th><th class="item-size">File Size</th></tr>';
    table.appendChild(thead);
    return table;
  }

  function generateItemViewEntry(node) {
    var itemIcon = document.createElement('i');
    itemIcon.className = node.type === NODE_TYPES.FOLDER ? 'item-icon fas fa-folder-open' : 'item-icon far fa-file';
    var itemName = document.createTextNode(node.name);
    var itemModified = document.createTextNode(node.modified.toLocaleDateString());
    var itemSize = document.createTextNode(node.size ? node.size + 'KB' : '');

    var itemIconContainer = document.createElement('td');
    itemIconContainer.className = 'item-icon';
    itemIconContainer.appendChild(itemIcon);

    var itemNameContainer = document.createElement('td');
    itemNameContainer.className = 'item-name';
    itemNameContainer.appendChild(itemName);

    var itemModifiedContainer = document.createElement('td');
    itemModifiedContainer.className = 'item-modified';
    itemModifiedContainer.appendChild(itemModified);

    var itemSizeContainer = document.createElement('td');
    itemSizeContainer.className = 'item-size';
    itemSizeContainer.appendChild(itemSize);

    var itemViewEntry = document.createElement('tr');
    itemViewEntry.appendChild(itemIconContainer);
    itemViewEntry.appendChild(itemNameContainer);
    itemViewEntry.appendChild(itemModifiedContainer);
    itemViewEntry.appendChild(itemSizeContainer);

    return itemViewEntry;
  }

  function generateFolderViewDom(node) {
    var folderViewBody = document.createElement('tbody');

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        folderViewBody.appendChild(generateItemViewEntry(node.children[i]));
      }
    }
  
    return folderViewBody;
  }

  var folderNodesDom = generateFolderNodesDom(this.root);
  var leftPanel = document.createElement('div');
  leftPanel.className = 'left-panel';
  leftPanel.appendChild(folderNodesDom);
  
  var folderViewFrame = generateFolderViewFrame();
  var rightPanel = document.createElement('div');
  rightPanel.className = 'right-panel';
  rightPanel.appendChild(folderViewFrame);

  var explorerContainer = document.getElementById(this.containerId);
  explorerContainer.appendChild(leftPanel);
  explorerContainer.appendChild(rightPanel);
};
