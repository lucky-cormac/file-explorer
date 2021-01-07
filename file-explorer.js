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
