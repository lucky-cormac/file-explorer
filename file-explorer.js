// Node types
var NODE_TYPES = {
  FILE: 'file',
  FOLDER: 'folder'
};

var CSS_CLASSES = {
  FOLDER_ENTRY: 'folder-entry',
  FOLDER_CHILDREN: 'folder-children',
  FOLDER_WRAPPER: 'folder-wrapper',
  FOLDER_VIEW: 'folder-view',
  SELECTED: 'selected',
  CARET_ICON: 'caret-icon',
  FA_CARET_DOWN: 'fas fa-caret-down',
  FA_CARET_RIGHT: 'fas fa-caret-right',
  FA_FOLDER_OPEN: 'fas fa-folder-open',
  FA_FILE: 'far fa-file',
  FOLDER_ICON: 'folder-icon',
  ITEM_ICON: 'item-icon',
  ITEM_NAME: 'item-name',
  ITEM_MODIFIED: 'item-modified',
  ITEM_SIZE: 'item-size',
  LEFT_PANEL: 'left-panel',
  RIGHT_PANEL: 'right-panel'
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
    iconContainer.className = CSS_CLASSES.CARET_ICON;
    if (nodeHasChildFolder(node)) {
      var caretIcon = document.createElement('i');
      caretIcon.className = node.expanded ? CSS_CLASSES.FA_CARET_DOWN : CSS_CLASSES.FA_CARET_RIGHT;
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
              nodeDom.parentElement.children[1].appendChild(child);
            }
          }
        } else {
          nodeDom.parentElement.children[1].innerHTML = '';
        }
      });
      iconContainer.appendChild(caretIcon);
    }
    
    nodeDom.appendChild(iconContainer);
  }

  function addFolderWrapper(nodeDom, node) {
    var folderWrapper = document.createElement('div');
    folderWrapper.className = CSS_CLASSES.FOLDER_WRAPPER;
    if (explorerRef.selectedFolder === node) {
      folderWrapper.className = CSS_CLASSES.FOLDER_WRAPPER + ' ' + CSS_CLASSES.SELECTED;
    }

    folderWrapper.addEventListener('click', function() {
      explorerRef.selectedFolder = node;
      var folderWrappers = document.getElementsByClassName(CSS_CLASSES.FOLDER_WRAPPER);
      for (var i = 0; i < folderWrappers.length; i++) {
        folderWrappers[i].classList.remove('selected');
      }
      this.classList.add('selected');

      var folderItemsDom = generateFolderViewDom(node);
      var folderViewFrame = document.getElementsByClassName(CSS_CLASSES.FOLDER_VIEW)[0];
      folderViewFrame.children[1].remove();
      folderViewFrame.appendChild(folderItemsDom);
    });

    var folderIcon = document.createElement('i');
    folderIcon.className = CSS_CLASSES.FOLDER_ICON + ' ' + CSS_CLASSES.FA_FOLDER_OPEN;
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
    folderEntry.className = CSS_CLASSES.FOLDER_ENTRY;

    addCaretIcon(folderEntry, node);
    addFolderWrapper(folderEntry, node);
  
    var folderChildren = document.createElement('div');
    folderChildren.className = CSS_CLASSES.FOLDER_CHILDREN;

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
    table.className = CSS_CLASSES.FOLDER_VIEW;
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '7');
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th class="item-icon"></th><th class="item-name">Name</th><th class="item-modified">Date Modified</th><th class="item-size">File Size</th></tr>';
    var tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
  }

  function generateItemViewEntry(node) {
    var itemIcon = document.createElement('i');
    itemIcon.className = node.type === NODE_TYPES.FOLDER ? CSS_CLASSES.ITEM_ICON + ' ' + CSS_CLASSES.FA_FOLDER_OPEN : CSS_CLASSES.ITEM_ICON + ' ' + CSS_CLASSES.FA_FILE;
    var itemName = document.createTextNode(node.name);
    var itemModified = document.createTextNode(node.modified.toLocaleDateString());
    var itemSize = document.createTextNode(node.size ? node.size + 'KB' : '');

    var itemIconContainer = document.createElement('td');
    itemIconContainer.className = CSS_CLASSES.ITEM_ICON;
    itemIconContainer.appendChild(itemIcon);

    var itemNameContainer = document.createElement('td');
    itemNameContainer.className = CSS_CLASSES.ITEM_NAME;
    itemNameContainer.appendChild(itemName);

    var itemModifiedContainer = document.createElement('td');
    itemModifiedContainer.className = CSS_CLASSES.ITEM_MODIFIED;
    itemModifiedContainer.appendChild(itemModified);

    var itemSizeContainer = document.createElement('td');
    itemSizeContainer.className = CSS_CLASSES.ITEM_SIZE;
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
  leftPanel.className = CSS_CLASSES.LEFT_PANEL;
  leftPanel.appendChild(folderNodesDom);
  
  var folderViewFrame = generateFolderViewFrame();
  var rightPanel = document.createElement('div');
  rightPanel.className = CSS_CLASSES.RIGHT_PANEL;
  rightPanel.appendChild(folderViewFrame);

  var explorerContainer = document.getElementById(this.containerId);
  explorerContainer.appendChild(leftPanel);
  explorerContainer.appendChild(rightPanel);
};
