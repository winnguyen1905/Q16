import React from 'react';

const FileList = ({ files, onUpdateItem, onAddItem, onSetActiveFolder, activeFolderPath, basePath, level = 0 }) => {
  const handleFolderClick = (index, item) => {
    if (item.isOpen !== undefined || item.files) {
      const updatedItem = {
        ...item,
        isOpen: !item.isOpen
      };
      onUpdateItem([...basePath, index], updatedItem);
      
      if (updatedItem.isOpen) {
        onSetActiveFolder([...basePath, index]);
      }
    }
  };

  const handleFileDoubleClick = (index, item) => {
    if (item.isOpen === undefined && !item.files) {
      const updatedItem = {
        ...item,
        isOpen: false,
        files: []
      };
      onUpdateItem([...basePath, index], updatedItem);
    }
  };

  const isFolder = (item) => {
    return item.isOpen !== undefined || item.files !== undefined;
  };

  const isActivePath = (path) => {
    return JSON.stringify(path) === JSON.stringify(activeFolderPath);
  };

  return (
    <div className="file-list">
      {files.map((item, index) => {
        const itemIsFolder = isFolder(item);
        const currentPath = [...basePath, index];
        const isActive = isActivePath(currentPath);
        
        return (
          <div key={index} className="file-item">
            <div 
              className={`item-row ${itemIsFolder ? 'folder' : 'file'} ${isActive ? 'active' : ''}`}
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
              {itemIsFolder && (
                <button 
                  className="add-to-folder-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddItem(currentPath);
                  }}
                  title="Add to this folder"
                >
                  +
                </button>
              )}
            </div>
            
            {itemIsFolder && item.isOpen && item.files && (
              <FileList
                files={item.files}
                onUpdateItem={onUpdateItem}
                onAddItem={onAddItem}
                onSetActiveFolder={onSetActiveFolder}
                activeFolderPath={activeFolderPath}
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