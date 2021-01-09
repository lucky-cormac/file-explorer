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

var treeNodes = generateTreeNodes(data);
var fileExplorer = new FileExplorer('file-explorer', treeNodes);
fileExplorer.render();
