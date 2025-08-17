import React, { useState } from 'react';
import FileList from './FileList';
import './File.css';

const File = ({ files: initialFiles, inputBox: inputBoxProp }) => {
  const [files, setFiles] = useState(initialFiles || []);
  
  const [inputValue, setInputValue] = useState('');
  
  const [showMessage, setShowMessage] = useState(false);
  
  const [activeFolderPath, setActiveFolderPath] = useState([]);
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingItem, setPendingItem] = useState({ name: '', path: [] });
  const [itemType, setItemType] = useState('file'); // 'file' or 'folder'

  const handleAddItem = (targetPath = activeFolderPath) => {
    if (inputValue.trim() === '') {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    setPendingItem({ name: inputValue.trim(), path: targetPath });
    setShowConfirmDialog(true);
  };

  const confirmAddItem = (type) => {
    const newItem = {
      name: pendingItem.name
    };

    if (type === 'folder') {
      newItem.isOpen = false;
      newItem.files = [];
    }

    if (pendingItem.path.length === 0) {
      setFiles(prevFiles => [...prevFiles, newItem]);
    } else {
      setFiles(prevFiles => addItemToFolder(prevFiles, pendingItem.path, newItem));
    }
    
    setInputValue('');
    setShowMessage(false);
    setShowConfirmDialog(false);
    setPendingItem({ name: '', path: [] });
  };

  const cancelAddItem = () => {
    setShowConfirmDialog(false);
    setPendingItem({ name: '', path: [] });
  };

  const addItemToFolder = (items, path, newItem) => {
    if (path.length === 1) {
      return items.map((item, index) => {
        if (index === path[0]) {
          return {
            ...item,
            files: [...(item.files || []), newItem]
          };
        }
        return item;
      });
    }

    return items.map((item, index) => {
      if (index === path[0]) {
        return {
          ...item,
          files: addItemToFolder(item.files || [], path.slice(1), newItem)
        };
      }
      return item;
    });
  };

  const updateItem = (path, updatedItem) => {
    setFiles(prevFiles => updateItemRecursively(prevFiles, path, updatedItem));
  };

  const updateItemRecursively = (items, path, updatedItem) => {
    if (path.length === 1) {
      return items.map((item, index) => 
        index === path[0] ? updatedItem : item
      );
    }

    return items.map((item, index) => {
      if (index === path[0]) {
        return {
          ...item,
          files: updateItemRecursively(item.files || [], path.slice(1), updatedItem)
        };
      }
      return item;
    });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const getActiveFolderName = () => {
    if (activeFolderPath.length === 0) return "Root";
    
    let current = files;
    let folderName = "";
    
    for (let i = 0; i < activeFolderPath.length; i++) {
      current = current[activeFolderPath[i]];
      if (i === activeFolderPath.length - 1) {
        folderName = current.name;
      } else {
        current = current.files || [];
      }
    }
    
    return folderName || "Root";
  };

  const getBreadcrumbPath = () => {
    if (activeFolderPath.length === 0) return [];
    
    const breadcrumbs = [];
    let current = files;
    
    for (let i = 0; i < activeFolderPath.length; i++) {
      current = current[activeFolderPath[i]];
      breadcrumbs.push({
        name: current.name,
        path: activeFolderPath.slice(0, i + 1)
      });
      current = current.files || [];
    }
    
    return breadcrumbs;
  };
  const getTargetFolderName = (path) => {
    if (path.length === 0) return "Root";
    
    let current = files;
    let folderName = "";
    
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
      if (i === path.length - 1) {
        folderName = current.name;
      } else {
        current = current.files || [];
      }
    }
    
    return folderName || "Root";
  };

  const navigateToPath = (path) => {
    setActiveFolderPath(path);
  };

  const handleAddToFolder = (targetPath) => {
    handleAddItem(targetPath);
  };

  return (
    <div className="file-explorer">
      <div className="input-section">
        <div className="breadcrumb-section">
          <div className="breadcrumb-path">
            <button 
              onClick={() => navigateToPath([])} 
              className={`breadcrumb-item ${activeFolderPath.length === 0 ? 'active' : ''}`}
            >
              📁 Root
            </button>
            {getBreadcrumbPath().map((crumb, index) => (
              <span key={index} className="breadcrumb-chain">
                <span className="breadcrumb-separator"> / </span>
                <button 
                  onClick={() => navigateToPath(crumb.path)} 
                  className="breadcrumb-item"
                >
                  📁 {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <div className="location-info">
            <span className="current-location">Creating in: <strong>{getActiveFolderName()}</strong></span>
          </div>
        </div>
        <div className="input-controls">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter file or folder name"
            className="file-input"
          />
          <button onClick={() => handleAddItem()} className="add-button">
            +
          </button>
        </div>
      </div>
      
      {showMessage && (
        <div className="message">
          Please enter a name
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Create New Item</h3>
            <p>What would you like to create?</p>
            <div className="item-preview">
              <strong>Name:</strong> {pendingItem.name}
            </div>
            <div className="item-preview">
              <strong>Location:</strong> {getTargetFolderName(pendingItem.path)}
            </div>
            <div className="dialog-buttons">
              <button 
                onClick={() => confirmAddItem('file')} 
                className="confirm-button file-button"
              >
                📄 Create File
              </button>
              <button 
                onClick={() => confirmAddItem('folder')} 
                className="confirm-button folder-button"
              >
                📁 Create Folder
              </button>
              <button 
                onClick={cancelAddItem} 
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="file-tree">
        <FileList 
          files={files} 
          onUpdateItem={updateItem}
          onAddItem={handleAddToFolder}
          onSetActiveFolder={setActiveFolderPath}
          activeFolderPath={activeFolderPath}
          basePath={[]}
        />
      </div>
    </div>
  );
};

export default File;