import React from 'react';

const FileList = ({ files, onUpdateItem, basePath, level = 0 }) => {
  // handle folder click (toggle open/closed)
  const handleFolderClick = (index, item) => {
    if (item.isOpen !== undefined || item.files) {
      const updatedItem = {
        ...item,
        isOpen: !item.isOpen
      };
      onUpdateItem([...basePath, index], updatedItem);
    }
  };

  // Handle doubleclick on file (  convert to folder)
  const handleFileDoubleClick = (index, item) => {
    /// Only convert iff it's not already a folder
    if (item.isOpen === undefined && !item.files) {
      const updatedItem = {
        ...item,
        isOpen: false,
        files: []
      };
      onUpdateItem([...basePath, index], updatedItem);
    }
  };

  // Checkk if item is a folder
  const isFolder = (item) => {
    return item.isOpen !== undefined || item.files !== undefined;
  };

  return (
    <div className="file-list">
      {files.map((item, index) => {
        const itemIsFolder = isFolder(item);
        const currentPath = [...basePath, index];
        
        return (
          <div key={index} className="file-item">
            <div 
              className={`item-row ${itemIsFolder ? 'folder' : 'file'}`}
              style={{ paddingLeft: `${level * 20}px` }}
              onClick={() => handleFolderClick(index, item)}
              onDoubleClick={() => handleFileDoubleClick(index, item)}
            >
              <span className="item-icon">
                {itemIsFolder ? (item.isOpen ? '📂' : '📁') : '📄'}
              </span>
              <span className="item-name">{item.name}</span>
              {itemIsFolder && (
                <span className="folder-indicator">
                  {item.isOpen ? '▼' : '▶'}
                </span>
              )}
            </div>
            
            {/* rendering children if folder is open .... */}
            {itemIsFolder && item.isOpen && item.files && (
              <FileList
                files={item.files}
                onUpdateItem={onUpdateItem}
                basePath={currentPath}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileList;